'use client';

import { StaticImageData } from "next/image";
import { useQuery } from "@tanstack/react-query";

import { TradeDirection } from "@/types/TradeDirection"
import SolTickerImage from '@/app/assets/images/tickers/sol.png'

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
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => {
      return new Array(10).fill(0).map(() => MOCK_TRADE_POSITION)
    }
  })
}

const MOCK_TRADE_POSITION: TradePosition = {
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