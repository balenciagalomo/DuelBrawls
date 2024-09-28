import { PublicKey } from "@solana/web3.js";

export const USDC_PUBKEY = {
  Devnet: new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"),
  Mainnet: new PublicKey("FSxJ85FXVsXSr51SeWf9ciJWTcRnqKFSmBgRDeL3KyWw")
} as const