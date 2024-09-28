
import { Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { z } from 'zod';

import { TrpcService } from '../../trpc/trpc.service';
import { UserRepository } from '../../database/user.repo';

@Injectable()
export class ProfileRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly user: UserRepository,
  ) { }

  public router = this.trpc.router({
    create: this.trpc.procedure.input(z.object({
      pubkey: z.string()
    })).mutation(({ input }) => {
      return this.user.create({
        pubkey: new PublicKey(input.pubkey)
      })
    }),
    me: this.trpc.protectedProcedure.query(({ ctx }) => ({
      id: ctx.user.id,
      pubkey: ctx.user.pubkey.toBase58()
    }))
  });
}
