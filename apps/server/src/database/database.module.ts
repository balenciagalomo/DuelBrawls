import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UserRepository } from './user.repo';
import { RedisService } from './redis.service';
import { MatchInviteRepository } from './match-invite.repo';
import { MatchRepository } from './match.repo';

@Module({
  imports: [],
  controllers: [],
  providers: [
    DatabaseService,
    RedisService,
    UserRepository,
    MatchInviteRepository,
    MatchRepository
  ],
  exports: [
    RedisService,
    UserRepository,
    MatchInviteRepository,
    MatchRepository
  ]
})
export class DatabaseModule { }
