create table
  public.support_tokens (
    id uuid not null default gen_random_uuid (),
    name text not null,
    token_pubkey text not null,
    constraint support_tokens_pkey primary key (id),
    constraint support_tokens_token_pubkey_key unique (token_pubkey)
  ) tablespace pg_default;