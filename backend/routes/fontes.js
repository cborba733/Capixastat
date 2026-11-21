// Dados externos (lidos do banco — a fonte só é chamada pela rotina de importação) + B7 (procedência)
//   GET  /api/fontes/status                          → última importação de cada fonte/competição
//   GET  /api/fontes/partidas?competicao=&temporada=  → jogos importados (com fonte e data)
//   GET  /api/fontes/classificacao?competicao=&temporada=
//   POST /api/fontes/atualizar { competicao, temporada } → dispara a importação (técnico, analista, diretor)
const router  = require('express').Router();
const db      = require('../db');
const authMid = require('../middleware/auth');
const { carregarPapel } = require('../middleware/permissao');
const tsdb    = require('../importar/thesportsdb');

let rodando = false;

router.get('/status', async (req, res) => {
  try {
    const r = await db.query(`SELECT fonte, competicao, temporada, status, registros, mensagem, iniciado_em, terminado_em
      FROM importacoes ORDER BY iniciado_em DESC LIMIT 20`);
    res.json({ importacoes: r.rows, rodando });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erro interno do servidor' }); }
});

router.get('/partidas', async (req, res) => {
  const { competicao = 'capixabao', temporada = String(new Date().getFullYear()) } = req.query;
  try {
    const r = await db.query('SELECT * FROM fonte_partidas WHERE competicao=$1 AND temporada=$2 ORDER BY data, rodada', [competicao, temporada]);
    res.json({ partidas: r.rows });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erro interno do servidor' }); }
});

// Classificação calculada a partir dos jogos importados (3 pts vitória, 1 empate; desempate: pts, saldo, gols pró).
// Usada quando a fonte devolve a tabela incompleta (o plano grátis do TheSportsDB corta em 5 times).
function calcularTabela(jogos) {
  const t = {};
  const linha = (nome) => (t[nome] = t[nome] || { time: nome, pj: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, sg: 0, pts: 0, _res: [] });
  jogos.filter((j) => j.gols_mandante != null && j.gols_visitante != null)
    .sort((a, b) => String(a.data).localeCompare(String(b.data)))
    .forEach((j) => {
      const m = linha(j.mandante), v = linha(j.visitante);
      m.pj++; v.pj++; m.gp += j.gols_mandante; m.gc += j.gols_visitante; v.gp += j.gols_visitante; v.gc += j.gols_mandante;
      if (j.gols_mandante > j.gols_visitante) { m.v++; v.d++; m.pts += 3; m._res.push('W'); v._res.push('L'); }
      else if (j.gols_mandante < j.gols_visitante) { v.v++; m.d++; v.pts += 3; m._res.push('L'); v._res.push('W'); }
      else { m.e++; v.e++; m.pts++; v.pts++; m._res.push('D'); v._res.push('D'); }
    });
  return Object.values(t).map((x) => Object.assign(x, { sg: x.gp - x.gc, forma: x._res.slice(-5).join('') }))
    .sort((a, b) => b.pts - a.pts || b.sg - a.sg || b.gp - a.gp || a.time.localeCompare(b.time))
    .map((x, i) => { delete x._res; return Object.assign(x, { posicao: i + 1, fonte: 'thesportsdb', calculada: true }); });
}

router.get('/classificacao', async (req, res) => {
  const { competicao = 'capixabao', temporada = String(new Date().getFullYear()) } = req.query;
  try {
    const r = await db.query('SELECT * FROM fonte_classificacao WHERE competicao=$1 AND temporada=$2 ORDER BY posicao', [competicao, temporada]);
    const jogos = (await db.query('SELECT * FROM fonte_partidas WHERE competicao=$1 AND temporada=$2', [competicao, temporada])).rows;
    const calc = calcularTabela(jogos);
    // usa a tabela da fonte se ela vier completa; senão, a calculada a partir dos jogos (e avisa)
    if (r.rows.length && r.rows.length >= calc.length) return res.json({ classificacao: r.rows, origem: 'fonte' });
    res.json({ classificacao: calc.length ? calc : r.rows, origem: calc.length ? 'calculada' : 'fonte',
      aviso: calc.length ? 'Calculada a partir dos ' + jogos.length + ' jogos importados (a fonte devolveu ' + r.rows.length + ' times).' : undefined });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erro interno do servidor' }); }
});

router.post('/atualizar', authMid, async (req, res) => {
  const papel = await carregarPapel(req).catch(() => 'estudante');
  if (!['tecnico', 'analista', 'diretor'].includes(papel)) return res.status(403).json({ error: 'Só técnico, analista ou diretor atualiza os dados externos.' });
  if (rodando) return res.status(409).json({ error: 'Uma importação já está em andamento.' });
  const { competicao = 'capixabao', temporada = String(new Date().getFullYear()) } = req.body || {};
  if (!tsdb.LIGAS[competicao]) return res.status(400).json({ error: 'Competição sem fonte: ' + competicao });
  rodando = true;
  res.status(202).json({ ok: true, mensagem: 'Importação iniciada — leva cerca de 1 minuto (a fonte limita as chamadas).' });
  try { await tsdb.importar({ competicao, temporada }); } finally { rodando = false; }
});

// Rotina automática: com IMPORT_AUTO=1, importa ao subir o servidor e depois a cada IMPORT_INTERVALO_H horas (padrão 24)
function agendarImportacao() {
  if (process.env.IMPORT_AUTO !== '1') return;
  const comps = (process.env.IMPORT_COMPETICOES || 'capixabao').split(',').map((s) => s.trim()).filter(Boolean);
  const temporada = process.env.IMPORT_TEMPORADA || String(new Date().getFullYear());
  const rodar = async () => {
    if (rodando) return;
    rodando = true;
    try { for (const c of comps) await tsdb.importar({ competicao: c, temporada }); } catch (e) { console.error(e); } finally { rodando = false; }
  };
  setTimeout(rodar, 5000);
  setInterval(rodar, (+process.env.IMPORT_INTERVALO_H || 24) * 3600 * 1000);
  console.log('[importação] automática ligada:', comps.join(', '), temporada);
}

module.exports = router;
module.exports.agendarImportacao = agendarImportacao;
module.exports.calcularTabela = calcularTabela;
