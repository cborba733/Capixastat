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
