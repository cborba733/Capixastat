require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const db      = require('./db');

const app = express();

// Permite requisições do frontend (qualquer origem em dev; ajuste em produção)
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/players', require('./routes/players'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/registros', require('./routes/registros')); // B4

// Rota de teste — confirma que o servidor está online
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, message: 'CapixaStat backend online' });
});

// Inicializa o servidor só quando executado diretamente (node server.js).
// Quando importado pelos testes (require('./server')), apenas exporta o app.
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta ${PORT}` + (db.isMemory ? ' (banco em memória — DB_MEMORY=1)' : ''));
    try {
      await db.query('SELECT 1');
      console.log('Banco de dados conectado com sucesso');
    } catch (e) {
      console.error('Erro ao conectar no banco:', e.message);
    }
  });
}

module.exports = app;
