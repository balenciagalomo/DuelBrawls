import Image from 'next/image'

import ExampleAvatar from '@/app/assets/images/example-avatar.png'

export function Wallet() {
  return (
    <div className="flex flex-row items-center gap-2 p-3 rounded-md bg-[#10141C]">
      <Image src={ExampleAvatar} alt='avatar' />
      <p className='text-sm'>dumpling.sol</p>
      <div className='w-8'/>
    </div>
  )
}