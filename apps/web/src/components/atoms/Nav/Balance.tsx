import Image from 'next/image'

import USDC from '@/app/assets/svgs/usdc.svg'

export function Balance() {
  return (
    <div className="flex flex-row items-center gap-2 p-3 rounded-md bg-[#10141C]">
      <div className='flex flex-col gap-y-1'>
        <p className='text-sm text-gray-500'>Balance</p>
        <div className='flex flex-row gap-x-2'>
          <Image src={USDC} alt='usdc' />
          <p className='text-sm'>$10000</p>
        </div>
      </div>
      <div className='w-8' />
    </div>
  )
}