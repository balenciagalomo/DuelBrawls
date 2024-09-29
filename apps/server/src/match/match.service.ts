import { Injectable, Logger } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { RedisService } from '../database/redis.service';
import { EventsGateway } from '../events/events.gateway';
import { AppEvents, AppEventsMap } from 'src/events/events';

enum MatchDatabaseKeys {
  MatchQueue = 'match_queue'
}

@Injectable()
export class MatchService {
  private readonly logger = new Logger(MatchService.name);

  constructor(
    private readonly redis: RedisService,
    private readonly eventsGateway: EventsGateway
  ) { }

  public async find(inputs: {
    requestedBy: PublicKey
  }) {
    // Only push if item does not exists
    // const index = await this.redis
    //   .rpushx(MatchDatabaseKeys.MatchQueue, inputs.requestedBy.toBase58())
    const index = await this.redis
      .sadd(MatchDatabaseKeys.MatchQueue, inputs.requestedBy.toBase58())

    this.logger.log(`User added to queue: ${inputs.requestedBy.toBase58()} at position ${index}`)

    setTimeout(async () => {
      this.redis.emit(AppEvents.MatchQueueUserAdded, {
        pubkey: inputs.requestedBy.toBase58()
      })

      const queueSize = await this.redis.scard(MatchDatabaseKeys.MatchQueue)

      if (queueSize && queueSize % 2 === 0) {
        const participants = await this.redis.spop(MatchDatabaseKeys.MatchQueue, 2)
        this.redis.emit(AppEvents.MatchQueueInviteSent, {
          participants
        })
      }
    }, 2000);

    return index
  }
}
