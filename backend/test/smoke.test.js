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

test('B1: health e documentos do usuário', async () => {
  const h = await req('GET', '/api/health');
  assert.equal(h.status, 200);
  assert.equal(h.body.banco, 'memoria');
  assert.equal((await req('PUT', '/api/dados/taticas', { dados: { a: 1 } })).status, 401);
  assert.equal((await req('PUT', '/api/dados/xyz', { dados: 1 }, token)).status, 404);
  const c = await req('PUT', '/api/dados/taticas', { dados: { formacao: '4-3-3' } }, token);
  assert.equal(c.status, 201, JSON.stringify(c.body));
  const u = await req('PUT', '/api/dados/taticas', { dados: { formacao: '4-4-2' } }, token);
  assert.equal(u.status, 200);
  const g = await req('GET', '/api/dados/taticas', null, token);
  assert.equal(g.body.dados.formacao, '4-4-2');
  const l = await req('GET', '/api/dados', null, token);
  assert.equal(l.body.documentos.length, 1);
});

test('B2: perfis de acesso (diretor, atleta)', async () => {
  // função inválida é recusada
  assert.equal((await req('POST', '/api/auth/register', { nome: 'X', email: 'x@t.com', senha: 'senha123', clube: 'Rio Branco ES', funcao: 'Rei' })).status, 400);
  // diretor: lê, mas não registra carga
  await req('POST', '/api/auth/register', { nome: 'Dir', email: 'dir@t.com', senha: 'senha123', clube: 'Rio Branco ES', funcao: 'Diretor' });
  const d = await req('POST', '/api/auth/login', { email: 'dir@t.com', senha: 'senha123' });
  assert.equal(d.body.user.papel, 'diretor');
  assert.equal((await req('GET', '/api/registros/srpe', null, d.body.token)).status, 200);
  assert.equal((await req('POST', '/api/registros/srpe', { id: 'd1', atletaId: 'rb_edu', data: '2026-11-20', minutos: 60, rpe: 5 }, d.body.token)).status, 403);
  // atleta: precisa do vínculo e só registra o próprio bem-estar
  assert.equal((await req('POST', '/api/auth/register', { nome: 'Edu', email: 'edu@t.com', senha: 'senha123', clube: 'Rio Branco ES', funcao: 'Atleta' })).status, 400);
  await req('POST', '/api/auth/register', { nome: 'Edu', email: 'edu@t.com', senha: 'senha123', clube: 'Rio Branco ES', funcao: 'Atleta', atleta_id: 'rb_edu' });
  const a = await req('POST', '/api/auth/login', { email: 'edu@t.com', senha: 'senha123' });
  assert.equal(a.body.user.atleta_id, 'rb_edu');
  const wb = { data: '2026-11-20', sono: 2, fadiga: 2, estresse: 2, dor: 2 };
  assert.equal((await req('POST', '/api/registros/bemestar', Object.assign({ id: 'a1', atletaId: 'rb_edu' }, wb), a.body.token)).status, 201);
  assert.equal((await req('POST', '/api/registros/bemestar', Object.assign({ id: 'a2', atletaId: 'rb_outro' }, wb), a.body.token)).status, 403);
  assert.equal((await req('POST', '/api/registros/srpe', { id: 'a3', atletaId: 'rb_edu', data: '2026-11-20', minutos: 60, rpe: 5 }, a.body.token)).status, 403);
});

test('B3: eventos de jogo', async () => {
  const ev = { id: 'e1', partida: 'serieD|Rio Branco ES|Uberlândia EC|27/06', clube: 'Rio Branco ES', atletaId: 'rb_edu', tipo: 'finalizacao', resultado: 'no_alvo', minuto: 33, x: 88, y: 45 };
  // o usuário de teste é Preparador Físico → não marca eventos (permissão vem antes da validação)
  assert.equal((await req('POST', '/api/eventos', ev, token)).status, 403);
  await req('POST', '/api/auth/register', { nome: 'An', email: 'an@t.com', senha: 'senha123', clube: 'Rio Branco ES', funcao: 'Analista de Desempenho' });
  const an = (await req('POST', '/api/auth/login', { email: 'an@t.com', senha: 'senha123' })).body.token;
  assert.equal((await req('POST', '/api/eventos', Object.assign({}, ev, { x: 140 }), an)).status, 400);
  assert.equal((await req('POST', '/api/eventos', Object.assign({}, ev, { tipo: 'voleio' }), an)).status, 400);
  assert.equal((await req('POST', '/api/eventos', ev, an)).status, 201);
  const l = await req('GET', '/api/eventos?partida=' + encodeURIComponent(ev.partida), null, an);
  assert.equal(l.body.eventos.length, 1);
  assert.equal(l.body.eventos[0].x, 88);
  assert.equal((await req('DELETE', '/api/eventos/e1', null, an)).status, 200);
});
