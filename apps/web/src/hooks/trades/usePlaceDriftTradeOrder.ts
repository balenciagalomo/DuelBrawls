import { trpc } from "@/app/trpc";
import { useMatchContext } from "@/contexts/MatchProvider";
import { TradeDirection } from "@/types/TradeDirection";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMe } from "../auth/useMe";
import { useTradePositions } from "./useTradePositions";

export function usePlaceDriftTradeOrder() {
  const queryClient = useQueryClient();
  const { matchId } = useMatchContext()
  const meQuery = useMe()
  return useMutation({
    mutationFn: async ([amount, direction]: [amount: number, direction: TradeDirection]) => {
      if (!meQuery.data?.id) throw new Error('User is not logged in')
      await trpc.match.trade.mutate({
        amount,
        matchId,
        direction: direction === "up" ? "long" : "short"
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [useTradePositions.queryKey]
      })
    }
  })
}