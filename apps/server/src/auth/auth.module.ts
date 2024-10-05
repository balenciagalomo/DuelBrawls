import { Module } from '@nestjs/common';
import { WalletModule } from '../wallet/wallet.module';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';

@Module({
  imports: [WalletModule],
  controllers: [],
  providers: [AuthService, JwtService],
  exports: [AuthService, JwtService]
})
export class AuthModule {}
