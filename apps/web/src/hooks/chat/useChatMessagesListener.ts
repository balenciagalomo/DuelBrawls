'use client';

import { useQueryClient } from "@tanstack/react-query";
import { useMatchContext } from "@/contexts/MatchProvider";
import { supabase } from "@/utils/supabase";
import { useChatMessages } from "./useChatMessages";

export function useChatMessagesListener() {
  const { matchId } = useMatchContext()
  const queryClient = useQueryClient()
  const listen = () => {
    console.log('listen on change')
    const channels = supabase.channel('match_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'match_messages',
          filter: `match_id=eq.${matchId}`
        },
        () => {
          console.log('listen changed')
          queryClient.invalidateQueries({
            queryKey: [useChatMessages.queryKey, matchId]
          })
        }
      )
      .subscribe()

    return channels
  }

  return listen;
}