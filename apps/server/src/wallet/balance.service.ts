import { Injectable } from '@nestjs/common';
import { createAssociatedTokenAccountIdempotentInstruction, createTransferInstruction, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  VersionedTransaction,
  TransactionMessage,
  PublicKey,
  Signer,
  ParsedAccountData,
} from '@solana/web3.js';

import { ConnectionService } from './connection.service';

@Injectable()
export class BalanceService {
  constructor(
    private readonly connection: ConnectionService
  ) { }

  public async splTransferTx(inputs: {
    from: PublicKey;
    to: PublicKey;
    mint: PublicKey;
    uiAmount: number,
    payer?: PublicKey
  }) {
    const payer = inputs.payer ?? inputs.from
    
    const sourceATA = getAssociatedTokenAddressSync(
      inputs.mint,
      inputs.from
    )

    const destinationATA = getAssociatedTokenAddressSync(
      inputs.mint,
      inputs.to
    )

    const decimals = await this.getNumberDecimals(inputs.mint);

    const blockhash = await this.connection.connection.getLatestBlockhash().then(res => res.blockhash);

    const messageV0 = new TransactionMessage({
      payerKey: payer,
      recentBlockhash: blockhash,
      instructions: [
        createAssociatedTokenAccountIdempotentInstruction(
          payer,
          sourceATA,
          inputs.from,
          inputs.mint,
        ),
        createAssociatedTokenAccountIdempotentInstruction(
          payer,
          destinationATA,
          inputs.to,
          inputs.mint,
        ),
        createTransferInstruction(
          sourceATA,
          destinationATA,
          inputs.from,
          inputs.uiAmount * Math.pow(10, decimals)
        )
      ],
    }).compileToV0Message();

    return new VersionedTransaction(messageV0)
  }

  private async getNumberDecimals(mint: PublicKey): Promise<number> {
    const info = await this.connection.connection.getParsedAccountInfo(mint);
    if (!info.value) {
      throw new Error('Unable to get token account data')
    }
    const result = (info.value.data as ParsedAccountData).parsed.info.decimals as number;
    return result;
  }
}
