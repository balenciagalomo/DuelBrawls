import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, VersionedMessage } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";

import { trpc } from "@/app/trpc";
import { VersionedTransaction } from "@solana/web3.js";

export function useDeposit() {
  const { connection } = useConnection();
  const wallet = useWallet();
  return useMutation({
    mutationFn: async (amount: number) => {
      if (!wallet.signTransaction || !wallet.sendTransaction) {
        throw new Error('Wallet not connected')
      }
      const results = await trpc.profile.deposit.mutate({
        amount
      })
      
      const message = VersionedMessage.deserialize(Buffer.from(results.tx.serialized, "base64"));
      const transaction = new VersionedTransaction(message)
      const signedTranaction = await wallet.signTransaction(transaction)

      const blockhash = await connection.getLatestBlockhash();
      const signature = await wallet.sendTransaction(signedTranaction, connection)

      const confirmation = await connection.confirmTransaction({
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight,
        signature,
      }, 'confirmed')

      if (confirmation.value.err) {
        throw new Error(confirmation.value.err.toString())
      }
      return signature
    }
  })
}