import { Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { initTRPC, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';

import { JwtService } from '../auth/jwt.service';
import { UserRepository } from 'src/database/user.repo';

export interface TrpcContext {
  user?: {
    id: string;
    pubkey: PublicKey;
  };
}

@Injectable()
export class TrpcService {

  public trpc = initTRPC.context<TrpcContext>().create();
  public procedure = this.trpc.procedure;
  public router = this.trpc.router;
  public mergeRouters = this.trpc.mergeRouters;

  constructor(
    private readonly jwt: JwtService,
    private readonly user: UserRepository
  ) { }

  public createContext() {
    const jwt = this.jwt;
    const userRepo = this.user
    return async (opts: CreateExpressContextOptions): Promise<TrpcContext> => {
      const authorization = opts.req.headers.authorization;
      const token = authorization?.replace('Bearer', '').trim()
      try {
        if (!token || !jwt.verifyToken(token)) {
          throw new Error('Invalid auth token')
        }
        const decoded = jwt.decode(token)
        const wallet = new PublicKey(decoded.walletAddress)
        const user = await userRepo.findByPubkey(wallet)
        if (!user.pubkey) throw new Error('Invalid wallet pubkey')
        return {
          user: {
            id: user.id,
            pubkey: new PublicKey(user.pubkey)
          }
        }
      } catch {
        return {
          user: undefined
        }
      }
    }
  };

  public protectedProcedure = this.trpc.procedure.use(
    async (
      opts,
    ) => {
      const { ctx } = opts;
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      console.log('hi')
      return opts.next({
        ctx: {
          user: ctx.user,
        },
      });
    }
  );
}
