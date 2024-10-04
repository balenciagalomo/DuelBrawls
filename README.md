## Quick start

Arena project uses the following technologies:
- Supabase
- Redis
- Nestjs
- Trpc
- Nextjs

### Tools installations

```
brew install supabase/tap/supabase
brew install orbstack
```

### Preparation

```
docker compose up -d redis
pnpm db:start
pnpm db:reset
pnpm db:types
```

supabase migration new create_employees_table

### Running server and web app

```sh
pnpm i
pnpm dev
```

## Database

Guide to help you get started with using Supabase

### New migration

Create a new migration file (run this at repo root).
This will automatically prefix the file with a timestamp,
so the migration files can be ran sequentially

```sh copy
supabase migration new <feature_name>
```