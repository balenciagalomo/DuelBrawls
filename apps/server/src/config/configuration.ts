export default () => ({
  port: parseInt((process.env.PORT || 3000).toString()),
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    ttl: process.env.JWT_TTL || 24 * 60 * 60 // 24 hours
  }
});