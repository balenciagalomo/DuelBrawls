'use client';

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from '../../../server/src/trpc/trpc.router'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`, // you should update this to use env variables
      headers: () => {
        const token = localStorage.getItem('jwt')
        return {
          'Authorization': `Bearer ${token}`
        }
      }
    }),
  ],
});
