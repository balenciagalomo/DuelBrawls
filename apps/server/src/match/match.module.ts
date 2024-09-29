import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { DatabaseModule } from '../database/database.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [DatabaseModule, EventsModule],
  controllers: [],
  providers: [MatchService],
  exports: [MatchService]
})
export class MatchModule {}
