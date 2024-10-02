'use client';

import React from 'react';

import ExampleAvatar from '@/app/assets/images/example-avatar.png'
import { useMatchMakingContext } from '@/components/atoms/JoinGame/MatchMakingProvider';
import { MatchOpponent } from '@/components/atoms/JoinGame/MatchOpponent';
import { MVPMatchInformation } from '@/components/atoms/JoinGame/MatchInformation';

export function MatchSearching() {
  const { onCancel } = useMatchMakingContext()
  return (
    <div className="w-100% max-w-md flex flex-col flex-1 gap-y-4">
      <div className="rounded-md border-2 border-[#28323C] p-6 flex flex-1 flex-col gap-y-4">
        <p className="text-center text-sm">
          Finding opponent...
        </p>
        <div className="flex flex-row items-center justify-center gap-x-4 py-4">
          <MatchOpponent image={ExampleAvatar} />
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <MatchOpponent />
        </div>
        <MVPMatchInformation />
      </div>
      <button
        className="text-xs flex self-center text-gray-500"
        onClick={onCancel}>
        Cancel
      </button>
    </div>
  )
}