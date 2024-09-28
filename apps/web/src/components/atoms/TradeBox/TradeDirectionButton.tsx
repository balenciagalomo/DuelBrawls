'use client';

import { useMemo } from "react";
import { PriceDirection } from "@/components/atoms/PriceDirection";
import { Button, ButtonProps } from "@/components/ui/button";
import { TradeDirection } from '@/types/TradeDirection'

type TradeDirectionButtonProps = ButtonProps & {
  direction: TradeDirection
  selected?: boolean;
}

export function TradeDirectionButton(props: TradeDirectionButtonProps) {
  const { direction, selected, ...rest } = props
  const label = direction === 'up' ? 'Long' : 'Short'

  const labelColorClass = useMemo(() => {
    if (!selected) return "text-white"
    return `text-[${TEXT_DIRECTION_COLOR[direction]}]`
  }, [direction, selected]);

  const bgColorClass = useMemo(() => {
    if (!selected) return "bg-[#151A22]"
    return `bg-[${BG_DIRECTION_COLOR[direction]}]`
  }, [direction, selected])

  const bgOpacityClass = useMemo(() => {
    if (selected) return "bg-opacity-20 hover:bg-opacity-60"
    return "bg-opacity-100"
  }, [selected])

  const iconColor = useMemo(() => {
    if (!selected) return "white"
    return TEXT_DIRECTION_COLOR[direction]
  }, [direction, selected])

  return (
    <Button className={`flex-1 gap-x-2 ${bgColorClass} hover:${bgColorClass} ${bgOpacityClass} ${labelColorClass}`} {...rest}>
      <PriceDirection
        size={10}
        priceDirection={direction}
        color={iconColor} />
      {label}
    </Button>
  )
}

export const TEXT_DIRECTION_COLOR: Record<TradeDirection, string> = {
  'up': '#77FF7A',
  'down': '#FF4E7A',
}

export const BG_DIRECTION_COLOR: Record<TradeDirection, string> = {
  'up': '#77FF87',
  'down': '#FF4E7A',
}