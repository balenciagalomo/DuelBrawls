'use client';

import React, { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { useMatchMakingContext } from '@/components/atoms/JoinGame/MatchMakingProvider';
import { useMe } from '@/hooks/auth/useMe';

export function MatchFoundCTAs() {
  const { activeMatchQuery, declineMatch, acceptMatch, onDecline, onAccept } = useMatchMakingContext()
  const meQuery = useMe()

  const participantMe = activeMatchQuery.data?.participants.find(item => item.user_id === meQuery.data?.id)

  const requiredDepositAmount = useMemo(() => {
    const wage = activeMatchQuery.data?.match.individual_wage_amount ?? 0
    const trade = activeMatchQuery.data?.match.individual_trade_amount ?? 0
    return wage + trade
  }, [activeMatchQuery.data])

  if (participantMe?.invite_state === 'accepted') {
    return (
      <Button
        variant='ghost'
        disabled
      >
        Game starts when wagers have been deposited
      </Button>
    )
  }

  return (
    <div className='flex flex-col flex-1'>
      <Button
        variant='up'
        isLoading={acceptMatch.isPending}
        disabled={acceptMatch.isPending}
        onClick={onAccept}>
        Deposit ${requiredDepositAmount}
      </Button>
      <Button
        variant='ghost'
        isLoading={declineMatch.isPending}
        onClick={onDecline}>
        Decline
      </Button>
    </div>
  )

}