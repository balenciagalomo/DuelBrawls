
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection } from '@solana/web3.js';

import { SecretMissingError } from '../config/error';

@Injectable()
export class ConnectionService {

  public connection: Connection
  constructor(
    private readonly config: ConfigService
  ) {
    const rpcUrl = this.config.get<string>('solana.rpc');
    if (!rpcUrl) throw new SecretMissingError('solana.rpc')
    this.connection = new Connection(rpcUrl, 'confirmed')
  }
}

