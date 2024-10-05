import { Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { DatabaseService } from './database.service';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58'

@Injectable()
export class UserRepository {
  constructor(private readonly database: DatabaseService) { }

  public async create(inputs: {
    pubkey: PublicKey
  }) {
    const results = await this.database.supabase
      .from('users')
      .insert({
        pubkey: inputs.pubkey.toBase58(),
        wallet_private_key: bs58.encode(Keypair.generate().secretKey)
      })
      .select()
      .single()
    if (results.error) throw results.error;
    return results.data
  }

  public async findById(id: string) {
    const results = await this.database.supabase
      .from('users')
      .select()
      .eq('id', id)
      .single()
    if (results.error) throw results.error;
    return results.data
  }

  public async findByPubkey(pubkey: PublicKey) {
    const results = await this.database.supabase
      .from('users')
      .select()
      .eq('pubkey', pubkey.toBase58())
      .single()
    if (results.error) throw results.error;
    return results.data
  }

  public async list() {
    const results = await this.database.supabase.from('users').select()
    if (results.error) throw results.error;
    return results.data
  }
}
