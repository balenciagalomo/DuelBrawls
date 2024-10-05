import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ConnectionService } from './connection.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ConnectionService, WalletService],
  exports: [ConnectionService, WalletService]
})
export class WalletModule {}
