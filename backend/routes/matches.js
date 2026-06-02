const router  = require('express').Router();
const db      = require('../db');
const authMid = require('../middleware/auth');

// GET /api/matches  — lista partidas (filtrável por comp_id ou time)
router.get('/', async (req, res) => {
  try {
    const { comp, clube } = req.query;
    let query = 'SELECT * FROM matches ORDER BY criado_em DESC';
    let params = [];

    if (comp && clube) {
      query = 'SELECT * FROM matches WHERE comp_id=$1 AND (home=$2 OR away=$2) ORDER BY data';
      params = [comp, clube];
    } else if (comp) {
      query = 'SELECT * FROM matches WHERE comp_id=$1 ORDER BY data';
      params = [comp];
    } else if (clube) {
      query = 'SELECT * FROM matches WHERE home=$1 OR away=$1 ORDER BY data';
      params = [clube];
    }

    const result = await db.query(query, params);
    res.json({ matches: result.rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/matches/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM matches WHERE id = $1', [req.params.id]);
    if (!result.rows.length)
      return res.status(404).json({ error: 'Partida não encontrada' });
    res.json({ match: result.rows[0] });
  } catch (e) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/matches  — registra nova partida (requer login)
router.post('/', authMid, async (req, res) => {
  const { comp_id, home, away, gh, ga, data, fase, hora, stats, penaltis } = req.body;

  if (!comp_id || !home || !away)
    return res.status(400).json({ error: 'Campos obrigatórios: comp_id, home, away' });

  try {
    const result = await db.query(
      `INSERT INTO matches (comp_id, home, away, gh, ga, data, fase, hora, stats, penaltis)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [comp_id, home, away, gh ?? null, ga ?? null, data, fase, hora,
       stats ? JSON.stringify(stats) : null,
       penaltis ? JSON.stringify(penaltis) : null]
    );
    res.status(201).json({ match: result.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/matches/:id  — atualiza partida (requer login)
router.put('/:id', authMid, async (req, res) => {
  const { gh, ga, stats, penaltis, fase, hora } = req.body;
  try {
    const result = await db.query(
      `UPDATE matches SET gh=$1, ga=$2, stats=$3, penaltis=$4, fase=$5, hora=$6
       WHERE id=$7 RETURNING *`,
      [gh ?? null, ga ?? null,
       stats ? JSON.stringify(stats) : null,
       penaltis ? JSON.stringify(penaltis) : null,
       fase, hora, req.params.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ error: 'Partida não encontrada' });
    res.json({ match: result.rows[0] });
  } catch (e) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
