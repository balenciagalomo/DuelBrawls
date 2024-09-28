'use client';

import Image from 'next/image'
import { useEffect, useMemo } from 'react';
import { useDebounce } from '@uidotdev/usehooks';

import ExampleAvatar from '@/app/assets/images/example-avatar.png'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { trpc } from '@/app/trpc';

export function useWalletAuth() {
  const wallet = useWallet();
  const walletModal = useWalletModal();

  const debouncedWalletConnected = useDebounce(wallet.connected, 300)

  const displayUsername = useMemo(() => {
    if (wallet.publicKey) {
      return wallet.publicKey.toBase58().slice(0, 6)
    }
    return undefined
  }, [wallet.publicKey]);

  const onDisconnect = () => wallet.disconnect()
  const onConnect = async () => walletModal.setVisible(true)

  const onAuthSignMessage = async () => {
    if (!wallet.publicKey || !wallet.signMessage) {
      throw new Error('Wallet not connected')
    }
    const { message } = await trpc.auth.login.query()
    const encodedMessage = new TextEncoder().encode(message)
    const signature = await wallet.signMessage(encodedMessage);

    const verified = await trpc.auth.verify.mutate({
      message: Array.from(encodedMessage),
      signature: Array.from(signature),
      signer: wallet.publicKey.toBase58()
    })

    console.log('verifed', { verified})
  }

  useEffect(() => {
    if (debouncedWalletConnected) {
      onAuthSignMessage().catch(onDisconnect)
    }
  }, [debouncedWalletConnected])

  return {
    onDisconnect,
    onConnect,
    displayUsername,
    connected: debouncedWalletConnected
  }
}