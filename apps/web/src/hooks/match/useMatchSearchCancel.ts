import { trpc } from "@/app/trpc";
import { useMutation } from "@tanstack/react-query";

export function useMatchSearchCancel() {
  return useMutation({
    mutationFn: () => {
      return trpc.match.cancel.mutate()
    }
  })
}