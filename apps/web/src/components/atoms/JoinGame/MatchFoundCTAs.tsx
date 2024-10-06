'use client';

import React, { use, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { RealtimeChannel } from '@supabase/supabase-js';

import { Button } from '@/components/ui/button';
import { useMatchMakingContext } from '@/components/atoms/JoinGame/MatchMakingProvider';
import { useProfileContext } from '@/contexts/ProfileProvider';
import { useMatchReadyListener } from '@/hooks/match/useMatchReadyListener';
import { useWalletUSDCBalance } from '@/hooks/balances/useWalletUSDCBalance';
import { useMe } from '@/hooks/auth/useMe';

export function MatchFoundCTAs() {
  const { activeMatchQuery, declineMatch, acceptMatch, onDecline, onAccept } = useMatchMakingContext()
  const { deposit, onDeposit } = useProfileContext();
  const meQuery = useMe()
  const router = useRouter()
  const usdcBalanceQuery = useWalletUSDCBalance()

  const participantMe = activeMatchQuery.data?.participants.find(item => item.user_id === meQuery.data?.id)
  const matchReadyListener = useMatchReadyListener(Boolean(participantMe));

  const requiredDepositAmount = useMemo(() => {
    const wage = activeMatchQuery.data?.match.individual_wage_amount ?? 0
    const trade = activeMatchQuery.data?.match.individual_trade_amount ?? 0
    return wage + trade
  }, [activeMatchQuery.data])

  const acceptButton = useMemo(() => {
    const usdcUiAmount = usdcBalanceQuery.data?.value.uiAmount ?? 0
    const difference = usdcUiAmount - requiredDepositAmount
    if (0 > difference) {
      const topUpAmount = Math.abs(difference);
      return (
        <Button
          variant='up'
          isLoading={deposit.isPending}
          disabled={deposit.isPending}
          onClick={() => onDeposit(topUpAmount)}>
          Top up ${topUpAmount}
        </Button>
      )
    }

    return (
      <Button
        variant='up'
        isLoading={acceptMatch.isPending}
        disabled={acceptMatch.isPending}
        onClick={onAccept}>
        Deposit ${requiredDepositAmount}
      </Button>
    )
  }, [
    onAccept,
    onDeposit,
    acceptMatch.isPending,
    deposit.isPending,
    requiredDepositAmount,
    usdcBalanceQuery.data
  ])

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
        onClick={() => router.push(`/match/${activeMatchQuery.data?.match.id}/trades`)}>
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
      {acceptButton}
      <Button
        variant='ghost'
        isLoading={declineMatch.isPending}
        onClick={onDecline}>
        Decline
      </Button>
    </div>
  )

}