import { Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';
import { ConfigService } from '@nestjs/config';
import bs58 from 'bs58';

import { MatchParticipantRepository } from '../database/match-participant.repo';
import { MatchRepository } from '../database/match.repo';
import { ACTIVE_MATCH_INVITE_STATE, Match } from '../generated/enum.types';
import { WalletService } from '../wallet/wallet.service';
import { UserRepository } from '../database/user.repo';
import { SupportTokenRepository } from '../database/support-token.repo';
import { MatchParticipant, User } from '../generated/tables.types';
import { SecretMissingError } from '../config/error';
import { BalanceService } from '../wallet/balance.service';
import { DriftTradingService } from 'src/trading/drift.service';

@Injectable()
export class MatchService {
  constructor(
    private readonly config: ConfigService,
    private readonly user: UserRepository,
    private readonly match: MatchRepository,
    private readonly matchParticipant: MatchParticipantRepository,
    private readonly wallet: WalletService,
    private readonly balance: BalanceService,
    private readonly supportToken: SupportTokenRepository,
    private readonly drift: DriftTradingService
  ) { }

  public async findActiveMatchByUserId(userId: string) {
    const participants = await this.matchParticipant.findByUserId({ userId })
    const activeInvite = participants
      .find(item => {
        if (!item.invite_state) throw new Error('Participants invite state can not be null')
        return ACTIVE_MATCH_INVITE_STATE.includes(item.invite_state)
      })

    if (!activeInvite) return null;

    if (!activeInvite.match_id) throw new Error('Active invite match id can not be null')
    const match = await this.match.findOneById(activeInvite.match_id);

    return {
      match,
      activeInvite
    }
  }

  public async deposit(inputs: {
    matchId: string;
    userId: string;
  }) {
    const match = await this.match.findOneById(inputs.matchId);
    const participant = await this.getParticipantWithWallet({
      matchId: inputs.matchId,
      userId: inputs.userId
    })

    const user = await this.user.findById(participant.user_id)
    const depositResult = await this.executeMatchDeposit({
      match,
      participant,
      user
    })

    await this.matchParticipant.updateInviteState({
      inviteState: 'accepted',
      participantId: participant.id
    });

    await this.startMatchIfReady({ matchId: match.id });

    return depositResult
  }

  private async getParticipantWithWallet(inputs: {
    matchId: string;
    userId: string
  }) {
    const participant = await this.matchParticipant.findParticipant({
      matchId: inputs.matchId,
      userId: inputs.userId
    });

    if (!participant || !participant.user_id || !participant.id) {
      throw new Error(`Participant not found for a given userId::${inputs.userId} and matchId::${inputs.matchId}`)
    }

    const participantWithWallet = await this.matchParticipant.findWalletByParticipantId(participant.id)
    return participantWithWallet
  }

  private async executeMatchDeposit(inputs: {
    match: Match,
    user: User;
    participant: MatchParticipant
  }) {
    const userSigner = this.wallet.getUserKeypair(inputs.user)
    const participantSigner = this.wallet.getMatchParticipantKeypair(inputs.participant)
    const token = await this.supportToken.findOneById(inputs.match.token)
    const depositAmount = inputs.match.individual_wage_amount + inputs.match.individual_trade_amount

    const privateKeyString = this.config.get<string>('game.usdcTreasury')
    if (!privateKeyString) throw new SecretMissingError('game.usdcTreasury')

    const keypair = Keypair.fromSecretKey(bs58.decode(privateKeyString))

    const splTransfer = await this.balance.splTransferIxs({
      from: userSigner.publicKey,
      to: participantSigner.publicKey,
      mint: new PublicKey(token.token_pubkey),
      payer: keypair.publicKey,
      uiAmount: depositAmount
    })
    const solTransfer = await this.balance.solTransferIxs({
      from: userSigner.publicKey,
      to: participantSigner.publicKey,
      uiAmount: 0.05
    })
    const tx = await this.balance.txFromIxs({
      instructions: [...solTransfer, ...splTransfer],
      payer: keypair.publicKey
    })

    const { signature, status } = await this.wallet.execute({ tx, signers: [userSigner, keypair] })

    if (status.err) {
      throw new Error(status.err.toString())
    }

    await this.drift.initializeUser(participantSigner, inputs.match.individual_trade_amount)

    return {
      signature
    }
  }

  private async startMatchIfReady(inputs: {
    matchId: string
  }) {
    const participants = await this.matchParticipant.findParticipantsByMatch(inputs.matchId)
    const allAccepted = participants.filter(item => item.invite_state === 'accepted').length === participants.length
    if (allAccepted) {
      await this.match.updateMatchState({
        matchId: inputs.matchId,
        matchState: 'active'
      })
    }
  }
}
