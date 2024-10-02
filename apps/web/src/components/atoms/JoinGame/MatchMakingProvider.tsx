'use client';

import {createContext, PropsWithChildren, useContext} from 'react'
import { MatchCreatedResult, useMatchSearch } from '@/hooks/match/useMatchSearch';
import { useMatchSearchCancel } from '@/hooks/match/useMatchSearchCancel';
import { useActiveMatch } from '@/hooks/match/useActiveMatch';

type MatchMakingContextProps = {
  matchSearch: ReturnType<typeof useMatchSearch>
  activeMatchQuery: ReturnType<typeof useActiveMatch>
  onJoin: () => Promise<MatchCreatedResult>
  onCancel: () => Promise<void>;
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

  const onJoin = () => matchSearch.mutateAsync()
  const onCancel = async () => {
    await matchSearchCancel.mutateAsync()
    matchSearch.reset()
  }

  return (
    <MatchMakingContext.Provider value={{
      matchSearch,
      activeMatchQuery,
      onJoin,
      onCancel
    }}>
      {children}
    </MatchMakingContext.Provider>
  )
}
