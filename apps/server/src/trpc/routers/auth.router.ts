import { Injectable } from '@nestjs/common';

import { AuthService } from '../../auth/auth.service';
import { TrpcService } from '../../trpc/trpc.service';
import { z } from 'zod';
import { PublicKey } from '@solana/web3.js';

@Injectable()
export class AuthRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly auth: AuthService
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
    }),).mutation(({input}) => {
      return this.auth.verifySignedMessage({
        message: Uint8Array.from(input.message),
        signature: Uint8Array.from(input.signature),
        signer: new PublicKey(input.signer),
      })
    })
  });
}
