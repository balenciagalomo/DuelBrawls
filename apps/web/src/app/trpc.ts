'use client';

import { createTRPCProxyClient, createWSClient, httpBatchLink, loggerLink, splitLink, wsLink } from "@trpc/client";
import type { AppRouter } from '../../../server/src/trpc/trpc.router'

const getUrl = () => `${process.env.NEXT_PUBLIC_API_URL}/trpc`

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('jwt')}`
})

const wsClient = createWSClient({
  url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
});

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink(),
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: getUrl(),
        headers: getHeaders
      }),
    }),
  ],
});
