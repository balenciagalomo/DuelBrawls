import { BN, BulkAccountLoader, DriftClient, PerpMarkets, User, Wallet, calculateBidAskPrice, initialize } from "@drift-labs/sdk";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { SupabaseClient, createClient, createClient as initSupabase } from "@supabase/supabase-js";
import { CronJob } from "cron";
import { config } from "dotenv";
import { Database } from "./database.types";
import bs58 from "bs58";
config()

type Supabase = ReturnType<typeof createClient<Database>>
type ParticipantsMap = Map<string, readonly [DriftClient, User]>

const driftEnv = 'mainnet-beta'
const RPC_URL = process.env.RPC_URL || ''
const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_KEY || ''

const supabase: Supabase = initSupabase(SUPABASE_URL, SUPABASE_KEY)

let participantsMap: ParticipantsMap = new Map()

async function setupDriftClient (privateKey: string) {
    const signer = Keypair.fromSecretKey(bs58.decode(privateKey))

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

    const userAccountPublicKey = await driftClient.getUserAccountPublicKey()
    const userClient = new User({
        driftClient,
        userAccountPublicKey,
        accountSubscription: {
            type: 'polling',
            accountLoader: bulkAccountLoader
        }
    })
    await userClient.subscribe()

    return [driftClient, userClient] as const
}

async function getActiveParticipants () {
    const results = await supabase
        .from('match_participants')
        .select()
        .eq('invite_state', "accepted")
    if (results.error) throw results.error;
    return results.data
}

async function syncActiveParticipants () {
    const participants = await getActiveParticipants()

    for (let [id, clients] of participantsMap) {
        if (participants.some(p => p.id === id)) return

        await clients[1].unsubscribe()
        await clients[0].unsubscribe()
        participantsMap.delete("id")
    }

    for (let participant of participants) {
        if (participantsMap.has(participant.id)) return

        const clients = await setupDriftClient(participant.game_wallet_private_key)
        participantsMap.set(participant.id, clients)
    }
}

async function writeBalance (participantId: string, balance: BN) {
    const { error } = await supabase
        .from('match_balance_feed')
        .insert({
            participant_id: participantId,
            balance: balance.toNumber(),
            timestamp: new Date().toISOString()
        })
    if (error) console.log(error.message)
}

async function syncBalances () {
    for (let [id, clients] of participantsMap) {
        await writeBalance(id, clients[1].getTotalCollateral())
    }
}

async function main () {
    const syncJob = CronJob.from({ cronTime: "*/1 * * * * *", onTick: syncActiveParticipants })
    const writeJob = CronJob.from({ cronTime: "*/1 * * * * *", onTick: syncBalances })
    syncJob.start()
    writeJob.start()
}

main()