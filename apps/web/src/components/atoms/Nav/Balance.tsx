'use client';

import Image from 'next/image'

import USDC from '@/app/assets/svgs/usdc.svg'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletUSDCBalance } from '@/hooks/balances/useWalletUSDCBalance';

export function Balance() {
  const wallet = useWallet()
  const usdcBalanceQuery = useWalletUSDCBalance()
  const usdcUiAmount = usdcBalanceQuery.data?.value.uiAmount ?? 0
  if (!wallet.publicKey) return null;
  return (
    <div className="flex flex-row items-center gap-2 p-3 rounded-md bg-[#10141C]">
      <div className='flex flex-col gap-y-1'>
        <p className='text-sm text-gray-500'>Balance</p>
        <div className='flex flex-row gap-x-2'>
          <Image src={USDC} alt='usdc' />
          <p className='text-sm'>${usdcUiAmount}</p>
        </div>
      </div>
      <div className='w-8' />
    </div>
  )
}