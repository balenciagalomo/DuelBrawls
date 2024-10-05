import { Injectable } from '@nestjs/common';
import { ASSOCIATED_TOKEN_PROGRAM_ID, createTransferInstruction, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  VersionedTransaction,
  TransactionMessage,
  TransactionSignature,
  SignatureStatus,
  TransactionConfirmationStatus,
  Keypair,
  PublicKey,
  Signer,
  ParsedAccountData,
} from '@solana/web3.js';
import bs58 from 'bs58';

import { ConnectionService } from './connection.service';
import { MatchParticipant, User } from '../generated/tables.types';

@Injectable()
export class WalletService {
  constructor(
    private readonly connection: ConnectionService
  ) { }

  public generatePrivateKey() {
    return bs58.encode(Keypair.generate().secretKey)
  }

  public getUserKeypair(user: User) {
    return Keypair.fromSecretKey(bs58.decode(user.wallet_private_key))
  }

  public getMatchParticipantKeypair(participant: MatchParticipant) {
    return Keypair.fromSecretKey(bs58.decode(participant.game_wallet_private_key))
  }

  public async splTransferTx(inputs: {
    from: PublicKey;
    to: PublicKey;
    mint: PublicKey;
    uiAmount: number,
    payer: Signer
  }) {
    const sourceATA = await getOrCreateAssociatedTokenAccount(
      this.connection.connection,
      inputs.payer,
      inputs.mint,
      inputs.from
    );

    console.log('source ata', sourceATA.address)

    const destinationATA = await getOrCreateAssociatedTokenAccount(
      this.connection.connection,
      inputs.payer,
      inputs.mint,
      inputs.to
    );


    console.log('destination ata', destinationATA.address)

    const decimals = await this.getNumberDecimals(inputs.mint);

    const blockhash = await this.connection.connection.getLatestBlockhash().then(res => res.blockhash);

    const messageV0 = new TransactionMessage({
      payerKey: inputs.payer.publicKey,
      recentBlockhash: blockhash,
      instructions: [
        createTransferInstruction(
          sourceATA.address,
          destinationATA.address,
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

  public async execute(inputs: {
    tx: VersionedTransaction,
    signer: Signer
  }) {
    inputs.tx.sign([inputs.signer])
    const signature = await this.connection.connection.sendTransaction(inputs.tx);
    return await this.confirmTransaction(signature)
  }

  private async confirmTransaction(
    signature: TransactionSignature,
    desiredConfirmationStatus: TransactionConfirmationStatus = 'confirmed',
    timeout: number = 30000,
    pollInterval: number = 1000,
    searchTransactionHistory: boolean = false
  ): Promise<{
    signature: string;
    status: SignatureStatus
  }> {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      const { value: statuses } = await this.connection.connection.getSignatureStatuses([signature], { searchTransactionHistory });

      if (!statuses || statuses.length === 0) {
        throw new Error('Failed to get signature status');
      }

      const status = statuses[0];

      if (status === null) {
        // If status is null, the transaction is not yet known
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        continue;
      }

      if (status.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(status.err)}`);
      }

      if (status.confirmationStatus && status.confirmationStatus === desiredConfirmationStatus) {
        return {
          signature,
          status
        };
      }

      if (status.confirmationStatus === 'finalized') {
        return {
          signature,
          status
        };
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Transaction confirmation timeout after ${timeout}ms`);
  }
}
