import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Database } from '../generated/database.types';

@Injectable()
export class MatchRepository {
  constructor(
    private readonly database: DatabaseService,
  ) { }

  public async create(inputs: {
    gameType: Database["public"]["Enums"]["game_type"]
  }) {
    const results = await this.database.supabase
      .from('matches')
      .insert({
        game_type: inputs.gameType
      })
      .select()
      .single()
    if (results.error) throw results.error;
    return results.data
  }
}