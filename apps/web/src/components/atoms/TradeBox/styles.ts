import { TradeDirection } from "@/types/TradeDirection"

export const getTradeTextClass = (direction: TradeDirection) => {
  switch (direction) {
    case 'up':
      return 'text-trade-up'
    case 'down':
      return 'text-trade-down'
    default:
      return ""
  }
}

export const getTradeBackgroundColorClass = (direction: TradeDirection) => {
  switch (direction) {
    case 'up':
      return 'bg-trade-up'
    case 'down':
      return 'bg-trade-down'
    default:
      return ""
  }
}

export const getBorderColorClass = (direction: TradeDirection) => {
  switch (direction) {
    case 'up':
      return 'border-trade-up'
    case 'down':
      return 'border-trade-down'
    default:
      return ""
  }
}