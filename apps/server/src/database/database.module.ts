import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UserRepository } from './user.repo';
import { RedisService } from './redis.service';
import { MatchParticipantRepository } from './match-participant.repo';
import { MatchRepository } from './match.repo';
import { SupportTokenRepository } from './support-token.repo';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [WalletModule],
  controllers: [],
  providers: [
    DatabaseService,
    RedisService,
    UserRepository,
    MatchParticipantRepository,
    MatchRepository,
    SupportTokenRepository
  ],
  exports: [
    RedisService,
    UserRepository,
    MatchParticipantRepository,
    MatchRepository,
    SupportTokenRepository
  ]
})
export class DatabaseModule { }
