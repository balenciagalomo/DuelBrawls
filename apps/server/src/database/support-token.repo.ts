import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Injectable()
export class SupportTokenRepository {
  constructor(
    private readonly database: DatabaseService,
  ) { }

  public async findOneByName(name: string) {
    const results = await this.database.supabase
      .from('support_tokens')
      .select()
      .eq('name', name)
      .single()
    if (results.error) throw results.error;
    return results.data
  }

  public async findOneById(id: string) {
    const results = await this.database.supabase
      .from('support_tokens')
      .select()
      .eq('id', id)
      .single()
    if (results.error) throw results.error;
    return results.data
  }
}