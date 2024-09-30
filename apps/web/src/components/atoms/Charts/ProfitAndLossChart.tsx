'use client';

import { createChart, ColorType, CandlestickData } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import { candlestickData } from '@/data/candlestickData';

export const ProfitAndLossChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          });
        }
      };

      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#222' },
          textColor: '#C3BCDB',
        },
        grid: {
          vertLines: { color: '#444' },
          horzLines: { color: '#444' },
        },
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });

      chartRef.current = chart;

      chart.applyOptions({
        rightPriceScale: {
          borderVisible: true,
          borderColor: '#71649C',
        },
        timeScale: {
          borderVisible: true,
          borderColor: '#71649C',
          timeVisible: true,
          secondsVisible: false,
        },
      });

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: 'rgb(54, 116, 217)',
        downColor: 'rgb(225, 50, 85)',
        borderVisible: false,
        wickUpColor: 'rgb(54, 116, 217)',
        wickDownColor: 'rgb(225, 50, 85)',
      });

      candlestickSeries.setData(candlestickData);

      chart.timeScale().fitContent();

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, []);

  return <div ref={chartContainerRef} className="w-full h-full" />;
};
