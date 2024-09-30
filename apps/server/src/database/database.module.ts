import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UserRepository } from './user.repo';
import { RedisService } from './redis.service';
import { MatchSearchRepository } from './match-search.repo';

@Module({
  imports: [],
  controllers: [],
  providers: [DatabaseService, RedisService, UserRepository, MatchSearchRepository],
  exports: [RedisService, UserRepository, MatchSearchRepository]
})
export class DatabaseModule {}
