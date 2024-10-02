'use client';

import Image from 'next/image'

import ExampleAvatar from '@/app/assets/images/example-avatar.png'
import { useWalletAuth } from '@/hooks/auth/useWalletAuth';

export function Wallet() {
  const {
    connected,
    displayUsername,
    onConnect,
    onDisconnect
  } = useWalletAuth();

  return (
    <div className="flex flex-row items-center gap-2 px-3 py-2 rounded-md bg-[#10141C]">
      {connected && (
        <div className='flex flex-row items-center gap-2 cursor-pointer' onClick={onDisconnect}>
          <Image src={ExampleAvatar} alt='avatar' className='w-6  h-6 '/>
          <p className='text-sm'>{displayUsername}</p>
        </div>
      )}
      {!connected && (
        <button onClick={onConnect} className='text-xs'>
          connect
        </button>
      )}
    </div>
  )
}