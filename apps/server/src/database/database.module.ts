import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UserRepository } from './user.repo';

@Module({
  imports: [],
  controllers: [],
  providers: [DatabaseService, UserRepository],
  exports: [UserRepository]
})
export class DatabaseModule {}
