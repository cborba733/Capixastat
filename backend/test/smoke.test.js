// Testes de fumaça da API (rodam com banco em memória: npm test)
// Sobe o servidor numa porta livre, cadastra um usuário, faz login e exercita as rotas.
process.env.DB_MEMORY = '1';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'segredo-de-teste';
process.env.PORT = '0';
const test = require('node:test');
const assert = require('node:assert');

let base, token, server;

test.before(async () => {
  const app = require('../server');
  server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  base = 'http://127.0.0.1:' + server.address().port;
});
test.after(() => server && server.close());

const req = (m, url, body, tok) => fetch(base + url, {
  method: m, headers: Object.assign({ 'Content-Type': 'application/json' }, tok ? { Authorization: 'Bearer ' + tok } : {}),
  body: body ? JSON.stringify(body) : undefined,
}).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));

test('ping', async () => {
  const r = await req('GET', '/api/ping');
  assert.equal(r.status, 200);
  assert.equal(r.body.ok, true);
});

test('cadastro e login', async () => {
  const c = await req('POST', '/api/auth/register', { nome: 'Teste', email: 't@t.com', senha: 'senha123', clube: 'Rio Branco ES', funcao: 'Preparador Físico' });
  assert.ok([200, 201].includes(c.status), JSON.stringify(c.body));
  const l = await req('POST', '/api/auth/login', { email: 't@t.com', senha: 'senha123' });
  assert.equal(l.status, 200, JSON.stringify(l.body));
  token = l.body.token;
  assert.ok(token);
});

test('B4: sRPE exige login e valida campos', async () => {
  assert.equal((await req('GET', '/api/registros/srpe')).status, 401);
  const ruim = await req('POST', '/api/registros/srpe', { id: 'x1', atletaId: 'rb_edu', data: '2026-11-20', minutos: 90, rpe: 15 }, token);
  assert.equal(ruim.status, 400);
  const ok = await req('POST', '/api/registros/srpe', { id: 'x1', atletaId: 'rb_edu', clube: 'Rio Branco ES', data: '2026-11-20', tipo: 'Treino', minutos: 90, rpe: 7 }, token);
  assert.equal(ok.status, 201, JSON.stringify(ok.body));
  assert.equal(ok.body.registro.carga, 630);
  const lista = await req('GET', '/api/registros/srpe?clube=Rio%20Branco%20ES', null, token);
  assert.equal(lista.body.registros.length, 1);
  assert.equal((await req('DELETE', '/api/registros/srpe/x1', null, token)).status, 200);
});

test('B4: bem-estar calcula o índice de Hooper', async () => {
  const r = await req('POST', '/api/registros/bemestar', { id: 'w1', atletaId: 'rb_edu', data: '2026-11-20', sono: 2, fadiga: 5, estresse: 3, dor: 6, lesao: false }, token);
  assert.equal(r.status, 201, JSON.stringify(r.body));
  assert.equal(r.body.registro.hooper, 16);
  assert.equal((await req('GET', '/api/registros/xyz', null, token)).status, 404);
});
