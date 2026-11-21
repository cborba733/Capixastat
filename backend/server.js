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
app.use('/api/eventos',   require('./routes/eventos'));   // B3
app.use('/api/fontes',    require('./routes/fontes'));    // dados externos + B7

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

// B6: documentação da API (OpenAPI 3) — JSON em /api/openapi.json e tela Swagger em /api/docs
app.get('/api/openapi.json', (req, res) => res.sendFile(require('path').join(__dirname, 'docs', 'openapi.json')));
app.get('/api/docs', (req, res) => res.type('html').send(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>CapixaStat API</title>
<meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css"></head>
<body><div id="ui"></div><script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.min.js"></script>
<script>SwaggerUIBundle({ url: '/api/openapi.json', dom_id: '#ui' });</script></body></html>`));

// Rota inexistente → JSON (não HTML)
app.use('/api', (req, res) => res.status(404).json({ error: 'Rota não encontrada: ' + req.method + ' ' + req.originalUrl }));

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
    require('./routes/fontes').agendarImportacao(); // IMPORT_AUTO=1 liga a rotina diária
  });
}

module.exports = app;
