import { Injectable } from '@nestjs/common';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

@Injectable()
export class WalletService {
  constructor() { }

  public generatePrivateKey() {
    return bs58.encode(Keypair.generate().secretKey)
  }
}
