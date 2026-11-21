// Conexão com o banco.
// - Produção: PostgreSQL (Supabase) via DATABASE_URL — exige SSL.
// - Testes/desenvolvimento sem banco: DB_MEMORY=1 usa o pg-mem (PostgreSQL em memória)
//   e cria as tabelas a partir de schema.sql. Os dados somem quando o servidor para.
const fs = require('fs');
const path = require('path');

let pool;

if (process.env.DB_MEMORY === '1') {
  const { newDb } = require('pg-mem');
  const mem = newDb({ autoCreateForeignKeyIndices: true });
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  mem.public.none(schema);
  const { Pool } = mem.adapters.createPg();
  pool = new Pool();
  pool.isMemory = true;
} else {
  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
}

module.exports = pool;
