export enum AppEvents {
  MatchQueueUserAdded = 'match_queue::user_added',
  MatchQueueInviteSent = 'match_queue::invite_sent'
}

export type AppEventsMap = {
  [AppEvents.MatchQueueUserAdded]: {
    pubkey: string;
  },
  [AppEvents.MatchQueueInviteSent]: {
    invites: Array<{
      id: string;
      pubkey: string
    }>;
  }
}