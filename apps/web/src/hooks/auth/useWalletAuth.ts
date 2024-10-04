'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';

import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { trpc } from '@/app/trpc';
import { assert } from '@/utils/assert';

export function useWalletAuth() {
  const [authenciated, setAuthenciated] = useState(false)

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
    assertWalletConnected(wallet);

    await trpc.profile.me
      .query()
      .catch(async () => {
        assertWalletConnected(wallet);
        const { message } = await trpc.auth.login.query()
        const encodedMessage = new TextEncoder().encode(message)
        const signature = await wallet.signMessage!(encodedMessage);
        const verified = await trpc.auth.verify.mutate({
          message: Array.from(encodedMessage),
          signature: Array.from(signature),
          signer: wallet.publicKey!.toBase58()
        })
        localStorage.setItem('jwt', verified.token);
        setAuthenciated(true)
      })
  }

  useEffect(() => {
    if (debouncedWalletConnected) {
      onAuthSignMessage().catch((e) => {
        console.error('[auth] failed to login', e)
        onDisconnect()
      })
    }
  }, [debouncedWalletConnected, onAuthSignMessage])

  return {
    authenciated,
    onDisconnect,
    onConnect,
    displayUsername,
    connected: debouncedWalletConnected
  }
}

class WalletIsNotConnected extends Error {
  public message = "Wallet is not connected"
}

function assertWalletConnected(wallet: WalletContextState) {
  assert(wallet && wallet.signMessage, new WalletIsNotConnected())
}