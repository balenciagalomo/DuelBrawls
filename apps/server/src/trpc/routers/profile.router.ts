
import { Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { z } from 'zod';

import { TrpcService } from '../../trpc/trpc.service';
import { UserRepository } from '../../database/user.repo';
import { BalanceService } from '../../wallet/balance.service';
import { MatchSearchService } from '../../match/match-search.service';

@Injectable()
export class ProfileRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly user: UserRepository,
    private readonly balance: BalanceService,
    private readonly match: MatchSearchService,
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
      pubkey: ctx.user.pubkey.toBase58(),
      wallet_address: ctx.user.walletKeypair.publicKey.toBase58()
    })),
    deposit: this.trpc.protectedProcedure.input(z.object({
      amount: z.number()
    })).mutation(async ({ ctx, input }) => {
      const config = await this.match.getDefaultGameConfig()
      const tx = await this.balance.splTransferTx({
        from: ctx.user.pubkey,
        to: ctx.user.walletKeypair.publicKey,
        mint: new PublicKey(config.token.token_pubkey),
        uiAmount: input.amount
      })
      const serialized = Buffer.from(tx.serialize()).toString("base64")
      return {
        tx: {
          serialized
        }
      }
    }),
  });
}
