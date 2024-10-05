ALTER TABLE IF EXISTS public.users 
ADD COLUMN wallet_private_key TEXT NOT NULL,
ADD CONSTRAINT unique_wallet_private_key UNIQUE (wallet_private_key);