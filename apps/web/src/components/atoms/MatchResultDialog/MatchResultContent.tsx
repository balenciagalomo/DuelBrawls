'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ExampleAvatar from '@/app/assets/images/example-avatar.png'
import ExampleAvatar2 from '@/app/assets/images/example-avatar-2.png'
import TwitterLogo from '@/app/assets/svgs/twitter.svg'
import { MatchResultOpponent } from './MatchResultOpponent';

export function MatchResultContent() {
  return (
    <div className="max-w-xl flex flex-1 flex-col gap-y-4 flex-grow-0">
      <p className="text-center">
        MATCH #395
      </p>
      <div className='flex flex-row justify-between px-12'>
        <p className="text-center text-sm">
          DUMPLING
        </p>
        <p className="text-center text-sm text-[#34C7E3;]">
          VS
        </p>
        <p className="text-center text-sm">
          BURGERMADS
        </p>
      </div>
      <div className="rounded-lg border border-[#28323C] flex flex-1 flex-col gap-y-4">
        <div className="flex flex-row items-center justify-center gap-x-4 py-4 px-12 pt-6">
          <MatchResultOpponent
            winner
            image={ExampleAvatar} />
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <MatchResultOpponent
            image={ExampleAvatar2} />
        </div>
        <div className='border-t py-4 flex flex-col items-center justify-center'>
          <p className='text-xs mb-1'>
            Winner
          </p>
          <p className='text-trade-up'>
            DUMPLING
          </p>
        </div>
      </div>
      <Button variant="outline" className='self-center'>
        <Image src={TwitterLogo} alt='twitter' className='mr-2' />
        Share on twitter
      </Button>
    </div>
  )
}