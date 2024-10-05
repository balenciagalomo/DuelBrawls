alter table if exists public.matches
add column token uuid not null,
add column individual_wage_amount bigint not null,
add column individual_trade_amount bigint not null,
add constraint matches_token_fkey foreign key (token) references support_tokens (id);