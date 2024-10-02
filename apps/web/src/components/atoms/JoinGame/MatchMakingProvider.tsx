'use client';

import {createContext, PropsWithChildren, useContext} from 'react'
import { MatchCreatedResult, useMatchSearch } from '@/hooks/match/useMatchSearch';
import { useMatchSearchCancel } from '@/hooks/match/useMatchSearchCancel';
import { useActiveMatch } from '@/hooks/match/useActiveMatch';
import { assert } from '@/utils/assert';
import { useDeclineMatch } from '@/hooks/match/useDeclineMatch';

type MatchMakingContextProps = {
  matchSearch: ReturnType<typeof useMatchSearch>
  activeMatchQuery: ReturnType<typeof useActiveMatch>
  onJoin: () => Promise<MatchCreatedResult>
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
  const {children} = props;
  const matchSearch = useMatchSearch()
  const matchSearchCancel = useMatchSearchCancel()
  const activeMatchQuery = useActiveMatch()
  const declineMatch = useDeclineMatch()

  const onJoin = () => matchSearch.mutateAsync()
  const onCancel = async () => {
    await matchSearchCancel.mutateAsync()
    matchSearch.reset()
  }

  const onDecline = async () => {
    assert(activeMatchQuery.data, new Error('No active match'))
    await declineMatch.mutateAsync(activeMatchQuery.data.invite.id)
  }

  return (
    <MatchMakingContext.Provider value={{
      matchSearch,
      activeMatchQuery,
      onJoin,
      onCancel,
      onDecline
    }}>
      {children}
    </MatchMakingContext.Provider>
  )
}
