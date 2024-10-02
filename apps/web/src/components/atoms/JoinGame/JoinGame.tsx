'use client';

import { MatchSearching } from "./MatchSearching";
import { useMatchMakingContext } from "./MatchMakingProvider";
import { MatchFound } from "./MatchFound";
import { JoinGameIdle } from "./JoinGameIdle";

export function JoinGame() {
  const { matchSearch, activeMatchQuery } = useMatchMakingContext();

  // if (findMatch.isPending) {
  //   return (
  //     <div className="rounded-full border-2 border-[#28323C] p-4 flex flex-col gap-y-4">
  //       <div className="flex flex-1 bg-[#6031C3] items-center justify-center p-4 rounded-full" onClick={onJoin}>
  //         <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
  //           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
  //           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  //         </svg>
  //       </div>
  //     </div>
  //   )
  // }

  if (activeMatchQuery.data) {
    return <MatchFound />
  }

  if (matchSearch.isPending) {
    return <MatchSearching />
  }

  return (
    <JoinGameIdle />
  )
}