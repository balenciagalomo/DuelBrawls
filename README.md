## Radar Submission
The MVP consists of a 1v1 PVP trading competition of the following core features
- Deposit wager
  - Deposit into a custodial trading profile wallet, which acts as the main mediator for game funds
- Trade leverage on [Drift Protocol](https://app.drift.trade/overview).
  - Bonk positions are supported and can be opened/closed
- Match resolution
  - TBC: Workers that listen to the PnL of the players in order to finish the match


### Near future implementations
- Finish MVP
- New game modes
- Making trading non-custodial using a Solana program
- Integrate Lavarage.xyz for memecoin perps
- Integrate Jupiter spot trading

### Tech
- `match-balances-feed-worker`: keeping track of the PnL of the match
- `price-feed-worker`: keeping track of price-feeds for markets
- `server`: backend logic
- `web`: frontend

The Arena uses the following technologies:
- Supabase
- Redis
- Nestjs
- Trpc
- Nextjs

## How to get started

### DB tools installations
```
brew install supabase/tap/supabase
brew install orbstack
```

### DB Preparation

```
docker compose up -d redis
pnpm db:start
pnpm db:reset
pnpm db:types
```

### Running server and web app

```sh
pnpm i
pnpm dev
```

### DB migration

Create a new migration file (run this at repo root).
This will automatically prefix the file with a timestamp,
so the migration files can be ran sequentially

```sh copy
supabase migration new <feature_name>
```
