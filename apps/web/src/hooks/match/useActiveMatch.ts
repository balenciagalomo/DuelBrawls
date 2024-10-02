import { trpc } from "@/app/trpc";
import { useQuery } from "@tanstack/react-query";

const QUERY_KEY = 'match-active';

export function useActiveMatch() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => trpc.match.activeMatch.query(),
    enabled: Boolean(localStorage.getItem('jwt'))
  })
}

useActiveMatch.queryKey = QUERY_KEY