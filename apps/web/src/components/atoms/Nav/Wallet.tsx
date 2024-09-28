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
    <div className="flex flex-row items-center gap-2 p-3 rounded-md bg-[#10141C]">
      {connected && (
        <div className='flex flex-row items-center gap-2 cursor-pointer' onClick={onDisconnect}>
          <Image src={ExampleAvatar} alt='avatar' />
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