import { BASE_PRECISION, BN, BulkAccountLoader, DriftClient, getMarketOrderParams, initialize, PerpMarketConfig, PerpMarkets, PositionDirection, QUOTE_PRECISION, SpotMarketConfig, SpotMarkets, User, Wallet } from '@drift-labs/sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { SecretMissingError } from '../config/error';

@Injectable()
export class DriftTradingService {
    private connection: Connection
    private driftConfig: ReturnType<typeof initialize>
    private market: PerpMarketConfig
    private accountLoader: BulkAccountLoader
    private usdcTokenAddress = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
    private usdcMarket: SpotMarketConfig

    constructor(
        private readonly config: ConfigService
    ) {
        const rpcUrl = this.config.get<string>('solana.rpc');
        const market = PerpMarkets["mainnet-beta"].find(m => m.baseAssetSymbol === "1MBONK")
        const usdcMarket = SpotMarkets["mainnet-beta"].find(m => m.symbol === "USDC")

        if (!rpcUrl) throw new SecretMissingError('solana.rpc')
        if (!market) throw new Error("Drift 1MBONK Market doesn't exist")
        if (!usdcMarket) throw new Error("Drift USDC Market doesn't exist")

        this.connection = new Connection(rpcUrl)
        this.accountLoader = new BulkAccountLoader(
            this.connection,
            'confirmed',
            1000
        )
        this.driftConfig = initialize({ env: 'mainnet-beta' })
        this.market = market
        this.usdcMarket = usdcMarket
    }

    private async withDriftClient<T, ReturnT> (keypair: Keypair, args: T[], executable: (driftClient: DriftClient, ...args: T[]) => Promise<ReturnT>) {
        const driftClient = new DriftClient({
            connection: this.connection,
            wallet: new Wallet(keypair),
            programID: new PublicKey(this.driftConfig.DRIFT_PROGRAM_ID),
            accountSubscription: {
                type: 'polling',
                accountLoader: this.accountLoader
            },
        });
        await driftClient.subscribe()
        const result = await executable(driftClient, ...args)
        await driftClient.unsubscribe()
        return result
    }

    private async withUserClient<T, ReturnT> (keypair: Keypair, args: T[], executable: (driftClient: DriftClient, userClient: User, ...args: T[]) => Promise<ReturnT>) {
        return this.withDriftClient(
            keypair,
            [],
            async (driftClient) => {
                const userAccountPublicKey = await driftClient.getUserAccountPublicKey()
                const userClient = new User({
                    driftClient,
                    userAccountPublicKey,
                    accountSubscription: {
                        type: 'polling',
                        accountLoader: this.accountLoader,
                    },
                });
                await userClient.subscribe()
                const result = await executable(driftClient, userClient, ...args)
                await userClient.unsubscribe()
                return result
            }
        )
    }

    public async initializeUser (keypair: Keypair, amount: number) {
        return this.withDriftClient(
            keypair,
            [amount],
            async (driftClient, amount) => {
                const depositAmount = new BN(amount).mul(QUOTE_PRECISION)
                const { ixs } = await driftClient.createInitializeUserAccountAndDepositCollateralIxs(
                    depositAmount,
                    getAssociatedTokenAddressSync(this.usdcTokenAddress, driftClient.wallet.publicKey)
                )
                return ixs
            }
        )
    }

    public async placeOrder (keypair: Keypair, amount: number) {
        return this.withUserClient(
            keypair,
            [],
            async (driftClient, userClient) => {
                const marketAccount = driftClient.getPerpMarketAccount(this.market.marketIndex)
                if (!marketAccount) throw new Error('Market account not found')
                const signature = await driftClient.placePerpOrder(
                    getMarketOrderParams({
                        baseAssetAmount: new BN(Math.abs(amount)).mul(BASE_PRECISION),
                        direction: amount < 0 ? PositionDirection.SHORT : PositionDirection.LONG,
                        marketIndex: marketAccount.marketIndex
                    })
                )
                let filled = false
                while (!filled) {
                    const orders = userClient.getOpenOrders()
                    if (!orders.find(o => o.marketIndex === this.market.marketIndex)) {
                        filled = true
                    }
                    await new Promise(res => setTimeout(res, 1_000))
                }
                return { signature }
            }
        )
    }

    public async settlePNL (keypair: Keypair) {
        return this.withUserClient(
            keypair,
            [],
            async (driftClient, userClient) => {
                const account = userClient.getUserAccount()
                const signature = await driftClient.settlePNL(userClient.userAccountPublicKey, account, this.market.marketIndex)
                return { signature }
            }
        )
    }

    public async settleFundingPayment (keypair: Keypair) {
        return this.withUserClient(
            keypair,
            [],
            async (driftClient, userClient) => {
                const signature = await driftClient.settleFundingPayment(userClient.userAccountPublicKey)
                return { signature }
            }
        )
    }

    public async withdrawBalance (keypair: Keypair, amount: BN) {
        return this.withDriftClient(
            keypair,
            [],
            async (driftClient) => {
                const signature = await driftClient.withdraw(
                    amount,
                    this.usdcMarket.marketIndex,
                    getAssociatedTokenAddressSync(this.usdcTokenAddress, driftClient.wallet.publicKey)
                )
                return { signature }
            }
        )
    }

    public async getUserPosition (keypair: Keypair) {
        return this.withUserClient(
            keypair,
            [],
            async (driftClient, userClient) => {
                const position = userClient.getPerpPosition(this.market.marketIndex)
                if (!position || position.baseAssetAmount.eq(new BN(0))) return null
                
                const entry = position.quoteEntryAmount.toNumber()
                const priceData = driftClient.getOracleDataForPerpMarket(this.market.marketIndex)
                const currentValue = userClient.getPerpPositionValue(this.market.marketIndex, priceData).toNumber()
                const direction = entry < 0 ? "long" : "short"
        
                return {
                    amount: Math.abs(position.baseAssetAmount.toNumber()),
                    entry: Math.abs(entry),
                    currentValue,
                    direction
                }
            }
        )
    }

    public async getUserUSDBalance (keypair: Keypair) {
        return this.withUserClient(
            keypair,
            [],
            async (_, userClient) => {
                const balance = userClient.getTotalCollateral()
                return { balance }
            }
        )
    }

    public async closeUserAccount (keypair: Keypair) {
        return this.withDriftClient(
            keypair,
            [],
            async (driftClient) => {
                const signature = await driftClient.deleteUser()
                return { signature }
            }
        )
    }
}
