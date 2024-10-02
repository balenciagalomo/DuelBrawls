import { BN, BulkAccountLoader, DriftClient, PerpMarkets, Wallet, calculateBidAskPrice, initialize } from "@drift-labs/sdk";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { SupabaseClient, createClient as initSupabase } from "@supabase/supabase-js";
import { CronJob } from "cron";
import { config } from "dotenv";
config()

const driftEnv = 'mainnet-beta'
const RPC_URL = process.env.RPC_URL || ''
const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_KEY || ''
const SUPABASE_FEED_TABLE_NAME = process.env.SUPABASE_FEED_TABLE_NAME || ''
const MARKET_SYMBOL = "1MBONK"

async function setupDriftClient () {
    const signer = Keypair.generate()
    const connection = new Connection(RPC_URL)
    const sdkConfig = initialize({ env: driftEnv })
    const driftPublicKey = new PublicKey(sdkConfig.DRIFT_PROGRAM_ID)
    const bulkAccountLoader = new BulkAccountLoader(connection, 'confirmed', 1000)
    const wallet = new Wallet(signer)
    const driftClient = new DriftClient({
        connection: connection,
        wallet,
        programID: driftPublicKey,
        accountSubscription: {
            type: 'polling',
            accountLoader: bulkAccountLoader,
        },
    });
    await driftClient.subscribe()
    return driftClient
}

function getMarketIndex (symbol: string) {
    const marketInfo = PerpMarkets[driftEnv].find((market) => market.baseAssetSymbol === symbol)
    if (!marketInfo)  throw new Error(`Market $${symbol} not found.`)
    return marketInfo.marketIndex
}

function getCurrentAveragePrice (driftClient: DriftClient, marketIndex: number) {
    const marketAcc = driftClient.getPerpMarketAccount(marketIndex)
    if (!marketAcc) throw new Error(`Perp market account not found.`)
    const oracleData = driftClient.getOracleDataForPerpMarket(marketIndex)
    const [bid, ask] = calculateBidAskPrice(marketAcc.amm, oracleData)
    return bid.add(ask).div(new BN(2))
}

async function writePrice (supabase: SupabaseClient, price: BN) {
    const { error } = await supabase
        .from(SUPABASE_FEED_TABLE_NAME)
        .insert({
            symbol: MARKET_SYMBOL,
            price: price.toString(),
            exponent: 6,
            timestamp: new Date().toISOString()
        })
    if (error) console.log(error.message)
}

async function main () {
    const client = await setupDriftClient()
    const marketIndex = getMarketIndex(MARKET_SYMBOL)
    const supabase = initSupabase(SUPABASE_URL, SUPABASE_KEY)
    function onTick () {
        const price = getCurrentAveragePrice(client, marketIndex)
        writePrice(supabase, price)
    }
    const job = CronJob.from({ cronTime: "* * * * * *", onTick })
    job.start()
}

main()