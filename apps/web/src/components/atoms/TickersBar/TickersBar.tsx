import Image, { StaticImageData } from "next/image";

import BonkTickerImage from '@/app/assets/images/tickers/bonk.png'
import PopcatTickerImage from '@/app/assets/images/tickers/popcat.png'
import SolTickerImage from '@/app/assets/images/tickers/sol.png'
import WifTickerImage from '@/app/assets/images/tickers/wif.png'
import { PriceDirection } from "../PriceDirection";

export function TickersBar() {

  return (
    <div className="flex flex-row gap-x-4">
      <TickerBarItem
        ticker="SOL"
        image={SolTickerImage}
        price="144.75"
        priceDirection="up" />
      <TickerBarItem
        ticker="WIF"
        image={WifTickerImage}
        price="2.3"
        priceDirection="up" />

      <TickerBarItem
        ticker="BONK"
        image={BonkTickerImage}
        price="0.01903"
        priceDirection="down" />
      <TickerBarItem
        ticker="POPCAT"
        image={PopcatTickerImage}
        price="1.003"
        priceDirection="up" />

    </div>
  )

}


type TickerBarItemProps = {
  ticker: string;
  image: StaticImageData;
  price: string;
  priceDirection: 'up' | 'down'
}

function TickerBarItem(props: TickerBarItemProps) {
  const { ticker, price, priceDirection, image } = props;
  const textColor = `text-[${PRICE_DIRECTION_COLOR[priceDirection]}]`
  return (
    <div className="border border-[#28323C] rounded-md px-4 py-3 flex flex-row gap-x-3 items-center">
      <Image
        className="object-contain h-[30px] w-[30px]"
        src={image}
        alt={`ticket-${ticker}`} />
      <div className="flex flex-col">
        <p className="text-xs">{ticker}</p>
        <div className="flex flex-row items-center gap-x-1">
          <PriceDirection size={10} priceDirection={priceDirection} />
          <p className={`text-sm ${textColor}`}>{price}</p>
        </div>
      </div>
    </div>
  )
}

const PRICE_DIRECTION_COLOR: Record<TickerBarItemProps['priceDirection'], string> = {
  up: '#39F37B',
  down: '#FF4E7A'
}