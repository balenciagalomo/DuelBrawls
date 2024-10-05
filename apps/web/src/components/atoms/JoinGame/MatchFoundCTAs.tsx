'use client';

import React, { use, useEffect, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { useMatchMakingContext } from '@/components/atoms/JoinGame/MatchMakingProvider';
import { useMe } from '@/hooks/auth/useMe';
import { useMatchReadyListener } from '@/hooks/match/useMatchReadyListener';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export function MatchFoundCTAs() {
  const { activeMatchQuery, declineMatch, acceptMatch, onDecline, onAccept } = useMatchMakingContext()
  const meQuery = useMe()
  const router = useRouter()

  const participantMe = activeMatchQuery.data?.participants.find(item => item.user_id === meQuery.data?.id)
  const matchReadyListener = useMatchReadyListener(Boolean(participantMe));

  const requiredDepositAmount = useMemo(() => {
    const wage = activeMatchQuery.data?.match.individual_wage_amount ?? 0
    const trade = activeMatchQuery.data?.match.individual_trade_amount ?? 0
    return wage + trade
  }, [activeMatchQuery.data])

  useEffect(() => {
    let channel: RealtimeChannel | undefined;
    if (participantMe?.match_id) {
      channel = matchReadyListener(participantMe.match_id)
    }
    return () => {
      channel?.unsubscribe()
    }
  }, [participantMe, matchReadyListener]);

  if (activeMatchQuery.data?.match.status === 'active') {
    return (
      <Button
        variant='action'
        onClick={() => router.push(`/match/${activeMatchQuery.data?.match.id}`)}>
        Enter match
      </Button>
    )
  }

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