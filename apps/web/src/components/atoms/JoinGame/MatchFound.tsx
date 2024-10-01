'use client';

import React, { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import ExampleAvatar from '@/app/assets/images/example-avatar.png'
import { Button } from '@/components/ui/button';
import { InfoItem, InfoItemSeperator } from '@/components/atoms/JoinGame/InfoItem';
import { useMatchMakingContext } from '@/components/atoms/JoinGame/MatchMakingProvider';
import { MatchOpponent } from '@/components/atoms/JoinGame/MatchOpponent';

export function MatchFound() {
  const { onCancel, matchSearch } = useMatchMakingContext()
  const { publicKey } = useWallet()

  const opponent = useMemo(() => {
    return matchSearch.data?.invites.find(item => item.pubkey !== publicKey?.toBase58())
  }, [publicKey, matchSearch.data])

  return (
    <div className="w-100% max-w-md flex flex-col flex-1 gap-y-4">
      <div className="rounded-md border border-trade-up p-6 flex flex-1 flex-col gap-y-4">
        <p className="text-center text-sm">
          Match found!
        </p>
        <div className="flex flex-row items-center justify-center gap-x-4 py-4">
          <MatchOpponent
            image={ExampleAvatar}
            label={publicKey?.toBase58().slice(0, 6)} />
          <p>vs</p>
          <MatchOpponent
            label={opponent?.pubkey.slice(0, 6)} />
        </div>
        <div className="flex flex-1 flex-row justify-between items-center">
          <InfoItem heading="Bet amount" description="$100" />
          <InfoItemSeperator />
          <InfoItem heading="Game mode" description="First to 2x" />
          <InfoItemSeperator />
          <InfoItem heading="Time limit" description="24 hours" />
        </div>
      </div>
      <button
        className="text-xs flex flex-1 text-center text-gray-500 border-trade-up bg-trade-up"
        onClick={onCancel}>

      </button>
      <Button
        variant='up'
        onClick={onCancel}>
        Deposit
      </Button>
      <Button
        variant='ghost'
        onClick={onCancel}>
        Decline
      </Button>
    </div>
  )
}