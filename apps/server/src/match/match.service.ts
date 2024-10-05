import { Injectable } from '@nestjs/common';
import { MatchParticipantRepository } from '../database/match-participant.repo';
import { MatchRepository } from '../database/match.repo';
import { MatchInviteState } from '../generated/enum.types';

@Injectable()
export class MatchService {
  constructor(
    private readonly match: MatchRepository,
    private readonly matchParticipant: MatchParticipantRepository
  ) { }

  public async findActiveMatchByUserId(userId: string) {
    const participants = await this.matchParticipant.findByUserId({ userId })
    const activeInviteStates: MatchInviteState[] = ['sent', 'accepted'];
    const activeInvite = participants
      .filter(item => {
        if (!item.invite_state) throw new Error('Participants invite state can not be null')
        return activeInviteStates.includes(item.invite_state)
      })
      .at(0)

    if (!activeInvite) return null;

    if (!activeInvite.match_id) throw new Error('Active invite match id can not be null')
    const match = await this.match.findOneById(activeInvite.match_id);

    return {
      match,
      activeInvite
    }
  }
}
