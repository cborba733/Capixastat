-- Execute este arquivo no banco de dados para criar as tabelas

CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  nome       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  clube      VARCHAR(100),
  funcao     VARCHAR(100),
  atleta_id  VARCHAR(50),   -- B2: preenchido quando a função é "Atleta" (vincula ao cadastro do jogador)
  criado_em  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS players (
  id        VARCHAR(50) PRIMARY KEY,
  nome      VARCHAR(100) NOT NULL,
  clube     VARCHAR(100),
  pos       VARCHAR(50),
  badge_class VARCHAR(30),
  idade     INTEGER,
  altura    INTEGER,
  peso      INTEGER,
  pe        VARCHAR(20),
  cidade    VARCHAR(100),
  score     FLOAT,
  iniciais  VARCHAR(5),
  dados     JSONB,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matches (
  id        SERIAL PRIMARY KEY,
  comp_id   VARCHAR(50) NOT NULL,
  home      VARCHAR(100) NOT NULL,
  away      VARCHAR(100) NOT NULL,
  gh        INTEGER,
  ga        INTEGER,
  data      VARCHAR(10),
  fase      VARCHAR(100),
  hora      VARCHAR(10),
  stats     JSONB,
  penaltis  JSONB,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- ═══ v5 · B4: registros diários da comissão (dado real de carga e bem-estar) ═══
-- sRPE (Foster): carga da sessão = RPE (0–10) × minutos, em unidades arbitrárias (UA)
CREATE TABLE IF NOT EXISTS registros_srpe (
  id         VARCHAR(40) PRIMARY KEY,
  atleta_id  VARCHAR(50) NOT NULL,
  clube      VARCHAR(100),
  data       DATE NOT NULL,
  tipo       VARCHAR(30),
  minutos    INTEGER NOT NULL,
  rpe        INTEGER NOT NULL,
  carga      INTEGER NOT NULL,
  criado_por INTEGER,
  criado_em  TIMESTAMP DEFAULT NOW()
);

-- Bem-estar (índice de Hooper): sono, fadiga, estresse e dor de 1 (muito bom) a 7 (muito ruim)
CREATE TABLE IF NOT EXISTS registros_bemestar (
  id         VARCHAR(40) PRIMARY KEY,
  atleta_id  VARCHAR(50) NOT NULL,
  clube      VARCHAR(100),
  data       DATE NOT NULL,
  sono       INTEGER NOT NULL,
  fadiga     INTEGER NOT NULL,
  estresse   INTEGER NOT NULL,
  dor        INTEGER NOT NULL,
  lesao      BOOLEAN DEFAULT FALSE,
  hooper     INTEGER NOT NULL,
  criado_por INTEGER,
  criado_em  TIMESTAMP DEFAULT NOW()
);

-- ═══ v5 · B1: documentos do usuário (o que antes ficava só no navegador) ═══
-- Táticas salvas, telestrações, fotos enviadas, filtros salvos… guardados como JSON por usuário.
CREATE TABLE IF NOT EXISTS documentos (
  usuario_id    INTEGER NOT NULL,
  chave         VARCHAR(60) NOT NULL,
  dados         JSONB,
  atualizado_em TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (usuario_id, chave)
);

-- ═══ v5 · B2: bancos já existentes (criados antes da v5) ganham a coluna atleta_id ═══
ALTER TABLE users ADD COLUMN IF NOT EXISTS atleta_id VARCHAR(50);

-- ═══ v5 · B3: eventos de jogo (formato inspirado no StatsBomb Open Data) ═══
-- Cada linha é uma ação marcada no campo: quem, o quê, quando e onde.
-- Coordenadas x, y de 0 a 100: x = comprimento (0 = gol defendido, 100 = gol atacado), y = largura.
CREATE TABLE IF NOT EXISTS eventos_jogo (
  id         VARCHAR(40) PRIMARY KEY,
  partida    VARCHAR(200) NOT NULL,   -- chave da partida: competicao|mandante|visitante|data
  clube      VARCHAR(100),
  atleta_id  VARCHAR(50),
  tipo       VARCHAR(30) NOT NULL,    -- finalizacao, passe_chave, desarme, interceptacao, drible, falta, cartao
  resultado  VARCHAR(30),             -- gol, no_alvo, fora, bloqueado, certo, errado
  minuto     INTEGER NOT NULL,
  x          REAL NOT NULL,
  y          REAL NOT NULL,
  criado_por INTEGER,
  criado_em  TIMESTAMP DEFAULT NOW()
);

-- ═══ v5 · Dados externos + B7: partidas e classificação importadas de fontes permitidas ═══
-- A rotina de importação (backend/importar/) grava aqui; as telas leem daqui (nunca chamam a fonte direto).
CREATE TABLE IF NOT EXISTS fonte_partidas (
  fonte         VARCHAR(30)  NOT NULL,   -- ex.: thesportsdb
  id_externo    VARCHAR(40)  NOT NULL,   -- id do jogo na fonte
  competicao    VARCHAR(60)  NOT NULL,   -- ex.: capixabao
  temporada     VARCHAR(10)  NOT NULL,
  rodada        INTEGER,
  data          DATE,
  hora          VARCHAR(8),
  mandante      VARCHAR(100),
  visitante     VARCHAR(100),
  gols_mandante INTEGER,
  gols_visitante INTEGER,
  estadio       VARCHAR(120),
  status        VARCHAR(30),
  fonte_url     VARCHAR(300),
  atualizado_em TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (fonte, id_externo)
);

CREATE TABLE IF NOT EXISTS fonte_classificacao (
  fonte         VARCHAR(30) NOT NULL,
  competicao    VARCHAR(60) NOT NULL,
  temporada     VARCHAR(10) NOT NULL,
  posicao       INTEGER,
  time          VARCHAR(100) NOT NULL,
  pj INTEGER, v INTEGER, e INTEGER, d INTEGER, gp INTEGER, gc INTEGER, sg INTEGER, pts INTEGER,
  forma         VARCHAR(10),
  grupo         VARCHAR(80),
  atualizado_em TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (fonte, competicao, temporada, time)
);

-- B7: registro de cada importação (fonte, quando, quantos registros, erro)
CREATE TABLE IF NOT EXISTS importacoes (
  id           SERIAL PRIMARY KEY,
  fonte        VARCHAR(30) NOT NULL,
  competicao   VARCHAR(60),
  temporada    VARCHAR(10),
  iniciado_em  TIMESTAMP DEFAULT NOW(),
  terminado_em TIMESTAMP,
  status       VARCHAR(20),              -- ok | erro | parcial
  registros    INTEGER DEFAULT 0,
  mensagem     VARCHAR(500)
);
