require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const db      = require('./db');

const app = express();

// CORS: em produção, defina CORS_ORIGIN (ex.: "https://cborba733.github.io") para aceitar só o site.
// Sem a variável, aceita qualquer origem (útil em desenvolvimento e para abrir o HTML direto do disco).
const origens = (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors(origens.length ? { origin: origens } : {}));
// B1: limite maior para aceitar fotos (base64) e telestrações salvas
app.use(express.json({ limit: '6mb' }));

// Rotas
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/players', require('./routes/players'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/registros', require('./routes/registros')); // B4
app.use('/api/dados',     require('./routes/dados'));     // B1

// Rota de teste — confirma que o servidor está online
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, message: 'CapixaStat backend online' });
});

// B1: saúde do serviço (usada pelo Render e pela tela para saber se o banco responde)
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ ok: true, banco: db.isMemory ? 'memoria' : 'postgres', hora: new Date().toISOString() });
  } catch (e) {
    res.status(503).json({ ok: false, error: 'Banco indisponível' });
  }
});

// Erro de JSON inválido ou corpo grande demais → resposta clara em vez de HTML
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') return res.status(413).json({ error: 'Conteúdo grande demais (máx. 6 MB)' });
  if (err && err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido' });
  next(err);
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
