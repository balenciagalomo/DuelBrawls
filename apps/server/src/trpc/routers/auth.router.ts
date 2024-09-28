import { Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { AuthService } from '../../auth/auth.service';
import { JwtService } from '../../auth/jwt.service';
import { TrpcService } from '../../trpc/trpc.service';
import { UserRepository } from '../../database/user.repo';


@Injectable()
export class AuthRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly auth: AuthService,
    private readonly jwt: JwtService,
    private readonly user: UserRepository,
  ) { }

  public router = this.trpc.router({
    login: this.trpc.procedure
      .query(() => {
        return {
          message: this.auth.genreateLoginMessage()
        };
      }),
    verify: this.trpc.procedure.input(z.object({
      message: z.number().array(),
      signature: z.number().array(),
      signer: z.string()
    }),).mutation(async ({ input }) => {
      const signer = new PublicKey(input.signer)
      const verifed = this.auth.verifySignedMessage({
        message: Uint8Array.from(input.message),
        signature: Uint8Array.from(input.signature),
        signer
      })
      if (!verifed) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      // Create user if missing
      await this.user.findByPubkey(signer)
        .catch(() => this.user.create({
          pubkey: signer
        }))

      return this.jwt.issueToken({
        user: input.signer
      })
    })
  });
}
