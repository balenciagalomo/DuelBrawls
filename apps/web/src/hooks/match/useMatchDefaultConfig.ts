import { trpc } from "@/app/trpc";
import { useQuery } from "@tanstack/react-query";

const QUERY_KEY = 'match-default-config';

export function useMatchDefaultConfig() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => trpc.match.defaultConfig.query(),
    staleTime: 1000 * 60 * 60 // 1 hour
  })
}