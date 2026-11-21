// B2: perfis de acesso. A função escolhida no cadastro define o papel, e cada papel
// tem um conjunto de permissões. Usado depois do authMid: router.post('/', authMid, permitir('players:write'), ...)
const db = require('../db');

const PAPEIS = {
  'Técnico': 'tecnico',
  'Analista de Desempenho': 'analista',
  'Preparador Físico': 'preparador',
  'Médico / Fisioterapeuta': 'medico',
  'Scout': 'scout',
  'Diretor': 'diretor',
  'Atleta': 'atleta',
  'Estudante': 'estudante',
};

// Quem pode ESCREVER em cada área (leitura é liberada para qualquer usuário logado)
const PERMISSOES = {
  'registros:srpe':     ['tecnico', 'analista', 'preparador', 'medico', 'atleta'], // F5: atleta informa o próprio esforço
  'registros:bemestar': ['tecnico', 'analista', 'preparador', 'medico', 'atleta'],
  'players:write':      ['tecnico', 'analista', 'scout', 'diretor'],
  'matches:write':      ['tecnico', 'analista'],
  'eventos:write':      ['tecnico', 'analista', 'scout'],
};

const papelDe = (funcao) => PAPEIS[funcao] || 'estudante';

async function carregarPapel(req) {
  if (req.papel) return req.papel;
  const r = await db.query('SELECT funcao, atleta_id FROM users WHERE id = $1', [req.userId]);
  const u = r.rows[0] || {};
  req.papel = papelDe(u.funcao);
  req.atletaId = u.atleta_id || null;
  return req.papel;
}

function permitir(permOuFn) {
  return async (req, res, next) => {
    try {
      const perm = typeof permOuFn === 'function' ? permOuFn(req) : permOuFn;
      const papel = await carregarPapel(req);
      if (!(PERMISSOES[perm] || []).includes(papel))
        return res.status(403).json({ error: 'Seu perfil (' + papel + ') não tem permissão para esta ação.' });
      next();
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };
}

module.exports = { permitir, carregarPapel, papelDe, PAPEIS, PERMISSOES };
