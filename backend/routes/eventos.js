// B3: eventos de jogo marcados no campo (base do scout ao vivo — P2 — e do mapa de finalizações — P3)
//   GET    /api/eventos?partida=chave   (ou ?clube=Nome)
//   POST   /api/eventos                 { id, partida, clube, atletaId, tipo, resultado, minuto, x, y }
//   DELETE /api/eventos/:id
const router  = require('express').Router();
const db      = require('../db');
const authMid = require('../middleware/auth');
const { permitir } = require('../middleware/permissao');

const TIPOS = ['finalizacao', 'passe_chave', 'desarme', 'interceptacao', 'drible', 'falta', 'cartao'];
const RESULTADOS = ['gol', 'no_alvo', 'fora', 'bloqueado', 'certo', 'errado', 'amarelo', 'vermelho', null, undefined, ''];

function validar(b) {
  if (!b || !b.id || String(b.id).length > 40) return 'id inválido';
  if (!b.partida || String(b.partida).length > 200) return 'partida é obrigatória';
  if (!TIPOS.includes(b.tipo)) return 'tipo deve ser um de: ' + TIPOS.join(', ');
  if (!RESULTADOS.includes(b.resultado)) return 'resultado inválido';
  if (!Number.isInteger(+b.minuto) || +b.minuto < 0 || +b.minuto > 130) return 'minuto deve estar entre 0 e 130';
  for (const k of ['x', 'y']) if (!(+b[k] >= 0 && +b[k] <= 100)) return k + ' deve estar entre 0 e 100';
  return null;
}

router.get('/', authMid, async (req, res) => {
  try {
    const { partida, clube } = req.query;
    let q;
    if (partida) q = await db.query('SELECT * FROM eventos_jogo WHERE partida = $1 ORDER BY minuto, criado_em', [partida]);
    else if (clube) q = await db.query('SELECT * FROM eventos_jogo WHERE clube = $1 ORDER BY partida, minuto', [clube]);
    else return res.status(400).json({ error: 'Informe ?partida= ou ?clube=' });
    res.json({ eventos: q.rows });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erro interno do servidor' }); }
});

router.post('/', authMid, permitir('eventos:write'), async (req, res) => {
  const b = req.body;
  const erro = validar(b);
  if (erro) return res.status(400).json({ error: erro });
  try {
    const r = await db.query(
      `INSERT INTO eventos_jogo (id, partida, clube, atleta_id, tipo, resultado, minuto, x, y, criado_por)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [b.id, b.partida, b.clube || null, b.atletaId || null, b.tipo, b.resultado || null, +b.minuto, +b.x, +b.y, req.userId || null]);
    res.status(201).json({ evento: r.rows[0] });
  } catch (e) {
    if (String(e.message).includes('duplicate') || e.code === '23505') return res.status(409).json({ error: 'Evento já existe' });
    console.error(e); res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.delete('/:id', authMid, permitir('eventos:write'), async (req, res) => {
  try {
    const r = await db.query('DELETE FROM eventos_jogo WHERE id = $1 RETURNING id', [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json({ ok: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erro interno do servidor' }); }
});

module.exports = router;
