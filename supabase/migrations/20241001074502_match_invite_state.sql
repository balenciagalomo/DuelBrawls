create type match_invite_state as enum (
  'sent',
  'expire',
  'accepted',
  'decline'
);