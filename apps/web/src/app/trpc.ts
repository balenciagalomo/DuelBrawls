'use client';

import { createTRPCProxyClient, httpBatchLink, loggerLink, splitLink, wsLink } from "@trpc/client";
import type { AppRouter } from '@/../../server/src/exports'

const getUrl = () => `${process.env.NEXT_PUBLIC_API_URL}/trpc`

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('jwt')}`
})

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink(),
    httpBatchLink({
      url: getUrl(),
      headers: getHeaders
    }),
  ],
});
