import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { RedisService } from '../database/redis.service';
import { EventsGateway } from '../events/events.gateway';
import { AppEvents, AppEventsMap } from '../events/events';
import { GameType, MatchSearchRepository } from '../database/match-search.repo';

enum MatchDatabaseKeys {
  MatchQueue = 'match_queue'
}

@Injectable()
export class MatchService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MatchService.name);

  constructor(
    private readonly redis: RedisService,
    private readonly eventsGateway: EventsGateway,
    private readonly matchSearch: MatchSearchRepository
  ) { }


  public onModuleInit() {
    this.redis.on(AppEvents.MatchQueueUserAdded, this.userEnteredMatchQueue.bind(this))
  }

  public onModuleDestroy() {
    this.redis.off(AppEvents.MatchQueueUserAdded, this.userEnteredMatchQueue.bind(this))
  }

  private async userEnteredMatchQueue(inputs: {
    pubkey: PublicKey
  }) {
    const queueSize = await this.redis.scard(MatchDatabaseKeys.MatchQueue)

    if (queueSize && queueSize % 2 === 0) {
      const participants = await this.redis.spop(MatchDatabaseKeys.MatchQueue, 2)
      this.redis.emit(AppEvents.MatchQueueInviteSent, {
        participants
      })
    }
  }

  public async find(inputs: {
    requestedBy: PublicKey,
    gameType: GameType
  }) {

    await this.matchSearch.create({
      pubkey: inputs.requestedBy,
      gameType: inputs.gameType
    })

    // TODO: Create redis key using game type

    // Only push if item does not exists
    // const index = await this.redis
    //   .rpushx(MatchDatabaseKeys.MatchQueue, inputs.requestedBy.toBase58())
    const index = await this.redis
      .sadd(MatchDatabaseKeys.MatchQueue, inputs.requestedBy.toBase58())

    this.logger.log(`User added to queue: ${inputs.requestedBy.toBase58()} at position ${index}`)

    this.redis.emit(AppEvents.MatchQueueUserAdded, {
      pubkey: inputs.requestedBy.toBase58()
    })

    return index
  }

  public async cancel(inputs: {
    requestedBy: PublicKey,
  }) {
    return await this.matchSearch.cancel({ pubkey: inputs.requestedBy })
  }
}
