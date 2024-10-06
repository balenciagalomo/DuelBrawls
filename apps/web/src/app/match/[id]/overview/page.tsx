import Image, { StaticImageData } from "next/image";
import { PnLDemoChart } from "@/components/atoms/Charts/PnLDemoChart";
import { TradeBox } from "@/components/atoms/TradeBox/TradeBox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TradePositions } from "@/components/atoms/TradePositions/TradePositions";

import ExampleAvatar from '@/app/assets/images/example-avatar.png'
import ExampleAvatar2 from '@/app/assets/images/example-avatar-2.png'
import { BottomNav } from "@/components/atoms/BottomNav/BottomNav";

export default function PnLDemoPage() {
  return (
    <div className="flex w-full flex-row flex-1 justify-between items-start gap-x-4">
      <div className="flex flex-col w-[70%] h-full overflow-hidden pb-24">
        <div className="flex flex-col w-full min-h-[60vh] mb-12">
          <PnLDemoChart />
        </div>
        <p className="text-white text-sm mb-6">
          INVENTORY
        </p>
        <Collapsible className="bg-background border rounded-md p-2">
          <CollapsibleTrigger className="w-full flex flex-row flex-start justify-start py-2">
            <OpponentInventory
              avatar={ExampleAvatar}
              label="Dumpling"
            />
            <OpponentInventory
              avatar={ExampleAvatar2}
              label="Burgerbob"
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <TradePositions />
          </CollapsibleContent>
        </Collapsible>
      </div>
      <div className="flex flex-col flex-auto w-[30%]">
        <TradeBox />
      </div>
    </div>
  );
}

type OpponentInventoryProps = {
  avatar: StaticImageData;
  label: string;
}

function OpponentInventory(props: OpponentInventoryProps) {
  return (
    <div className="flex flex-row items-center gap-y-4 gap-x-4 p-4 bg-[#0B1013] rounded-md">
      <Image src={props.avatar} alt='avatar' className='w-10 h-10' />
      <p className='text-white text-xs'>
        {props.label}
      </p>
    </div>
  )
} 