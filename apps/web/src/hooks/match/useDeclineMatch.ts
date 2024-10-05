import { trpc } from "@/app/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useActiveMatch } from "./useActiveMatch";

export function useDeclineMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trpc.match.declineMatch.mutate({
      participantId: id
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [useActiveMatch.queryKey]
      })
    }
  })
}