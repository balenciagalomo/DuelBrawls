import { INestApplication, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { z } from 'zod';
import * as ws from 'ws'

import { TrpcService } from '../trpc/trpc.service';
import { AuthRouter } from './routers/auth.router';
import { ProfileRouter } from './routers/profile.router';
import { MatchRouter } from './routers/match.router';
import { JwtService } from '../auth/jwt.service';
import { UserRepository } from '../database/user.repo';

const wss = new ws.Server({
  port: 4001,
});

@Injectable()
export class TrpcRouter implements OnModuleInit, OnModuleDestroy {

  private readonly logger = new Logger(TrpcRouter.name);
  
  private wsHandler: ReturnType<typeof applyWSSHandler>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly jwt: JwtService,
    private readonly userRepo: UserRepository,
    private readonly auth: AuthRouter,
    private readonly profile: ProfileRouter,
    private readonly match: MatchRouter
  ) {
    const authContext = this.trpc.getAuthContext;
    this.wsHandler = applyWSSHandler({
      wss, router: this.appRouter, createContext: async ({ req }) => {
        const token = req.headers.authorization?.replace('Bearer', '').trim()
        return await authContext({
          jwt, token, userRepo
        })
      }
    });
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

  public onModuleInit() {
    this.logger.log('WebSocket Server listening on ws://localhost:4001')
  }

  public onModuleDestroy() {
    this.wsHandler.broadcastReconnectNotification();
    wss.close();
  }
}

export type AppRouter = TrpcRouter[`appRouter`];

