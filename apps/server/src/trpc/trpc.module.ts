import { Module } from '@nestjs/common';
import { TrpcService } from '../trpc/trpc.service';
import { TrpcRouter } from '../trpc/trpc.router';
import { AuthModule } from 'src/auth/auth.module';
import { AuthRouter } from './routers/auth.router';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [TrpcService, TrpcRouter, AuthRouter],
})
export class TrpcModule {}
