create table
  public.users (
    id uuid not null default gen_random_uuid (),
    pubkey text null,
    created_at timestamp with time zone not null default now(),
    constraint users_pkey primary key (id),
    constraint users_pubkey_key unique (pubkey)
  ) tablespace pg_default;