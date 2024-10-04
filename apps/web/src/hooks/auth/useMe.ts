import { trpc } from "@/app/trpc";
import { useQuery } from "@tanstack/react-query";
import { useWalletAuth } from "./useWalletAuth";
import { useLocalAuthToken } from "./useLocalAuthToken";

const QUERY_KEY = 'me';

export function useMe() {
  const authToken = useLocalAuthToken()
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => trpc.profile.me.query(),
    enabled: Boolean(authToken)
  })
}

useMe.queryKey = QUERY_KEY;