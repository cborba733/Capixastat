// Importador TheSportsDB (https://www.thesportsdb.com) — API pública, chave gratuita "123" (sem cadastro).
// Busca jogos (rodada a rodada, por causa do limite do plano grátis) e a classificação,
// grava em fonte_partidas / fonte_classificacao e registra a importação em `importacoes` (B7).
//
// Uso manual:   node importar/thesportsdb.js --competicao capixabao --temporada 2026
// Uso pelo servidor: require('./importar/thesportsdb').importar({ competicao, temporada })
//
// Respeita a fonte: identifica o cliente no User-Agent, espera entre as chamadas e para ao
// receber limite (HTTP 429) — nada de contornar bloqueios.
const db = require('../db');

const BASE = 'https://www.thesportsdb.com/api/v1/json/' + (process.env.THESPORTSDB_KEY || '123');
const UA = 'CapixaStat/1.0 (projeto academico FAESA)';
// competições do recorte ES que existem no TheSportsDB
const LIGAS = {
  capixabao: { id: '5686', nome: 'Campeonato Capixaba' },
  serieD: { id: '5079', nome: 'Brasileirão Série D', filtroTimes: /(Rio Branco|Vit[oó]ria|Porto Vit|Serra|Desportiva|Capixaba|Real Noroeste|Forte|Vilavelhense)/i },
};
const FASES_MATA_MATA = [[125, 'quartas'], [150, 'semifinal'], [160, 'terceiro lugar'], [200, 'final']];
const pausa = () => +(process.env.THESPORTSDB_PAUSA_MS || 7000); // lido a cada chamada (testes podem reduzir)
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function buscar(caminho, tentativas = 3) {
  for (let i = 0; i < tentativas; i++) {
    const r = await fetch(BASE + caminho, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
    if (r.status === 429) { await esperar(pausa() * 4 * (i + 1)); continue; } // limite: espera e tenta de novo
    if (!r.ok) throw new Error('HTTP ' + r.status + ' em ' + caminho);
    const txt = await r.text();
    try { return JSON.parse(txt); } catch (e) { await esperar(pausa() * 4 * (i + 1)); } // às vezes devolve página de limite
  }
  throw new Error('Fonte limitou as requisições (tente mais tarde): ' + caminho);
}

function int(v) { const n = parseInt(v, 10); return Number.isFinite(n) ? n : null; }

async function gravarPartida(comp, temporada, e) {
  const vals = ['thesportsdb', String(e.idEvent), comp, temporada, int(e.intRound), e.dateEvent || null, (e.strTimeLocal || e.strTime || '').slice(0, 5) || null,
    e.strHomeTeam, e.strAwayTeam, int(e.intHomeScore), int(e.intAwayScore), e.strVenue || null, e.strStatus || null,
    'https://www.thesportsdb.com/event/' + e.idEvent];
  const upd = await db.query(
    `UPDATE fonte_partidas SET competicao=$3, temporada=$4, rodada=$5, data=$6, hora=$7, mandante=$8, visitante=$9,
       gols_mandante=$10, gols_visitante=$11, estadio=$12, status=$13, fonte_url=$14, atualizado_em=NOW()
     WHERE fonte=$1 AND id_externo=$2 RETURNING id_externo`, vals);
  if (!upd.rows.length)
    await db.query(`INSERT INTO fonte_partidas (fonte, id_externo, competicao, temporada, rodada, data, hora, mandante, visitante,
       gols_mandante, gols_visitante, estadio, status, fonte_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`, vals);
}

async function gravarClassificacao(comp, temporada, linhas) {
  await db.query('DELETE FROM fonte_classificacao WHERE fonte=$1 AND competicao=$2 AND temporada=$3', ['thesportsdb', comp, temporada]);
  for (const t of linhas) {
    await db.query(`INSERT INTO fonte_classificacao (fonte, competicao, temporada, posicao, time, pj, v, e, d, gp, gc, sg, pts, forma, grupo)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      ['thesportsdb', comp, temporada, int(t.intRank), t.strTeam, int(t.intPlayed), int(t.intWin), int(t.intDraw), int(t.intLoss),
        int(t.intGoalsFor), int(t.intGoalsAgainst), int(t.intGoalDifference), int(t.intPoints), (t.strForm || '').slice(0, 10), t.strGroup || null]);
  }
}

async function importar({ competicao = 'capixabao', temporada = String(new Date().getFullYear()), maxRodadas = 30, log = console.log } = {}) {
  const liga = LIGAS[competicao];
  if (!liga) throw new Error('Competição não disponível no TheSportsDB: ' + competicao);
  const reg = await db.query("INSERT INTO importacoes (fonte, competicao, temporada, status) VALUES ('thesportsdb',$1,$2,'rodando') RETURNING id", [competicao, temporada]);
  const impId = reg.rows[0].id;
  let total = 0, vaziasSeguidas = 0, mensagem = '';
  try {
    const rodada = async (r, rotulo) => {
      const j = await buscar(`/eventsround.php?id=${liga.id}&r=${r}&s=${temporada}`);
      let evs = j.events || [];
      if (liga.filtroTimes) evs = evs.filter((e) => liga.filtroTimes.test(e.strHomeTeam + ' ' + e.strAwayTeam));
      for (const e of evs) { await gravarPartida(competicao, temporada, e); total++; }
      log(`[thesportsdb] ${competicao} ${temporada} ${rotulo}: ${evs.length} jogo(s)`);
      await esperar(pausa());
      return (j.events || []).length;
    };
    // fase de pontos corridos/grupos: rodadas 1, 2, 3… até 2 rodadas vazias seguidas
    for (let r = 1; r <= maxRodadas && vaziasSeguidas < 2; r++) {
      if (await rodada(r, 'rodada ' + r)) vaziasSeguidas = 0; else vaziasSeguidas++;
    }
    // mata-mata: o TheSportsDB usa códigos de rodada (125 quartas, 150 semifinal, 160 3º lugar, 200 final)
    for (const [r, nome] of FASES_MATA_MATA) await rodada(r, nome);
    const t = await buscar(`/lookuptable.php?l=${liga.id}&s=${temporada}`);
    if (t.table && t.table.length && !liga.filtroTimes) { await gravarClassificacao(competicao, temporada, t.table); total += t.table.length; }
    mensagem = 'Jogos e classificação importados';
    await db.query("UPDATE importacoes SET status='ok', terminado_em=NOW(), registros=$2, mensagem=$3 WHERE id=$1", [impId, total, mensagem]);
    return { ok: true, registros: total };
  } catch (e) {
    mensagem = String(e.message || e).slice(0, 480);
    await db.query("UPDATE importacoes SET status=$2, terminado_em=NOW(), registros=$3, mensagem=$4 WHERE id=$1", [impId, total ? 'parcial' : 'erro', total, mensagem]);
    log('[thesportsdb] erro: ' + mensagem);
    return { ok: false, registros: total, erro: mensagem };
  }
}

module.exports = { importar, LIGAS };

if (require.main === module) {
  require('dotenv').config();
  const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > -1 ? process.argv[i + 1] : d; };
  importar({ competicao: arg('competicao', 'capixabao'), temporada: arg('temporada', String(new Date().getFullYear())) })
    .then((r) => { console.log(r); process.exit(r.ok ? 0 : 1); });
}
