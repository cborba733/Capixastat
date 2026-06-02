const { Pool } = require('pg');

// Supabase exige SSL em produção
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
