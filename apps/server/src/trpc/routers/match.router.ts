
import { Injectable, Logger } from '@nestjs/common';
import { observable } from '@trpc/server/observable';
import { PublicKey } from '@solana/web3.js';

import { TrpcService } from '../trpc.service';
import { UserRepository } from '../../database/user.repo';
import { MatchService } from '../../match/match.service';
import { RedisService } from '../../database/redis.service';
import { AppEvents, AppEventsMap } from '../../events/events';

@Injectable()
export class MatchRouter {
  private readonly logger = new Logger(MatchRouter.name);

  constructor(
    private readonly trpc: TrpcService,
    private readonly user: UserRepository,
    private readonly match: MatchService,
    private readonly redis: RedisService
  ) { }

  public router = this.trpc.router({
    // TODO: Find a match for user, if existing match is on going, return an error
    enterQueue: this.trpc.protectedProcedure.mutation(async ({ ctx }) => {
      const queueIndex = await this.match.enterQueue({
        pubkey: ctx.user.pubkey,
        gameType: 'one_vs_one'
      })
      return {
        position: queueIndex
      }
    }),
    leaveQueue: this.trpc.protectedProcedure.mutation(async ({ ctx }) => {
      return this.match.leaveQueue({ requestedBy: ctx.user.pubkey })
    }),
    watch: this.trpc.procedure.subscription(() => {
      return observable<AppEventsMap['match_queue::invite_sent']>((emit) => {
        const listener = (payload: AppEventsMap['match_queue::invite_sent']) => {
          this.logger.log(`match_queue::user_added event received: ${JSON.stringify(payload)}`)
          emit.next(payload)
        }
        this.redis.on(AppEvents.MatchQueueInviteSent, listener)
        return () => {
          this.redis.off(AppEvents.MatchQueueInviteSent, listener)
        };
      });
    }),
    randomNumber: this.trpc.procedure.subscription(() => {
      return observable<{
        randomNumber: number,
        counter: number
      }>((emit) => {
        let counter = 0
        const timer = setInterval(() => {
          // emits a number every second
          emit.next({
            randomNumber: Math.floor(Math.random() * 100),
            counter
          });
          counter++;
        }, 200);
        return () => {
          clearInterval(timer);
        };
      });
    }),
    // TODO: Creat temp wallet by provide deposit
    join: this.trpc.protectedProcedure.query(({ ctx }) => ({

    }))
  });
}
