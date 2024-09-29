'use client';

import { MatchSearchResult, useMatchSearch } from '@/hooks/match/useMatchSearch';
import {createContext, PropsWithChildren, useContext} from 'react'

type MatchMakingContextProps = {
  matchSearch: ReturnType<typeof useMatchSearch>
  onJoin: () => Promise<MatchSearchResult>
  onCancel: () => void;
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

  const onJoin = () => matchSearch.mutateAsync()
  const onCancel = () => matchSearch.reset()

  return (
    <MatchMakingContext.Provider value={{
      matchSearch,
      onJoin,
      onCancel
    }}>
      {children}
    </MatchMakingContext.Provider>
  )
}
