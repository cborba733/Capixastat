/**
 * Fetch FlashScore match statistics via sportdb.dev API
 * and merge into ss_matches_processed.json
 */
const fs   = require('fs');
const path = require('path');
const https = require('https');

const BASE = 'C:/Users/cborb/.gemini/antigravity/scratch/capixaba-hub';
const KEY  = 'ljwKSVlA7g0MWXi1uVhAJibZglu0kBPzL7BiQYUf';
const DELAY_MS = 400;

// ── HTTP helper ───────────────────────────────────────────────────────────────
function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'X-API-Key': KEY } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error('JSON parse error: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Team name aliases (applied AFTER full normalisation) ─────────────────────
// Keys are already-normalised forms; values are the FS normalised equivalent
const ALIASES = {
  'capixaba':           'sport es',          // Capixaba SC = Sport-ES (Copa ES)
  'audax sm':           'audax sao mateus',  // Audax SM = Audax Sao Mateus
  'atletico goianiense':'atletico go',        // Atlético Goianiense = Atletico GO
  'porto':              'porto ba',           // Porto SC → strips SC → "porto" = Porto-BA
};

// ── Name normalisation: strip accents, lowercase, remove common suffixes ──────
function norm(name) {
  const n = name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[-]/g, ' ')                              // hyphens → spaces
    .replace(/\b(fc|sc|ec|ac|cf|se|aa|at)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  return ALIASES[n] ?? n;
}

// ── Parse FlashScore stats into our compact format ────────────────────────────
function parseFsStats(fsStats) {
  if (!fsStats || !Array.isArray(fsStats) || !fsStats.length) return null;

  const period = fsStats.find(p => p && p.period === 'Match') || fsStats.find(p => p && p.stats?.length);
  if (!period || !period.stats?.length) return null;

  const get = (name) => period.stats.find(s => s.statName === name);
  const poss    = get('Ball possession');
  const shots   = get('Total shots');
  const onTgt   = get('Shots on target');
  const offTgt  = get('Shots off target');
  const corners = get('Corner kicks');
  const yellows = get('Yellow cards');
  const reds    = get('Red cards');
  const fouls   = get('Fouls');
  const offside = get('Offsides');

  if (!poss && !corners && !shots) return null;

  const num = (v) => v ? parseInt(String(v).replace('%', '')) || 0 : 0;
  const result = { _source: 'flashscore' };

  if (poss) result.posse = {
    h: num(poss.homeValue), a: num(poss.awayValue),
    hs: poss.homeValue, as: poss.awayValue
  };
  if (corners) result.escanteios   = { h: num(corners.homeValue), a: num(corners.awayValue) };
  if (fouls)   result.faltas       = { h: num(fouls.homeValue),   a: num(fouls.awayValue) };
  if (yellows) result.amarelos     = { h: num(yellows.homeValue), a: num(yellows.awayValue) };
  if (reds)    result.vermelhos    = { h: num(reds.homeValue),    a: num(reds.awayValue) };
  if (offside) result.impedimentos = { h: num(offside.homeValue), a: num(offside.awayValue) };
  if (onTgt)   result.chutesAlvo  = { h: num(onTgt.homeValue),   a: num(onTgt.awayValue) };

  if (shots) {
    result.finalizacoes = { h: num(shots.homeValue), a: num(shots.awayValue) };
  } else if (onTgt || offTgt) {
    result.finalizacoes = {
      h: num(onTgt?.homeValue) + num(offTgt?.homeValue),
      a: num(onTgt?.awayValue) + num(offTgt?.awayValue),
    };
  }

  return result;
}

// ── Build FlashScore match index from saved results file ──────────────────────
function buildFsIndex(file) {
  if (!fs.existsSync(file)) return [];
  const d = JSON.parse(fs.readFileSync(file, 'utf8'));
  const arr = Array.isArray(d) ? d : Object.values(d);
  return arr.filter(e => e.eventId && e.homeName && e.awayName).map(e => ({
    fsId:     e.eventId,
    homeNorm: norm(e.homeName),
    awayNorm: norm(e.awayName),
    gh:       parseInt(e.homeScore) || 0,
    ga:       parseInt(e.awayScore) || 0,
  }));
}

async function main() {
  const processed = JSON.parse(fs.readFileSync(path.join(BASE, 'ss_matches_processed.json'), 'utf8'));

  const fsIndices = {
    'capixabao':  buildFsIndex(path.join(BASE, 'fs_cap_results.json')),
    'copa-es':    buildFsIndex(path.join(BASE, 'fs_ces_results.json')),
    // Copa Verde 2026 was split into Copa Norte + Copa Centro-Oeste in FlashScore
    'copa-verde': buildFsIndex(path.join(BASE, 'fs_cco_results.json')),
    // Serie D supplementary (fallback for matches SofaScore missed)
    'serie-d':    buildFsIndex(path.join(BASE, 'fs_sd_all.json')),
  };

  console.log('FS index sizes:', Object.fromEntries(Object.entries(fsIndices).map(([k,v])=>[k,v.length])));

  let fetched = 0, matched = 0, noStats = 0, noMatch = 0;

  for (const [compKey, compData] of Object.entries(processed)) {
    const fsIdx = fsIndices[compKey];
    if (!fsIdx || !fsIdx.length) continue;

    for (const jogo of compData.jogos) {
      if (jogo.gh === undefined) continue;
      if (jogo.stats) continue;

      const homeN = norm(jogo.home);
      const awayN = norm(jogo.away);

      const fsEv = fsIdx.find(e =>
        e.homeNorm === homeN &&
        e.awayNorm === awayN &&
        e.gh === jogo.gh &&
        e.ga === jogo.ga
      );

      if (!fsEv) {
        console.log(`  [no match] ${compKey}: ${jogo.home} vs ${jogo.away} ${jogo.gh}-${jogo.ga}`);
        noMatch++;
        continue;
      }

      try {
        const statsData = await get(`https://api.sportdb.dev/api/flashscore/match/${fsEv.fsId}/stats`);
        const stats = parseFsStats(statsData);
        if (stats) {
          jogo.stats = stats;
          matched++;
          process.stdout.write('.');
        } else {
          noStats++;
          process.stdout.write('x');
        }
        fetched++;
      } catch(e) {
        console.log(`\n  [error] ${fsEv.fsId}: ${e.message}`);
        noStats++;
      }

      await sleep(DELAY_MS);
    }
  }

  console.log(`\n\nFetched: ${fetched} | With stats: ${matched} | No stats: ${noStats} | No FS match: ${noMatch}`);

  for (const [key, data] of Object.entries(processed)) {
    const withStats = data.jogos.filter(j => j.stats).length;
    const total     = data.jogos.filter(j => j.gh !== undefined).length;
    const fsCount   = data.jogos.filter(j => j.stats?._source === 'flashscore').length;
    console.log(`  ${key}: ${withStats}/${total} with stats (${fsCount} FlashScore)`);
  }

  fs.writeFileSync(path.join(BASE, 'ss_matches_processed.json'), JSON.stringify(processed, null, 2));
  console.log('\nUpdated ss_matches_processed.json');
}

main().catch(e => { console.error(e); process.exit(1); });
