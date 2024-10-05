import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Database } from '../generated/database.types';
import { MatchStatusState } from '../generated/enum.types';

@Injectable()
export class MatchRepository {
  constructor(
    private readonly database: DatabaseService,
  ) { }

  public async create(inputs: {
    gameType: Database["public"]["Enums"]["game_type"],
    token: string;
    individualWageAmount: number,
    individualTradeAmount: number
  }) {
    const results = await this.database.supabase
      .from('matches')
      .insert({
        game_type: inputs.gameType,
        token: inputs.token,
        individual_wage_amount: inputs.individualWageAmount,
        individual_trade_amount: inputs.individualTradeAmount
      })
      .select()
      .single()
    if (results.error) throw results.error;
    return results.data
  }

  public async findOneById(matchId: string) {
    const results = await this.database.supabase
      .from('matches')
      .select()
      .eq('id', matchId)
      .single()
    if (results.error) throw results.error;
    return results.data
  }

  public async updateMatchState(inputs: {
    matchId: string;
    matchState: MatchStatusState
  }) {
    const results = await this.database.supabase
      .from('matches')
      .update({
        status: inputs.matchState
      })
      .eq('id', inputs.matchId)
      .select()
      .single()
    if (results.error) throw results.error;
    return results.data
  }
}