import { INestApplication, Injectable } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import { z } from 'zod';

import { TrpcService } from '../trpc/trpc.service';
import { AuthRouter } from './routers/auth.router';
import { ProfileRouter } from './routers/profile.router';

@Injectable()
export class TrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly auth: AuthRouter,
    private readonly profile: ProfileRouter
  ) {}

  appRouter = this.trpc.router({
    auth: this.auth.router,
    profile: this.profile.router,
    hello: this.trpc.procedure
      .input(
        z.object({
          name: z.string().optional(),
        }),
      )
      .query(({ input }) => {
        const { name } = input;
        return {
          greeting: `Hello ${name ? name : `Bilbo`}`,
        };
      }),
  });

  async applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
        createContext: this.trpc.createContext()
      }),
    );
  }
}

export type AppRouter = TrpcRouter[`appRouter`];

