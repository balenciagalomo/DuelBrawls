create table
  public.matches (
    id uuid not null default gen_random_uuid (),
    game_type public.game_type not null,
    created_at timestamp with time zone not null default now(),
    constraint matches_pkey primary key (id)
  ) tablespace pg_default;