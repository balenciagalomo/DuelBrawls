create table
  public.match_invites (
    id uuid not null default gen_random_uuid (),
    user_id uuid not null,
    match_id uuid not null,
    invite_state public.match_invite_state not null,
    created_at timestamp with time zone not null default now(),
    constraint match_invites_pkey primary key (id),
    constraint match_invites_user_id_fkey foreign key (user_id) references users (id) on update cascade,
    constraint match_invites_match_id_fkey foreign key (match_id) references matches (id)
  ) tablespace pg_default;