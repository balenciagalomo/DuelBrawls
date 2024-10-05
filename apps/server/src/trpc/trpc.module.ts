import { Module } from '@nestjs/common';
import { TrpcService } from '../trpc/trpc.service';
import { TrpcRouter } from '../trpc/trpc.router';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { AuthRouter } from './routers/auth.router';
import { ProfileRouter } from './routers/profile.router';
import { MatchRouter } from './routers/match.router';
import { MatchModule } from '../match/match.module';
import { TreasuryRouter } from './routers/treasury.router';
import { WalletModule } from '../wallet/wallet.module';
import { TradingModule } from '../trading/trading.module';

@Module({
  imports: [AuthModule, DatabaseModule, MatchModule, WalletModule, TradingModule],
  controllers: [],
  providers: [TrpcService, TrpcRouter, AuthRouter, ProfileRouter, MatchRouter, TreasuryRouter],
})
export class TrpcModule { }
