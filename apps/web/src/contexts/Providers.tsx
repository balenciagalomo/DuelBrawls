'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

import { AppWalletProvider } from "./AppWalletProvider";

// Create a client
const queryClient = new QueryClient()

export function Providers(props: PropsWithChildren<object>) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppWalletProvider>
        {props.children}
      </AppWalletProvider>
    </QueryClientProvider>
  )
}