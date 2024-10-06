'use client';

import React from 'react';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

export const BonkDemoChart: React.FC = () => {
  return (
    <AdvancedRealTimeChart
      theme="dark"
      width={'100%'}
      height={'100%'}
      allow_symbol_change={false}
      symbol='BONKUSD'
      hide_side_toolbar={true}
      save_image={false}
      interval='5'
    />
  )
};
