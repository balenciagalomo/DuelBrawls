create table
  public.price_feed (
    id uuid not null default gen_random_uuid (),
    symbol varchar not null,
    price bigint not null,
    timestamp timestamp not null default now(),
    constraint id_pkey primary key (id)
  ) tablespace pg_default;