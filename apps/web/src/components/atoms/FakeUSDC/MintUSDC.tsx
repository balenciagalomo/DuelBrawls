'use client';

import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { trpc } from '@/app/trpc';

export function MintUSDC() {
  const mintUSDC = useMutation({
    mutationFn: () => trpc.treasury.mint.mutate()
  });
  return (
    <Button
      variant="ghost"
      isLoading={mintUSDC.isPending}
      disabled={mintUSDC.isPending}
      onClick={() => mintUSDC.mutateAsync()}>
      Mint USDC
    </Button>
  )
}