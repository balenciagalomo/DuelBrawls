import { trpc } from "@/app/trpc";
import { useQuery } from "@tanstack/react-query";
import { useLocalAuthToken } from "../auth/useLocalAuthToken";

const QUERY_KEY = 'match-active';

export function useActiveMatch() {
  const authToken = useLocalAuthToken()
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => trpc.match.activeMatch.query(),
    enabled: Boolean(authToken.data)
  })
}

useActiveMatch.queryKey = QUERY_KEY