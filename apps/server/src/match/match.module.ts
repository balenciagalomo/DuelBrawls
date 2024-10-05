import { Module } from '@nestjs/common';
import { MatchSearchService } from './match-search.service';
import { DatabaseModule } from '../database/database.module';
import { MatchService } from './match.service';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [DatabaseModule, WalletModule],
  controllers: [],
  providers: [MatchSearchService, MatchService],
  exports: [MatchSearchService, MatchService]
})
export class MatchModule {}
