import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DriftTradingService } from './drift.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [DriftTradingService],
  exports: [DriftTradingService]
})
export class TradingModule {}
