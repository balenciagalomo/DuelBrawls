import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Injectable()
export class MatchMessageRepository {
  constructor(
    private readonly database: DatabaseService,
  ) { }

  public async create(inputs: {
    matchId: string;
    userId: string;
    message: string;
  }) {
    const results = await this.database.supabase
      .from('match_messages')
      .insert({
        match_id: inputs.matchId,
        message: inputs.message,
        user_id: inputs.userId
      })
      .select()
      .single()
    if (results.error) throw results.error;
    return results.data
  }

  public async findMany(matchId: string) {
    const results = await this.database.supabase
      .from('match_messages')
      .select()
      .eq('match_id', matchId)
    if (results.error) throw results.error;
    return results.data
  }
}