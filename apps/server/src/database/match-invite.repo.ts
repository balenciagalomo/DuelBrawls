import { Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { DatabaseService } from './database.service';
import { UserRepository } from './user.repo';
import { Database } from '../generated/database.types';
import { MatchInviteState } from '../generated/enum.types';

@Injectable()
export class MatchInviteRepository {
  constructor(
    private readonly database: DatabaseService,
    private readonly user: UserRepository
  ) { }

  public async create(inputs: {
    matchId: string;
    pubkey: PublicKey;
  }) {
    const user = await this.user.findByPubkey(inputs.pubkey);

    const results = await this.database.supabase
      .from('match_invites')
      .insert({
        user_id: user.id,
        invite_state: 'sent',
        match_id: inputs.matchId
      })
      .select()
      .single()

    if (results.error) throw results.error;
    return results.data
  }

  public async findUserInvites(inputs: {
    userId: string
  }) {
    const results = await this.database.supabase
      .from('match_invites')
      .select()
      .eq('user_id', inputs.userId)
    if (results.error) throw results.error;
    return results.data
  }

  public async findInvitesByMatch(matchId: string) {
    const results = await this.database.supabase
      .from('match_invites')
      .select()
      .eq('match_id', matchId)
    if (results.error) throw results.error;
    return results.data
  }

  public async findInviteById(inviteId: string) {
    const results = await this.database.supabase
      .from('match_invites')
      .select()
      .eq('id', inviteId)
      .single()
    if (results.error) throw results.error;
    return results.data
  }

  public async updateInviteState(inputs: {
    inviteId: string;
    inviteState: Database["public"]["Enums"]["match_invite_state"]
  }) {
    const results = await this.database.supabase
      .from('match_invites')
      .update({
        invite_state: inputs.inviteState
      })
      .eq('id', inputs.inviteId)
      .select()
      .single()

    if (results.error) throw results.error;
    return results.data
  }
}