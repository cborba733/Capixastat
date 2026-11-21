// B4: registros diários da comissão técnica (carga sRPE e bem-estar)
//   GET    /api/registros/:tipo?clube=Nome   → lista (mais recentes primeiro)
//   POST   /api/registros/:tipo              → cria (valida os campos)
//   DELETE /api/registros/:tipo/:id          → remove
// :tipo = "srpe" | "bemestar". Todas as rotas exigem login (JWT).
const router  = require('express').Router();
const db      = require('../db');
const authMid = require('../middleware/auth');
const { permitir } = require('../middleware/permissao'); // B2

const TABELAS = { srpe: 'registros_srpe', bemestar: 'registros_bemestar' };
const DATA_RE = /^\d{4}-\d{2}-\d{2}$/;
const int = (v) => Number.isInteger(+v) ? +v : NaN;
const entre = (v, a, b) => Number.isInteger(v) && v >= a && v <= b;

function validar(tipo, b) {
  if (!b || typeof b !== 'object') return 'Corpo da requisição vazio';
  if (!b.id || String(b.id).length > 40) return 'id inválido';
  if (!b.atletaId) return 'atletaId é obrigatório';
  if (!DATA_RE.test(b.data || '')) return 'data deve estar no formato AAAA-MM-DD';
  if (tipo === 'srpe') {
    if (!entre(int(b.minutos), 1, 300)) return 'minutos deve ser um inteiro entre 1 e 300';
    if (!entre(int(b.rpe), 0, 10)) return 'rpe deve ser um inteiro entre 0 e 10';
  } else {
    for (const k of ['sono', 'fadiga', 'estresse', 'dor'])
      if (!entre(int(b[k]), 1, 7)) return k + ' deve ser um inteiro entre 1 e 7';
  }
  return null;
}

function tabela(req, res) {
  const t = TABELAS[req.params.tipo];
  if (!t) res.status(404).json({ error: 'Tipo de registro desconhecido. Use srpe ou bemestar.' });
  return t;
}

router.get('/:tipo', authMid, async (req, res) => {
  const t = tabela(req, res); if (!t) return;
  try {
    const { clube } = req.query;
    const q = clube
      ? await db.query(`SELECT * FROM ${t} WHERE clube = $1 ORDER BY data DESC, criado_em DESC`, [clube])
      : await db.query(`SELECT * FROM ${t} ORDER BY data DESC, criado_em DESC`);
    res.json({ registros: q.rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

const tipoValido = (req, res, next) => (TABELAS[req.params.tipo] ? next() : res.status(404).json({ error: 'Tipo de registro desconhecido. Use srpe ou bemestar.' }));

router.post('/:tipo', authMid, tipoValido, permitir((req) => 'registros:' + req.params.tipo), async (req, res) => {
  const t = tabela(req, res); if (!t) return;
  const b = req.body;
  const erro = validar(req.params.tipo, b);
  if (erro) return res.status(400).json({ error: erro });
  // B2/F5: atleta só registra os próprios dados (bem-estar e esforço do treino)
  if (req.papel === 'atleta' && b.atletaId !== req.atletaId)
    return res.status(403).json({ error: 'Atleta só pode registrar os próprios dados.' });
  try {
    let r;
    if (req.params.tipo === 'srpe') {
      const minutos = int(b.minutos), rpe = int(b.rpe);
      r = await db.query(
        `INSERT INTO registros_srpe (id, atleta_id, clube, data, tipo, minutos, rpe, carga, criado_por)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [b.id, b.atletaId, b.clube || null, b.data, b.tipo || null, minutos, rpe, minutos * rpe, req.userId || null]);
    } else {
      const v = ['sono', 'fadiga', 'estresse', 'dor'].map((k) => int(b[k]));
      r = await db.query(
        `INSERT INTO registros_bemestar (id, atleta_id, clube, data, sono, fadiga, estresse, dor, lesao, hooper, criado_por)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
        [b.id, b.atletaId, b.clube || null, b.data, ...v, !!b.lesao, v.reduce((a, x) => a + x, 0), req.userId || null]);
    }
    res.status(201).json({ registro: r.rows[0] });
  } catch (e) {
    if (String(e.message).includes('duplicate') || e.code === '23505')
      return res.status(409).json({ error: 'Registro com este id já existe' });
    console.error(e);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.delete('/:tipo/:id', authMid, tipoValido, permitir((req) => 'registros:' + req.params.tipo), async (req, res) => {
  const t = tabela(req, res); if (!t) return;
  try {
    const r = await db.query(`DELETE FROM ${t} WHERE id = $1 RETURNING id`, [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Registro não encontrado' });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
