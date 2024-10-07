
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
import { MatchParticipantRepository } from '../../database/match-participant.repo';
import { MatchService } from '../../match/match.service';
import { DriftTradingService } from '../../trading/drift.service';
import { WalletService } from '../../wallet/wallet.service';

@Injectable()
export class MatchRouter {
  private readonly logger = new Logger(MatchRouter.name);

  constructor(
    private readonly trpc: TrpcService,
    private readonly user: UserRepository,
    private readonly match: MatchRepository,
    private readonly matchParticipant: MatchParticipantRepository,
    private readonly matchSearch: MatchSearchService,
    private readonly matchService: MatchService,
    private readonly redis: RedisService,
    private readonly drift: DriftTradingService,
    private readonly wallet: WalletService
  ) { }

  public router = this.trpc.router({
    defaultConfig: this.trpc.procedure.query(async () => {
      const defaultGameConfig = await this.matchSearch.getDefaultGameConfig();
      return defaultGameConfig
    }),
    // TODO: Find a match for user, if existing match is on going, return an error
    enterQueue: this.trpc.protectedProcedure.mutation(async ({ ctx }) => {
      const defaultGameConfig = await this.matchSearch.getDefaultGameConfig();
      const queueIndex = await this.matchSearch.enterQueue({
        pubkey: ctx.user.pubkey,
        gameType: defaultGameConfig.game_type,
        token: defaultGameConfig.token.id,
        tradeAmount: defaultGameConfig.individual_trade_amount,
        wageAmount: defaultGameConfig.individual_wage_amount
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

      const participants = await this.matchParticipant
        .findParticipantsByMatch(activeMatchResult.match.id)
      const opponentInvite = participants
        .find(invite => invite.user_id !== ctx.user.id)

      if (!opponentInvite) throw new Error('Unable to find oppoent invite')
      if (!opponentInvite.user_id) throw new Error('Oppoenet user id can not be null')

      const opponent = await this.user.findById(opponentInvite.user_id);

      return {
        match: activeMatchResult.match,
        participants,
        opponent: {
          id: opponent.id,
          pubkey: opponent.pubkey
        }
      }
    }),
    declineMatch: this.trpc.protectedProcedure
      .input(
        z.object({
          participantId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const participant = await this.matchParticipant.findParticipantById(input.participantId)
        if (participant.user_id !== ctx.user.id) {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }
        await this.matchParticipant.updateInviteState({
          participantId: input.participantId,
          inviteState: 'decline'
        })
      }),
    join: this.trpc.protectedProcedure.input(z.object({
      matchId: z.string(),
    })).mutation(async ({ ctx, input }) => {
      return await this.matchService.deposit({
        matchId: input.matchId,
        userId: ctx.user.id
      })
    }),
    trade: this.trpc.protectedProcedure
      .input(
        z.object({
          matchId: z.string(),
          amount: z.number(),
          direction: z.enum(["long", "short"])
        })
      )
      .mutation(async ({ ctx, input }) => {
        const participant = await this.matchParticipant.findParticipant({ matchId: input.matchId, userId: ctx.user.id })
        if (!participant || !participant.id) {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }
        const participantWallet = await this.matchParticipant.findWalletByParticipantId(participant.id)
        const match = await this.match.findOneById(input.matchId)
        if (match.status !== "active") {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }
        const tx = await this.drift.placeOrder(
          this.wallet.keypairFromPrivateKey(participantWallet.game_wallet_private_key),
          input.direction === "long" ? input.amount : -input.amount
        )
        return tx.signature
      }),
    balance: this.trpc.protectedProcedure
      .input(
        z.object({
          matchId: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        const participant = await this.matchParticipant.findParticipant({ matchId: input.matchId, userId: ctx.user.id })
        if (!participant || !participant.id) {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }
        const participantWallet = await this.matchParticipant.findWalletByParticipantId(participant.id)
        return await this.drift.getUserUSDBalance(
          this.wallet.keypairFromPrivateKey(participantWallet.game_wallet_private_key)
        )
      }),
    position: this.trpc.protectedProcedure
      .input(
        z.object({
          matchId: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        const participant = await this.matchParticipant.findParticipant({ matchId: input.matchId, userId: ctx.user.id })
        if (!participant || !participant.id) {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }
        const participantWallet = await this.matchParticipant.findWalletByParticipantId(participant.id)
        return await this.drift.getUserPosition(
          this.wallet.keypairFromPrivateKey(participantWallet.game_wallet_private_key)
        )
      }),
  });
}
