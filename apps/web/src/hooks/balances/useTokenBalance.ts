'use client';

import { getAssociatedTokenAddress } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

const QUERY_KEY = 'token-balance'

type UseTokenBalanceProps = {
  mint?: PublicKey;
  owner?: PublicKey | null;
}

export function useTokenBalance(props: UseTokenBalanceProps) {
  const { mint, owner } = props;
  const { connection } = useConnection();
  return useQuery({
    queryKey: [QUERY_KEY, { mint, owner }],
    queryFn: async () => {
      if (!mint) throw new Error('Invalid mint')
      if (!owner) throw new Error('Invalid owner')
      return fetchTokenBalance({ connection, mint, wallet: owner })
    },
    enabled: Boolean(mint && owner)
  })
}

useTokenBalance.queryKey = QUERY_KEY

type FetchTokenBalanceInputs = {
  connection: Connection;
  wallet: PublicKey;
  mint: PublicKey
};

export function fetchTokenBalance(inputs: FetchTokenBalanceInputs) {
  return getAssociatedTokenAddress(inputs.mint, inputs.wallet).then((ata) =>
    inputs.connection.getTokenAccountBalance(ata)
  );
}