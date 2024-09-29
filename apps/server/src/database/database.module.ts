import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UserRepository } from './user.repo';
import { RedisService } from './redis.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DatabaseService, RedisService, UserRepository],
  exports: [RedisService, UserRepository]
})
export class DatabaseModule {}
