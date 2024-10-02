import { Injectable } from '@nestjs/common';
import { MatchInviteRepository } from '../database/match-invite.repo';
import { MatchRepository } from '../database/match.repo';
import { MatchInviteState } from '../generated/enum.types';

@Injectable()
export class MatchService {
  constructor(
    private readonly match: MatchRepository,
    private readonly matchInvite: MatchInviteRepository
  ) { }

  public async findActiveMatchByUserId(userId: string) {
    const userInvites = await this.matchInvite.findUserInvites({ userId })
    const activeInviteStates: MatchInviteState[] = ['sent', 'accepted'];
    const activeInvite = userInvites
      .filter(item => activeInviteStates.includes(item.invite_state))
      .at(0)

    if (!activeInvite) return null;

    const match = await this.match.findOneById(activeInvite.match_id);

    return {
      match,
      activeInvite
    }
  }
}
