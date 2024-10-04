import { INestApplication, Injectable, Logger } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import { z } from 'zod';

import { TrpcService } from '../trpc/trpc.service';
import { AuthRouter } from './routers/auth.router';
import { ProfileRouter } from './routers/profile.router';
import { MatchRouter } from './routers/match.router';
import { JwtService } from '../auth/jwt.service';
import { UserRepository } from '../database/user.repo';

@Injectable()
export class TrpcRouter {

  private readonly logger = new Logger(TrpcRouter.name);

  constructor(
    private readonly trpc: TrpcService,
    private readonly jwt: JwtService,
    private readonly userRepo: UserRepository,
    private readonly auth: AuthRouter,
    private readonly profile: ProfileRouter,
    private readonly match: MatchRouter
  ) {
  }

  public appRouter = this.trpc.router({
    auth: this.auth.router,
    profile: this.profile.router,
    match: this.match.router,
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
        createContext: this.trpc.createExpressContext.bind(this.trpc),
      }),
    );
  }
}

export type AppRouter = TrpcRouter[`appRouter`];

