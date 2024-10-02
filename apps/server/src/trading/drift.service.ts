import { Injectable } from '@nestjs/common';
import { MatchInviteState } from '../generated/enum.types';
import { ConfigService } from '@nestjs/config';
import { Connection, PublicKey } from '@solana/web3.js';
import { SecretMissingError } from 'src/config/error';
import { BASE_PRECISION, BN, BulkAccountLoader, convertToNumber, DriftClient, getMarketOrderParams, initialize, PerpMarketConfig, PerpMarkets, PositionDirection, PRICE_PRECISION, QUOTE_PRECISION, SpotMarketConfig, SpotMarkets, User, Wallet } from '@drift-labs/sdk';
import { Keypair } from '@solana/web3.js';
import bs58 from "bs58"
import { getAssociatedTokenAddressSync } from '@solana/spl-token';

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

    private async withDriftClient<T, ReturnT> (privateKey: string, args: T[], executable: (driftClient: DriftClient, ...args: T[]) => Promise<ReturnT>) {
        const driftClient = new DriftClient({
            connection: this.connection,
            wallet: new Wallet(Keypair.fromSecretKey(bs58.decode(privateKey))),
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

    private async withUserClient<T, ReturnT> (privateKey: string, args: T[], executable: (driftClient: DriftClient, userClient: User, ...args: T[]) => Promise<ReturnT>) {
        return this.withDriftClient(
            privateKey,
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

    public async initializeUser (privateKey: string, amount: number) {
        return this.withDriftClient(
            privateKey,
            [amount],
            async (driftClient, amount) => {
                const depositAmount = new BN(amount).mul(QUOTE_PRECISION)
                const [signature] = await driftClient.initializeUserAccountAndDepositCollateral(
                    depositAmount,
                    getAssociatedTokenAddressSync(this.usdcTokenAddress, driftClient.wallet.publicKey)
                )
                return { signature }
            }
        )
    }

    public async placeOrder (privateKey: string, amount: number) {
        return this.withDriftClient(
            privateKey,
            [],
            async (driftClient) => {
                const marketAccount = driftClient.getPerpMarketAccount(this.market.marketIndex)
                if (!marketAccount) throw new Error('Market account not found')
                const signature = await driftClient.placePerpOrder(
                    getMarketOrderParams({
                        baseAssetAmount: new BN(Math.abs(amount)).mul(BASE_PRECISION),
                        direction: amount < 0 ? PositionDirection.SHORT : PositionDirection.LONG,
                        marketIndex: marketAccount.marketIndex
                    })
                )
                return { signature }
            }
        )
    }

    public async settlePNL (privateKey: string) {
        return this.withUserClient(
            privateKey,
            [],
            async (driftClient, userClient) => {
                const account = userClient.getUserAccount()
                const signature = await driftClient.settlePNL(userClient.userAccountPublicKey, account, this.market.marketIndex)
                return { signature }
            }
        )
    }

    public async settleFundingPayment (privateKey: string) {
        return this.withUserClient(
            privateKey,
            [],
            async (driftClient, userClient) => {
                const signature = await driftClient.settleFundingPayment(userClient.userAccountPublicKey)
                return { signature }
            }
        )
    }

    public async withdrawBalance (privateKey: string, amount: BN) {
        return this.withDriftClient(
            privateKey,
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

    public async getUserPosition (privateKey: string) {
        return this.withUserClient(
            privateKey,
            [],
            async (driftClient, userClient) => {
                const position = userClient.getPerpPosition(this.market.marketIndex)
                if (!position) throw new Error('No open position')
                const priceData = driftClient.getOracleDataForPerpMarket(this.market.marketIndex)
                const currentValue = userClient.getPerpPositionValue(this.market.marketIndex, priceData)
        
                return {
                    position,
                    currentValue
                }
            }
        )
    }

    public async getUserUSDBalance (privateKey: string) {
        return this.withUserClient(
            privateKey,
            [],
            async (_, userClient) => {
                const balance = userClient.getTotalCollateral()
                return { balance }
            }
        )
    }
}
