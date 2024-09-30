'use client';

import { createChart, ColorType, CandlestickData } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import { candlestickData } from '@/data/candlestickData';

export const ProfitAndLossChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
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

      chart.priceScale('right').applyOptions({
        borderColor: '#71649C',
      });

      chart.timeScale().applyOptions({
        borderColor: '#71649C',
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 10,
      });

      chart.applyOptions({
        layout: {
          fontFamily: "'Roboto', sans-serif",
        },
        crosshair: {
          mode: 1,
          vertLine: {
            width: 4,
            color: '#C3BCDB44',
            style: 0,
            labelBackgroundColor: '#9B7DFF',
          },
          horzLine: {
            color: '#9B7DFF',
            labelBackgroundColor: '#9B7DFF',
          },
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

      const areaSeries = chart.addAreaSeries({
        lastValueVisible: false,
        crosshairMarkerVisible: false,
        lineColor: 'transparent',
        topColor: 'rgba(56, 33, 110,0.6)',
        bottomColor: 'rgba(56, 33, 110, 0.1)',
      });

      const areaData = candlestickData.map(d => ({ time: d.time, value: (d.close + d.open) / 2 }));
      areaSeries.setData(areaData);

      candlestickSeries.priceScale().applyOptions({
        autoScale: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      });

      chart.timeScale().fitContent();

      const handleResize = () => {
        chart.applyOptions({ 
          width: chartContainerRef.current?.clientWidth,
          height: chartContainerRef.current?.clientHeight 
        });
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, []);

  return <div ref={chartContainerRef} className="w-full h-full" />;
};
