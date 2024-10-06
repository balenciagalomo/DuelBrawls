'use client';

import { supabase } from "@/utils/supabase";

export function useMatchReadyListener(enabled?: boolean) {
  const listen = (matchId: string) => {
    const channels = supabase.channel('match_search')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'match_participants',
          filter: `id=eq.${matchId}`
        },
        (payload) => {
          console.log('payload', payload)
          // if (timeout) clearTimeout(timeout);
          // channels.unsubscribe()
          // resolve();
        }
      )
      .subscribe()

    return channels
  }

  return listen;
}