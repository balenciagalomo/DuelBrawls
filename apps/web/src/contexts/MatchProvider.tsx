'use client';

import { useContext, createContext, PropsWithChildren } from "react"

type MatchContextProps = {
  matchId: string
}

const MatchContext = createContext<MatchContextProps | null>(null)

export function useMatchContext() {
  const context = useContext(MatchContext);
  if (!context) throw new Error('Match provider not found');
  return context;
}

type MatchProviderProps = {
  matchId: string
}

export function MatchProvider(props: PropsWithChildren<MatchProviderProps>) {

  const { matchId, children } = props
  return (
    <MatchContext.Provider value={{
      matchId
    }}>
      {children}
    </MatchContext.Provider>
  )
}