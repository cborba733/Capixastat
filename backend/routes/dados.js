// B1: documentos do usuário — persistência no banco do que antes ficava só no navegador
//   GET    /api/dados            → lista { chave, atualizado_em } (sem o conteúdo)
//   GET    /api/dados/:chave     → conteúdo de um documento
//   PUT    /api/dados/:chave     → cria/atualiza { dados }
//   DELETE /api/dados/:chave     → remove
// Só chaves conhecidas são aceitas (evita guardar lixo). Limite de tamanho no express.json do server.js.
const router  = require('express').Router();
const db      = require('../db');
const authMid = require('../middleware/auth');

const CHAVES = ['taticas', 'taticas_presets', 'telestracao', 'fotos', 'filtros', 'lances', 'observacao', 'anotacoes', 'relatorios', 'microciclos', 'medidas'];
const valida = (req, res) => {
  if (!CHAVES.includes(req.params.chave)) { res.status(404).json({ error: 'Chave desconhecida. Use: ' + CHAVES.join(', ') }); return false; }
  return true;
};

router.get('/', authMid, async (req, res) => {
  try {
    const r = await db.query('SELECT chave, atualizado_em FROM documentos WHERE usuario_id = $1', [req.userId]);
    res.json({ documentos: r.rows });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erro interno do servidor' }); }
});

router.get('/:chave', authMid, async (req, res) => {
  if (!valida(req, res)) return;
  try {
    const r = await db.query('SELECT dados, atualizado_em FROM documentos WHERE usuario_id = $1 AND chave = $2', [req.userId, req.params.chave]);
    if (!r.rows.length) return res.status(404).json({ error: 'Documento não encontrado' });
    res.json(r.rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erro interno do servidor' }); }
});

router.put('/:chave', authMid, async (req, res) => {
  if (!valida(req, res)) return;
  if (!req.body || !('dados' in req.body)) return res.status(400).json({ error: 'Envie { dados }' });
  try {
    const json = JSON.stringify(req.body.dados);
    const upd = await db.query('UPDATE documentos SET dados = $3, atualizado_em = NOW() WHERE usuario_id = $1 AND chave = $2 RETURNING atualizado_em',
      [req.userId, req.params.chave, json]);
    if (upd.rows.length) return res.json({ ok: true, atualizado_em: upd.rows[0].atualizado_em });
    const ins = await db.query('INSERT INTO documentos (usuario_id, chave, dados) VALUES ($1,$2,$3) RETURNING atualizado_em',
      [req.userId, req.params.chave, json]);
    res.status(201).json({ ok: true, atualizado_em: ins.rows[0].atualizado_em });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erro interno do servidor' }); }
});

router.delete('/:chave', authMid, async (req, res) => {
  if (!valida(req, res)) return;
  try {
    await db.query('DELETE FROM documentos WHERE usuario_id = $1 AND chave = $2', [req.userId, req.params.chave]);
    res.json({ ok: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erro interno do servidor' }); }
});

module.exports = router;
