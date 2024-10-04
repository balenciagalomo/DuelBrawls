import { trpc } from "@/app/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useActiveMatch } from "./useActiveMatch";
import { supabase } from "@/utils/supabase";
import { useMe } from "../auth/useMe";

export type MatchCreatedResult = {
  invites: Array<{
    id: string;
    pubkey: string
  }>;
}

export function useMatchSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const me = await trpc.profile.me.query()
      return await new Promise<void>(async (resolve, reject) => {
        await trpc.match.enterQueue.mutate()

        let timeout: NodeJS.Timeout | undefined = undefined;
        const channels = supabase.channel('match_search')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'match_invites',
              filter: `user_id=eq.${me.id}`
            },
            (payload) => {
              if (timeout) clearTimeout(timeout);
              channels.unsubscribe()
              resolve();
            }
          )
          .subscribe()

        timeout = setTimeout(() => {
          channels.unsubscribe();
          reject(new Error('Unable to find match in 1 mins'))
        }, 1000 * 60);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [useActiveMatch.queryKey]
      })
    }
  })
}