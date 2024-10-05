create type match_status_state as enum (
  'pending',
  'active',
  'finished',
  'resolved'
);

alter table if exists public.matches
add column "status" public.match_status_state not null default 'pending';