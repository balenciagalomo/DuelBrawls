import { Injectable } from '@nestjs/common';
import {
  VersionedTransaction,
  TransactionSignature,
  SignatureStatus,
  TransactionConfirmationStatus,
  Keypair,
  Signer,
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

  public keypairFromPrivateKey(input: string) {
    return Keypair.fromSecretKey(bs58.decode(input))
  }

  public async execute(inputs: {
    tx: VersionedTransaction,
    signers: Signer[]
  }) {
    inputs.tx.sign(inputs.signers)
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
