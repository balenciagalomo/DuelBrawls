
import { Injectable } from '@nestjs/common';
import { PublicKey, Keypair } from '@solana/web3.js';
import { z } from 'zod';

import { TrpcService } from '../trpc.service';
import { MatchMessageRepository } from '../../database/match-message.repo';


@Injectable()
export class MatchMessageRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly message: MatchMessageRepository,
  ) { }

  public router = this.trpc.router({
    read: this.trpc.protectedProcedure.input(z.object({
      matchId: z.string()
    })).query(({ input }) => {
      return this.message.findMany(input.matchId)
    }),
    send: this.trpc.protectedProcedure.input(z.object({
      message: z.string(),
      matchId: z.string()
    })).mutation(({ ctx, input }) => {
      return this.message.create({
        matchId: input.matchId,
        message: input.message,
        userId: ctx.user?.id
      })
    })
  });
}
