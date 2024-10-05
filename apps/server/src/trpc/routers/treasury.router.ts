
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PublicKey, Keypair } from '@solana/web3.js';
import { z } from 'zod';
import bs58 from 'bs58';

import { TrpcService } from '../../trpc/trpc.service';
import { UserRepository } from '../../database/user.repo';
import { WalletService } from '../../wallet/wallet.service';
import { SecretMissingError } from '../../config/error';


@Injectable()
export class TreasuryRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly user: UserRepository,
    private readonly wallet: WalletService,
    private readonly config: ConfigService
  ) { }

  public router = this.trpc.router({
    create: this.trpc.procedure.input(z.object({
      pubkey: z.string()
    })).mutation(({ input }) => {
      return this.user.create({
        pubkey: new PublicKey(input.pubkey)
      })
    }),
    mint: this.trpc.protectedProcedure.mutation(async ({ ctx }) => {
      const privateKeyString = this.config.get<string>('game.usdcTreasury')
      const mintString = this.config.get<string>('game.usdcTreasuryMint')

      if (!privateKeyString) throw new SecretMissingError('game.usdcTreasury')
      if (!mintString) throw new SecretMissingError('game.usdcTreasuryMint')

      const keypair = Keypair.fromSecretKey(bs58.decode(privateKeyString))
      const mint = new PublicKey(mintString)

      console.log('to', ctx.user.walletKeypair.publicKey.toBase58()
)
      const tx = await this.wallet.splTransferTx({
        from: keypair.publicKey,
        to: ctx.user.walletKeypair.publicKey,
        mint,
        payer: keypair,
        uiAmount: 500
      })

      return await this.wallet.execute({ tx, signer: keypair })
    })
  });
}
