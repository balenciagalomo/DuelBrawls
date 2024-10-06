import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ConnectionService } from './connection.service';
import { BalanceService } from './balance.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ConnectionService, WalletService, BalanceService],
  exports: [ConnectionService, WalletService, BalanceService]
})
export class WalletModule {}
