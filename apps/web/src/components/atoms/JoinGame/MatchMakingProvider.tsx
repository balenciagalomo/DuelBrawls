'use client';

import { createContext, PropsWithChildren, useContext } from 'react'
import { useMatchSearch } from '@/hooks/match/useMatchSearch';
import { useMatchSearchCancel } from '@/hooks/match/useMatchSearchCancel';
import { useActiveMatch } from '@/hooks/match/useActiveMatch';
import { assert } from '@/utils/assert';
import { useDeclineMatch } from '@/hooks/match/useDeclineMatch';
import { useMe } from '@/hooks/auth/useMe';
import { useDebounce } from '@uidotdev/usehooks';

type MatchMakingContextProps = {
  matchSearch: ReturnType<typeof useMatchSearch>
  activeMatchQuery: ReturnType<typeof useActiveMatch>
  declineMatch:  ReturnType<typeof useMatchSearchCancel>
  debouncedIsSearching: boolean;
  onJoin: () => Promise<void>
  onCancel: () => Promise<void>;
  onDecline: () => Promise<void>
}

const MatchMakingContext = createContext<MatchMakingContextProps | null>(null)

export function useMatchMakingContext() {
  const context = useContext(MatchMakingContext);
  if (!context) throw new Error('Unable to locate match making context');
  return context;
}

type MatchMakingProviderProps = {

}

export function MatchMakingProvider(props: PropsWithChildren<MatchMakingProviderProps>) {
  const { children } = props;
  const meQuery = useMe()
  const matchSearch = useMatchSearch()
  const matchSearchCancel = useMatchSearchCancel()
  const activeMatchQuery = useActiveMatch()
  const declineMatch = useDeclineMatch()

  const debouncedIsSearching = useDebounce(matchSearch.isPending, 300);

  const onJoin = () => matchSearch.mutateAsync()
  const onCancel = async () => {
    await matchSearchCancel.mutateAsync()
    matchSearch.reset()
  }

  const onDecline = async () => {
    const participant = activeMatchQuery.data?.participants.find(item => item.user_id === meQuery.data?.id)
    assert(participant?.id, new Error('No active match'))
    await declineMatch.mutateAsync(participant.id)
  }

  return (
    <MatchMakingContext.Provider value={{
      matchSearch,
      activeMatchQuery,
      declineMatch: matchSearchCancel,
      debouncedIsSearching,
      onJoin,
      onCancel,
      onDecline
    }}>
      {children}
    </MatchMakingContext.Provider>
  )
}
