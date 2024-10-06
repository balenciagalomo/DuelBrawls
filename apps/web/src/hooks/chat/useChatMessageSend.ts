import { useMutation } from "@tanstack/react-query";
import { useMe } from "../auth/useMe";
import { trpc } from "@/app/trpc";
import { useMatchContext } from "@/contexts/MatchProvider";

export function useChatMessageSend() {
  const { matchId } = useMatchContext()
  const meQuery = useMe()
  return useMutation({
    mutationFn: (message: string) => {
      if (!meQuery.data?.id) throw new Error('User is not logged in')
      return trpc.message.send.mutate({
        matchId,
        message
      })
    }
  })
}