import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

export const SOLANA_RPC_URL: string = process.env.NEXT_PUBLIC_SOLANA_RPC_URL ? process.env.NEXT_PUBLIC_SOLANA_RPC_URL : clusterApiUrl(WalletAdapterNetwork.Devnet)