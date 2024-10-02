import { Module } from '@nestjs/common';
import { MatchSearchService } from './match-search.service';
import { DatabaseModule } from '../database/database.module';
import { MatchService } from './match.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [MatchSearchService, MatchService],
  exports: [MatchSearchService, MatchService]
})
export class MatchModule {}
