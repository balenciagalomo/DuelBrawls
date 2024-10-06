'use client';

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

type BottomNavProps = {
  matchId: string
}
export function BottomNav(props: BottomNavProps) {
  const router = useRouter()
  const lastPathComponent = usePathname().split('/').at(-1)

  const onOverviewSelected = () => router.push(`/match/${props.matchId}/overview`)
  const onTradesSelected = () => router.push(`/match/${props.matchId}/trades`)

  const overviewButtonVariant = lastPathComponent === 'overview' ? 'action' : 'ghost'
  const tradeButtonVariant = lastPathComponent === 'trades' ? 'action' : 'ghost'

  return (
    <div className='fixed mx-auto flex self-center rounded-xl border p-4 mb-8 bottom-0 flex-grow-0 justify-between items-center bg-background gap-x-4'>
      <div className='flex flex-row gap-x-2'>
        <Button variant={overviewButtonVariant} size="lg" className="py-6" onClick={onOverviewSelected}>
          Overview
        </Button>
        <Button variant={tradeButtonVariant} size="lg" className="py-6" onClick={onTradesSelected}>
          Trade
        </Button>
      </div>
      <div className='flex flex-row gap-x-8'>
        <div className='flex flex-col gap-y-2'>
          <p className='text-gray-600 text-xs'>
            TIME REMAINING
          </p>
          <p className='text-white text-sm'>
            12H 13M 11S
          </p>
        </div>
      </div>
    </div>
  )
}