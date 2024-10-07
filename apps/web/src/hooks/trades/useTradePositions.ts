'use client';

import { StaticImageData } from "next/image";
import { useQuery } from "@tanstack/react-query";

import { TradeDirection } from "@/types/TradeDirection"
import SolTickerImage from '@/app/assets/images/tickers/sol.png'
import BonkTickerImage from '@/app/assets/images/tickers/bonk.png'
import WifTickerImage from '@/app/assets/images/tickers/wif.png'
import { trpc } from "@/app/trpc";
import { useMatchContext } from "@/contexts/MatchProvider";
import { useMe } from "../auth/useMe";

export type TradePosition = {
  type: TradeDirection;
  coin: {
    image: StaticImageData;
    ticker: string;
  };
  entry: string;
  betAmount: string
  bustPrice: string
  multiplier: string
  fundingRate?: string
  pnl: string
}

const QUERY_KEY = 'trade-positions';

export function useTradePositions() {
  const { matchId } = useMatchContext()
  const meQuery = useMe()
  return useQuery<TradePosition[]>({
    queryKey: [QUERY_KEY, matchId, meQuery.data?.id],
    // queryFn: () => [
    //   MOCK_SOL_TRADE_POSITION,
    //   MOCK_WIF_TRADE_POSITION,
    //   MOCK_BONK_TRADE_POSITION,
    //   MOCK_SOL_TRADE_POSITION,
    //   MOCK_BONK_TRADE_POSITION,
    // ],
    queryFn: async () => {
      if (!meQuery.data?.id) throw new Error('User is not logged in')
      const currentPosition = await trpc.match.position.query({ matchId })
      if (!currentPosition) return []
      const valueChange = currentPosition.currentValue - currentPosition.entry
      const pnlPercentage = Math.floor((valueChange / currentPosition.entry * 100) * 100) / 100
      return [
        {
          type: currentPosition.direction === "long" ? "up" : "down",
          coin: {
            image: BonkTickerImage,
            ticker: '1MBONK'
          },
          entry: (currentPosition.entry / currentPosition.amount * Math.pow(10, 3)).toString(),
          betAmount: (currentPosition.amount / Math.pow(10, 9)).toString(),
          bustPrice: '0.171',
          multiplier: '2x',
          pnl: `${valueChange / Math.pow(10, 6)} / ${pnlPercentage}%`
        }
      ]
    },
    initialData: []
  })
}

useTradePositions.queryKey = QUERY_KEY

const MOCK_SOL_TRADE_POSITION: TradePosition = {
  type: 'up',
  coin: {
    image: SolTickerImage,
    ticker: 'SOL'
  },
  entry: '142.3232',
  betAmount: '100',
  bustPrice: '140.3212',
  multiplier: '7x',
  pnl: '$145 / 30%'
}

const MOCK_BONK_TRADE_POSITION: TradePosition = {
  type: 'up',
  coin: {
    image: BonkTickerImage,
    ticker: 'BONK'
  },
  entry: '0.181',
  betAmount: '135',
  bustPrice: '0.171',
  multiplier: '2x',
  pnl: '$59 / 22%'
}

const MOCK_WIF_TRADE_POSITION: TradePosition = {
  type: 'up',
  coin: {
    image: WifTickerImage,
    ticker: 'WIF'
  },
  entry: '2.1',
  betAmount: '120',
  bustPrice: '1.98',
  multiplier: '7x',
  pnl: '$200 / 12%'
}