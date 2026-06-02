const router  = require('express').Router();
const db      = require('../db');
const authMid = require('../middleware/auth');

// GET /api/players  — lista todos os jogadores
router.get('/', async (req, res) => {
  try {
    const { clube } = req.query;
    let query = 'SELECT * FROM players ORDER BY nome';
    let params = [];
    if (clube) {
      query = 'SELECT * FROM players WHERE clube = $1 ORDER BY nome';
      params = [clube];
    }
    const result = await db.query(query, params);
    res.json({ players: result.rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/players/:id  — retorna um jogador
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM players WHERE id = $1', [req.params.id]);
    if (!result.rows.length)
      return res.status(404).json({ error: 'Jogador não encontrado' });
    res.json({ player: result.rows[0] });
  } catch (e) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/players  — cadastra novo jogador (requer login)
router.post('/', authMid, async (req, res) => {
  const { id, nome, clube, pos, badge_class, idade, altura, peso, pe, cidade, score, iniciais, dados } = req.body;

  if (!id || !nome || !clube || !pos)
    return res.status(400).json({ error: 'Campos obrigatórios: id, nome, clube, pos' });

  try {
    const exists = await db.query('SELECT id FROM players WHERE id = $1', [id]);
    if (exists.rows.length > 0)
      return res.status(409).json({ error: 'Jogador com este ID já existe' });

    const result = await db.query(
      `INSERT INTO players (id, nome, clube, pos, badge_class, idade, altura, peso, pe, cidade, score, iniciais, dados)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [id, nome, clube, pos, badge_class, idade || null, altura || null, peso || null, pe, cidade, score || null, iniciais, dados ?? null]
    );
    res.status(201).json({ player: result.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/players/:id  — atualiza jogador (requer login)
router.put('/:id', authMid, async (req, res) => {
  const { nome, clube, pos, badge_class, idade, altura, peso, pe, cidade, score, iniciais, dados } = req.body;

  try {
    const result = await db.query(
      `UPDATE players SET nome=$1, clube=$2, pos=$3, badge_class=$4, idade=$5, altura=$6,
       peso=$7, pe=$8, cidade=$9, score=$10, iniciais=$11, dados=$12
       WHERE id=$13 RETURNING *`,
      [nome, clube, pos, badge_class, idade || null, altura || null, peso || null, pe, cidade, score || null, iniciais, dados ?? null, req.params.id]
    );
    if (!result.rows.length)
      return res.status(404).json({ error: 'Jogador não encontrado' });
    res.json({ player: result.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/players/:id  — remove jogador (requer login)
router.delete('/:id', authMid, async (req, res) => {
  try {
    const result = await db.query('DELETE FROM players WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length)
      return res.status(404).json({ error: 'Jogador não encontrado' });
    res.json({ deleted: req.params.id });
  } catch (e) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
