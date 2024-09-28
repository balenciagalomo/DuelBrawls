import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AuthService, JwtService],
  exports: [AuthService, JwtService]
})
export class AuthModule {}
