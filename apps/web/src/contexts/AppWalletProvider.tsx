'use client';

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { PropsWithChildren } from "react";

import { SOLANA_RPC_URL } from "@/constants/solana";
import "@solana/wallet-adapter-react-ui/styles.css";

export function AppWalletProvider(props: PropsWithChildren<object>) {

  return (
    <ConnectionProvider endpoint={SOLANA_RPC_URL}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          {props.children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
