import { Button } from "@/components/ui/button";

export function MatchResultDialogTopNav() {
  return (
    <div className='flex flex-col justify-center gap-y-4'>
      <p className="border-2 rounded-full px-4 py-2 self-center text-center text-xs">
        Game result
      </p>
      <div className='flex flex-row justify-center gap-x-2'>
        <Button variant="action">
          Results
        </Button>
        <Button variant="ghost">
          Details
        </Button>
      </div>
    </div>
  )
}