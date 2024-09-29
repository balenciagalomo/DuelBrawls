import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration'
import { TrpcModule } from './trpc/trpc.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }), TrpcModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

