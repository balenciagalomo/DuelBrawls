import { trpc } from "@/app/trpc";
import { useQuery } from "@tanstack/react-query";
import { useLocalAuthToken } from "../auth/useLocalAuthToken";
import { useWallet } from "@solana/wallet-adapter-react";

const QUERY_KEY = 'match-active';

export function useActiveMatch() {
  const {publicKey} = useWallet();
  const authToken = useLocalAuthToken()
  return useQuery({
    queryKey: [QUERY_KEY, publicKey?.toBase58()],
    queryFn: () => trpc.match.activeMatch.query(),
    enabled: Boolean(authToken.data),
  })
}

useActiveMatch.queryKey = QUERY_KEY