'use client';

import Image from 'next/image'
import { useState } from "react";

import BonkTickerImage from '@/app/assets/images/tickers/bonk.png'
import { TradeDirectionButton, } from "@/components/atoms/TradeBox/TradeDirectionButton";
import { getBorderColorClass, getTradeBackgroundColorClass, getTradeTextClass } from "@/components/atoms/TradeBox/styles";
import { TradeDirection } from '@/types/TradeDirection'
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { usePlaceDriftTradeOrder } from '@/hooks/trades/usePlaceDriftTradeOrder';
import { toast } from "sonner";

export function TradeBox() {
  const [selectedDirection, setSelectedDirection] = useState<TradeDirection>('up');
  const [showFutureOrders, setFutureOrders] = useState(false);
  const [inputAmount, setInputAmount] = useState<null | number>(null)
  const { mutateAsync, isPending } = usePlaceDriftTradeOrder()

  return (
    <div className="w-full flex flex-col bg-card rounded-md px-4 py-4 gap-y-5">

      {/* Direction */}
      <div className="flex flex-row items-stretch bg-[#151A22]">
        <TradeDirectionButton
          direction="up"
          selected={selectedDirection === 'up'}
          onClick={() => setSelectedDirection('up')}>
          Long
        </TradeDirectionButton>
        <TradeDirectionButton
          direction="down"
          selected={selectedDirection === 'down'}
          onClick={() => setSelectedDirection('down')}>
          Short
        </TradeDirectionButton>
      </div>

      {/* Position size input */}
      <div className="flex flex-row justify-start items-center gap-x-4 bg-[#151A22] p-4 rounded-md">
        <div className='flex flex-row gap-x-2'>
          <Image src={BonkTickerImage} width={24} height={24} alt='1MBONK' />
          <p className='text-base'>$1MBONK</p>
          <input
            className='text-base bg-transparent outline-none'
            defaultValue={10000} 
            placeholder='Value'
            value={inputAmount ? inputAmount.toString() : ''}
            onChange={e => setInputAmount(e.target.value ? Number(e.target.value) : null)}
            />
        </div>
      </div>

      {/* Leverage input */}
      <div className='flex flex-row gap-x-4'>
        <div className="flex flex-row justify-start items-center bg-[#151A22] p-4 rounded-md">
          <p className='text-base'>x3</p>
        </div>
        <div className="flex flex-1 flex-row justify-between items-center gap-x-4 bg-[#151A22] p-4 rounded-md">
          <Slider defaultValue={[33]} max={100} step={1} />
          <div className='flex flex-col flex-shrink-0 gap-y-1'>
            <p className='text-xs text-gray-500'>Bust price</p>
            <p className='text-xs'>142.3232</p>
          </div>
        </div>
      </div>

      {/* TP / SL */}
      <div className="flex flex-row items-center gap-x-4">
        <Switch
          checked={showFutureOrders}
          onCheckedChange={() => setFutureOrders(value => !value)} />
        <p className="text-xs text-gray-500">
          ADD TP AND SL?
        </p>
      </div>

      {showFutureOrders &&
        <div className='flex flex-col gap-y-4'>
          <FutureTradeOrder
            direction='up'
            heading="TAKE PROFIT @ PRICE"
            description="Profit"
            estimated='$1,670  +155%'
            price={164}
          />
          <FutureTradeOrder
            direction='down'
            heading='CLOSE POSITION @ PRICE'
            description="Loss"
            estimated='$1,970  -67%'
            price={148}
          />
        </div>}

      <Button variant={selectedDirection} isLoading={isPending} disabled={!inputAmount} onClick={() => {
        mutateAsync([inputAmount!, selectedDirection])
        .then(tx => toast(`Tx: https://solscan.io/tx/${tx}`))
      }}>
        Place trade
      </Button>
    </div>
  )
}

type PlaceTradeProps = {
  direction: TradeDirection;
}

function PlaceTrade(props: PlaceTradeProps) {
  const { direction } = props;

  const borderClass = `border-2 ${getBorderColorClass(direction)}`
  const bgColorClass = getTradeBackgroundColorClass(direction)

  return (
    <Button className={`text-white bg-opacity-20 hover:bg-opacity-40 ${bgColorClass} hover:${bgColorClass} ${borderClass}`}>
      Place trade
    </Button>
  )
}

type FutureTradeOrderProps = {
  heading: string
  price: number;
  description: string;
  estimated: string;
  direction: TradeDirection;
}

function FutureTradeOrder(props: FutureTradeOrderProps) {
  const { heading, price, description, estimated, direction } = props
  return (
    <div className='flex flex-col items-start gap-y-4'>
      <p className="text-sm text-gray-500">
        {heading}
      </p>
      <div className='flex flex-row items-center gap-x-4'>
        <div className="flex flex-row justify-start items-center bg-[#151A22] py-4 px-6 rounded-md">
          <p className='text-sm'>${price}</p>
        </div>
        <div className='flex flex-col items-start gap-y-'>
          <p className='text-xs text-gray-500'>{description}</p>
          <p className={`text-xs ${getTradeTextClass(direction)}`}>{estimated}</p>
        </div>
      </div>
    </div>
  )
}