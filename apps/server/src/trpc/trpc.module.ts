import { Module } from '@nestjs/common';
import { TrpcService } from '../trpc/trpc.service';
import { TrpcRouter } from '../trpc/trpc.router';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { AuthRouter } from './routers/auth.router';
import { ProfileRouter } from './routers/profile.router';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [],
  providers: [TrpcService, TrpcRouter, AuthRouter, ProfileRouter],
})
export class TrpcModule {}
