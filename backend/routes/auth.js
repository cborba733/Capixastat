const router   = require('express').Router();
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const db       = require('../db');
const authMid  = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { nome, email, senha, clube, funcao } = req.body;

  if (!nome || !email || !senha || !clube || !funcao)
    return res.status(400).json({ error: 'Preencha todos os campos' });
  if (senha.length < 6)
    return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });

  try {
    const exists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0)
      return res.status(409).json({ error: 'Este e-mail já está cadastrado' });

    const hash = await bcrypt.hash(senha, 10);
    const result = await db.query(
      'INSERT INTO users (nome, email, senha_hash, clube, funcao) VALUES ($1,$2,$3,$4,$5) RETURNING id, nome, email, clube, funcao, criado_em',
      [nome, email, hash, clube, funcao]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha)
    return res.status(400).json({ error: 'Informe e-mail e senha' });

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!result.rows.length)
      return res.status(401).json({ error: 'E-mail ou senha incorretos' });

    const user = result.rows[0];
    const ok = await bcrypt.compare(senha, user.senha_hash);
    if (!ok)
      return res.status(401).json({ error: 'E-mail ou senha incorretos' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, nome: user.nome, email: user.email, clube: user.clube, funcao: user.funcao }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/auth/me  (retorna dados do usuário logado)
router.get('/me', authMid, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, nome, email, clube, funcao, criado_em FROM users WHERE id = $1',
      [req.userId]
    );
    if (!result.rows.length)
      return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ user: result.rows[0] });
  } catch (e) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
