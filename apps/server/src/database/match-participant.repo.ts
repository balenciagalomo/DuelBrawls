import { Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { Database } from '../generated/database.types';
import { DatabaseService } from './database.service';
import { UserRepository } from './user.repo';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class MatchParticipantRepository {
  constructor(
    private readonly database: DatabaseService,
    private readonly wallet: WalletService,
    private readonly user: UserRepository
  ) { }

  public async create(inputs: {
    matchId: string;
    pubkey: PublicKey;
  }) {
    const user = await this.user.findByPubkey(inputs.pubkey);

    const results = await this.database.supabase
      .from('match_participants')
      .insert({
        match_id: inputs.matchId,
        user_id: user.id,
        invite_state: 'pending',
        game_wallet_private_key: this.wallet.generatePrivateKey(),
      })
      .select()
      .single()

    if (results.error) throw results.error;
    return results.data
  }

  public async findByUserId(inputs: {
    userId: string
  }) {
    const results = await this.database.supabase
      .from('match_participants_view')
      .select()
      .eq('user_id', inputs.userId)
    if (results.error) throw results.error;
    return results.data
  }

  public async findParticipantsByMatch(matchId: string) {
    const results = await this.database.supabase
      .from('match_participants_view')
      .select()
      .eq('match_id', matchId)
    if (results.error) throw results.error;
    return results.data
  }

  public async findParticipantById(participantId: string) {
    const results = await this.database.supabase
      .from('match_participants_view')
      .select()
      .eq('id', participantId)
      .single()
    if (results.error) throw results.error;
    return results.data
  }
  
  public async findWalletByParticipantId(participantId: string) {
    const results = await this.database.supabase
      .from('match_participants')
      .select()
      .eq('id', participantId)
      .single()
    if (results.error) throw results.error;
    return results.data
  }

  public async updateInviteState(inputs: {
    participantId: string;
    inviteState: Database["public"]["Enums"]["match_invite_state"]
  }) {
    const results = await this.database.supabase
      .from('match_participants')
      .update({
        invite_state: inputs.inviteState
      })
      .eq('id', inputs.participantId)
      .select()
      .single()

    if (results.error) throw results.error;
    return results.data
  }
}