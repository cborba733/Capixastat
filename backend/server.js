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

// Rota de teste — confirma que o servidor está online
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, message: 'CapixaStat backend online' });
});

// Inicializa o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  try {
    await db.query('SELECT 1');
    console.log('Banco de dados conectado com sucesso');
  } catch (e) {
    console.error('Erro ao conectar no banco:', e.message);
  }
});
