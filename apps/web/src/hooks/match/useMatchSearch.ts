import { trpc } from "@/app/trpc";
import { PublicKey } from "@solana/web3.js";
import { useMutation } from "@tanstack/react-query";

export type MatchSearchResult = {
  participants: PublicKey[];
}

export function useMatchSearch() {
  return useMutation({
    mutationFn: async () => {
      // if (!publicKey) throw new Error('Please connect your wallet first')
      return await new Promise<MatchSearchResult>((resolve, reject) => {
        const subscription = trpc.match.watch.subscribe(undefined, {
          async onStarted() {
            await trpc.match.find.mutate()
          },
          onData(data) {
            const timeout = setTimeout(() => {
              subscription.unsubscribe();
              reject(new Error('Unable to find match in 1 mins'))
            }, 1000 * 60 * 1)

            subscription.unsubscribe();
            resolve({
              participants: data.participants.map(value => new PublicKey(value))
            });
            clearTimeout(timeout);
          },
          onError(err) {
            console.error('error', err);
          },
        });
      });
    }
  })
}