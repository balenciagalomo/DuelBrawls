import { trpc } from "@/app/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useActiveMatch } from "./useActiveMatch";

export function useAcceptMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await trpc.match.join.mutate({
        matchId: id
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [useActiveMatch.queryKey]
      })
    }
  })
}