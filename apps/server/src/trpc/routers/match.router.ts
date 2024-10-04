
import { Injectable, Logger } from '@nestjs/common';
import { observable } from '@trpc/server/observable';
import { TRPCError } from '@trpc/server';
import { PublicKey } from '@solana/web3.js';
import { z } from 'zod';

import { TrpcService } from '../trpc.service';
import { UserRepository } from '../../database/user.repo';
import { MatchSearchService } from '../../match/match-search.service';
import { RedisService } from '../../database/redis.service';
import { MatchRepository } from '../../database/match.repo';
import { MatchInviteRepository } from '../../database/match-invite.repo';
import { MatchService } from '../../match/match.service';

@Injectable()
export class MatchRouter {
  private readonly logger = new Logger(MatchRouter.name);

  constructor(
    private readonly trpc: TrpcService,
    private readonly user: UserRepository,
    private readonly match: MatchRepository,
    private readonly matchInvite: MatchInviteRepository,
    private readonly matchSearch: MatchSearchService,
    private readonly matchService: MatchService,
    private readonly redis: RedisService
  ) { }

  public router = this.trpc.router({
    // TODO: Find a match for user, if existing match is on going, return an error
    enterQueue: this.trpc.protectedProcedure.mutation(async ({ ctx }) => {
      const queueIndex = await this.matchSearch.enterQueue({
        pubkey: ctx.user.pubkey,
        gameType: 'one_vs_one'
      })
      return {
        position: queueIndex
      }
    }),
    leaveQueue: this.trpc.protectedProcedure.mutation(async ({ ctx }) => {
      return this.matchSearch.leaveQueue({ requestedBy: ctx.user.pubkey })
    }),
    activeMatch: this.trpc.protectedProcedure.query(async ({ ctx }) => {
      const activeMatchResult = await this.matchService.findActiveMatchByUserId(ctx.user.id)
      if (!activeMatchResult?.match) return null

      const matchInvites = (await this.matchInvite
        .findInvitesByMatch(activeMatchResult.match.id))
      const opponentInvite = matchInvites
        .find(invite => invite.user_id !== ctx.user.id)

      if (!opponentInvite) throw new Error('Unable to find oppoent invite')

      const opponent = await this.user.findById(opponentInvite.user_id);

      return {
        match: activeMatchResult.match,
        invites: matchInvites,
        opponent: {
          id: opponent.id,
          pubkey: opponent.pubkey
        }
      }
    }),
    declineMatch: this.trpc.protectedProcedure
      .input(
        z.object({
          inviteId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const matchInvite = await this.matchInvite.findInviteById(input.inviteId)
        if (matchInvite.user_id !== ctx.user.id) {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }
        await this.matchInvite.updateInviteState({
          inviteId: matchInvite.id,
          inviteState: 'decline'
        })
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
