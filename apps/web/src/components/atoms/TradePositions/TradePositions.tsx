'use client';
import Image from "next/image"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { TradePosition, useTradePositions } from "@/hooks/trades/useTradePositions"
import { PriceDirection } from "../PriceDirection"

export function TradePositions() {
  const tradePositionsQuery = useTradePositions();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Coin</TableHead>
          <TableHead>Entry</TableHead>
          <TableHead>Bet amount</TableHead>
          <TableHead>Bust price</TableHead>
          <TableHead>Multiplier</TableHead>
          <TableHead>Funding / H</TableHead>
          <TableHead>PnL</TableHead>
          <TableHead className="text-right w-[10%]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {tradePositionsQuery.data.map((item, index) => (
          <TradePositionRow key={index.toString()} position={item} />
        ))}
      </TableBody>
    </Table>

  )
}

// Type, Coin, Entry, Bet amount, Bust price, Multiplier, Funding / H, PNL

type TradePositionRowProps = {
  position: TradePosition;
}

function TradePositionRow(props: TradePositionRowProps) {
  const { position } = props;

  const tradeDirectionColorClass = position.type === 'up' ? 'text-trade-up' : 'text-trade-down'
  const tradeDirectionLabel = position.type === 'up' ? 'Long' : 'Short'
  return (
    <TableRow className="bg-[#10141C]">
      <TableCell>
        <div className="flex flex-row items-center gap-x-1">
          <PriceDirection size={10} priceDirection={position.type} />
          <p className={`text-sm ${tradeDirectionColorClass}`}>
            {tradeDirectionLabel}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-row items-center gap-x-1">
          <Image
            className="object-contain h-5 w-5"
            src={position.coin.image}
            alt={`ticket-${position.coin.ticker}`} />
          <p className="text-sm text-white">{position.coin.ticker}</p>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-sm text-white">{position.entry}</p>
      </TableCell>
      <TableCell>
        <p className="text-sm text-white">${position.betAmount}</p>
      </TableCell>
      <TableCell>
        <p className="text-sm text-white">{position.bustPrice}</p>
      </TableCell>
      <TableCell>
        <p className="text-sm text-white">{position.multiplier}</p>
      </TableCell>
      <TableCell>
        <p className="text-sm text-white">{position.fundingRate ?? '--'}</p>
      </TableCell>
      <TableCell>
        <p className={`text-sm ${tradeDirectionColorClass}`}>{position.pnl}</p>
      </TableCell>
      <TableCell>
        <Button variant="secondary">
          Close
        </Button>
      </TableCell>
    </TableRow>
  )
}