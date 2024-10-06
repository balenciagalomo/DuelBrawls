export default () => ({
  port: parseInt((process.env.PORT || 3000).toString()),
  jwt: {
    secret: process.env.JWT_SECRET,
    ttl: process.env.JWT_TTL || 24 * 60 * 60 // 24 hours
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  },
  solana: {
    rpc: process.env.SOLANA_RPC_URL
  },
  game: {
    defaultTokenName: process.env.GAME_CONFIG_DEFAULT_TOKEN_NAME || 'USDC',
    defaultWageAmount: process.env.GAME_CONFIG_DEFAULT_WAGE_AMOUNT ? Number(process.env.GAME_CONFIG_DEFAULT_WAGE_AMOUNT) : 50,
    defaultTradeAmount: process.env.GAME_CONFIG_DEFAULT_TRADE_AMOUNT ? Number(process.env.GAME_CONFIG_DEFAULT_TRADE_AMOUNT) : 150,
    // Devnet only
    usdcTreasury: process.env.GAME_CONFIG_USDC_TREASURY_PRIVATE_KEY || 'PRIVATE_KEY',
    usdcTreasuryMint: process.env.GAME_CONFIG_USDC_TREASURY_MINT || 'MINT'
  }
});