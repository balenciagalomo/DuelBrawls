create table
  public.users (
    id uuid not null default gen_random_uuid (),
    pubkey text not null,
    wallet_private_key text not null,
    created_at timestamp with time zone not null default now(),
    constraint users_pkey primary key (id),
    constraint users_pubkey_key unique (pubkey),
    constraint users_wallet_private_key unique (wallet_private_key)
  ) tablespace pg_default;