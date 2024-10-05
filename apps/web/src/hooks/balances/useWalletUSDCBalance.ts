
import { useMemo } from "react";
import { PublicKey } from "@solana/web3.js";
import { useTokenBalance } from "./useTokenBalance";
import { USDC_PUBKEY } from "@/constants/currencies";
import { useMatchDefaultConfig } from "../match/useMatchDefaultConfig";
import { useMe } from "../auth/useMe";

export function useWalletUSDCBalance() {
  const meQuery = useMe()
  const matchConfigQuery = useMatchDefaultConfig();
  const mint = useMemo(() => {
    if (matchConfigQuery.data?.token.token_pubkey) {
      return new PublicKey(matchConfigQuery.data.token.token_pubkey)
    }
    return USDC_PUBKEY.Devnet
  }, [matchConfigQuery.data])
  const owner = useMemo(() => {
    if (meQuery.data?.pubkey) {
      return new PublicKey(meQuery.data.wallet_address)
    }
    return null
  }, [meQuery.data])
  return useTokenBalance({
    mint,
    owner
  })
}