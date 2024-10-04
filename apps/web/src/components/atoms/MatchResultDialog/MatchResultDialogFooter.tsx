import { Button } from "@/components/ui/button";

export function MatchResultDialogFooter() {
  return (
    <div className='w-full flex flex-1 rounded-xl border p-4 bottom-0 flex-grow-0 justify-between items-center'>
      <div className='flex flex-row gap-x-8'>
        <div className='flex flex-col gap-y-1'>
          <p className='text-gray-600 text-xs'>
            Total won
          </p>
          <p className='text-trade-up text-base'>
            +$400
          </p>
        </div>
        <div className='flex flex-col gap-y-1'>
          <p className='text-gray-600 text-xs'>
            Trading PnL
          </p>
          <p className='text-trade-up text-base'>
            +$323
          </p>
        </div>
      </div>
      <div className='flex flex-row gap-x-4'>
        <Button size='sm' variant='outline'>
          Close
        </Button>
        <Button size='sm' variant="action">
          Play again
        </Button>
      </div>
    </div>
  )
}