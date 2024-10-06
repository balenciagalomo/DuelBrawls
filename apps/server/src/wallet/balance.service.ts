import { Injectable } from '@nestjs/common';
import { createAssociatedTokenAccountIdempotentInstruction, createTransferInstruction, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  VersionedTransaction,
  TransactionMessage,
  PublicKey,
  Signer,
  ParsedAccountData,
  SystemProgram
} from '@solana/web3.js';

import { ConnectionService } from './connection.service';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TransactionInstruction } from '@solana/web3.js';

@Injectable()
export class BalanceService {
  constructor(
    private readonly connection: ConnectionService
  ) { }

  public async splTransferIxs(inputs: {
    from: PublicKey;
    to: PublicKey;
    mint: PublicKey;
    uiAmount: number,
    payer?: PublicKey
  }) {
    const payer = inputs.payer ?? inputs.from
    const sourceATA = getAssociatedTokenAddressSync(inputs.mint, inputs.from)
    const destinationATA = getAssociatedTokenAddressSync(inputs.mint, inputs.to)
    const decimals = await this.getNumberDecimals(inputs.mint);

    const ixs = [
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
    ]

    return ixs
  }

  public async solTransferIxs(inputs: {
    from: PublicKey,
    to: PublicKey,
    uiAmount: number
  }) {
    const ixs = [
      SystemProgram.transfer({
        fromPubkey: inputs.from,
        toPubkey: inputs.to,
        lamports: LAMPORTS_PER_SOL * inputs.uiAmount
      })
    ]

    return ixs
  }

  public async txFromIxs(inputs: {
    instructions: TransactionInstruction[],
    payer: PublicKey
  }) {
    const blockhash = await this.connection.connection.getLatestBlockhash().then(res => res.blockhash);

    const messageV0 = new TransactionMessage({
      payerKey: inputs.payer,
      recentBlockhash: blockhash,
      instructions: inputs.instructions
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
