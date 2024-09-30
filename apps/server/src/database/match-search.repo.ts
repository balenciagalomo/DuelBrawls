import { Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { DatabaseService } from './database.service';
import { UserRepository } from './user.repo';
import { Database } from 'src/generated/database.types';

export type GameType = Database["public"]["Enums"]["game_type"]

export type MatchSearchState = Database["public"]["Enums"]["match_search_state"]

export type MatchSearch = Database['public']['Tables']['match_searches']['Row'];

export class ActiveMatchSearchExistsError extends Error {
  public message = 'Active match search is on going'
}

export class NonActiveMatchSearchExistsError extends Error {
  public message = 'No active match search exists'
}

@Injectable()
export class MatchSearchRepository {
  constructor(
    private readonly database: DatabaseService,
    private readonly user: UserRepository
  ) { }

  public async create(inputs: {
    pubkey: PublicKey;
    gameType: string
  }) {
    const user = await this.user.findByPubkey(inputs.pubkey);
    const activeSearch = await this.findActiveOneByPubkey(inputs.pubkey);

    // Ensure no other active match search exists
    assert(!activeSearch, new ActiveMatchSearchExistsError())

    const results = await this.database.supabase
      .from('match_searches')
      .insert({
        user_id: user.id,
        game_type: 'one_vs_one',
        match_search_state: 'active'
      })
      .select()
      .single()

    if (results.error) throw results.error;
    return results.data
  }

  // TODO: Only cancellable for certain people (e.g creator or admin)
  public async cancel(inputs: {
    pubkey: PublicKey
  }) {
    const activeSearch = await this.findActiveOneByPubkey(inputs.pubkey)
    assert(activeSearch, new ActiveMatchSearchExistsError())

    assert(activeSearch, new NonActiveMatchSearchExistsError())

    const results = await this.database.supabase
      .from('match_searches')
      .update({
        match_search_state: 'cancel'
      })
      .eq('id', activeSearch.id)
      .select()
      .single()
    if (results.error) throw results.error;
    return results.data
  }

  public async findActiveOneByPubkey(pubkey: PublicKey) {
    const user = await this.user.findByPubkey(pubkey);
    const results = await this.database.supabase
      .from('match_searches')
      .select()
      .eq('user_id', user.id)
      .eq('match_search_state', 'active')
      .limit(1)
    if (results.error) throw results.error;
    return results.data.at(0)
  }
}

function assert(condition: unknown, error: Error): asserts condition {
  if (condition === false) throw error
}