import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js'

import { Database } from '../generated/database.types'
import { SecretMissingError } from '../config/error';

@Injectable()
export class DatabaseService {
  public supabase: ReturnType<typeof createClient<Database>>;

  constructor(
    private readonly config: ConfigService
  ) {
    const url = this.config.get<string>('supabase.url');
    const serviceKey = this.config.get<string>('supabase.serviceRoleKey');

    if (!url) throw new SecretMissingError('supabase.url')
    if (!serviceKey) throw new SecretMissingError('supabase.serviceRoleKey')
    
    this.supabase = createClient<Database>(url, serviceKey)
  }
}
