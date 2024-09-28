import { useWallet } from "@solana/wallet-adapter-react";
import { useTokenBalance } from "./useTokenBalance";
import { USDC_PUBKEY } from "@/constants/currencies";

export function useWalletUSDCBalance() {
  const { publicKey } = useWallet()
  return useTokenBalance({
    mint: USDC_PUBKEY.Devnet,
    owner: publicKey
  })
}