-- Execute este arquivo no banco de dados para criar as tabelas

CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  nome       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  clube      VARCHAR(100),
  funcao     VARCHAR(100),
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
  score     INTEGER,
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
