create table
  public.match_participants (
    id uuid not null default gen_random_uuid (),
    user_id uuid not null,
    match_id uuid not null,
    invite_state public.match_invite_state not null,
    game_wallet_private_key text not null,
    constraint match_participants_id_pkey primary key (id),
    constraint match_participants_user_id_fkey foreign key (user_id) references users (id) on update cascade,
    constraint match_participants_match_id_fkey foreign key (match_id) references matches (id),
    constraint match_participants_game_wallet_private_key unique (game_wallet_private_key)
  ) tablespace pg_default;

alter publication supabase_realtime add table public.match_participants;