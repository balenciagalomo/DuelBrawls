import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserRepository } from './database/user.repo';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userRepo: UserRepository
  ) {}

  @Get()
  async getHello() {
    return this.userRepo.list()
  }
}
