create type match_invite_state as enum (
  'pending',
  'expire',
  'accepted',
  'decline'
);