create table
  public.match_balance_feed (
    id uuid not null default gen_random_uuid (),
    participant_id uuid not null,
    balance bigint not null,
    timestamp timestamp not null default now(),
    constraint match_balance_feed_id_pkey primary key (id),
    constraint match_balance_feed_participant_id_fkey foreign key (participant_id) references match_participants (id)
  ) tablespace pg_default;