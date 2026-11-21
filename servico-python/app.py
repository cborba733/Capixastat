"""
CapixaStat — serviço de cálculos em Python (item B5)
====================================================
FastAPI + Pandas. Faz os cálculos estatísticos do CapixaStat num lugar só, com as
MESMAS fórmulas usadas na plataforma (CapixaStat_v5.html), para que possam ser
conferidas, testadas e reaproveitadas:

  GET  /saude              → status do serviço
  POST /percentis          → números por 90 minutos + percentil dentro da posição
  POST /elo                → ranking Elo a partir de uma lista de jogos
  POST /xg                 → xG de cada finalização (modelo treinado no StatsBomb Open Data)
  GET  /xg/zonas           → tabela de xG por zona do campo de ataque

Rodar:   uvicorn app:app --reload --port 8000     (documentação em http://localhost:8000/docs)
Testar:  python -m pytest -q
"""
from __future__ import annotations

import json
import math
from pathlib import Path
from typing import Optional

import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ── parâmetros (iguais aos da plataforma) ─────────────────────────────────────
MIN_MINUTOS_90 = 270          # abaixo disso o "por 90" é instável e não é calculado
ELO_BASE, ELO_K, ELO_MANDO = 1500.0, 20.0, 60.0

_MODELO_PATH = Path(__file__).resolve().parent.parent / "analise-python" / "xg_modelo.json"
try:
    XG_MODELO = json.loads(_MODELO_PATH.read_text(encoding="utf-8"))
except OSError:  # o serviço continua funcionando mesmo publicado sem a pasta analise-python
    XG_MODELO = {"b0": -2.5403, "b_dist": -0.0495, "b_ang": 1.5248, "fonte": "StatsBomb Open Data (Copa do Mundo 2018)"}

app = FastAPI(
    title="CapixaStat — cálculos",
    version="1.0.0",
    description="Percentis por 90 minutos, Elo e xG com as fórmulas públicas do CapixaStat.",
)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["GET", "POST"], allow_headers=["*"])


# ── modelos de entrada ────────────────────────────────────────────────────────
class Jogador(BaseModel):
    id: str
    nome: Optional[str] = None
    posicao: str = Field(..., description="Grupo de posição usado para comparar (ex.: Atacante)")
    minutos: float = Field(..., ge=0)
    gols: float = 0
    assistencias: float = 0
    amarelos: float = 0
    vermelhos: float = 0


class PedidoPercentis(BaseModel):
    jogadores: list[Jogador]
    minimo_minutos: float = MIN_MINUTOS_90


class Jogo(BaseModel):
    data: str = Field(..., description="AAAA-MM-DD")
    casa: str
    fora: str
    gols_casa: int = Field(..., ge=0)
    gols_fora: int = Field(..., ge=0)


class PedidoElo(BaseModel):
    jogos: list[Jogo]
    k: float = ELO_K
    mando: float = ELO_MANDO


class Chute(BaseModel):
    x: float = Field(..., ge=0, le=100, description="0 = própria linha de fundo, 100 = linha de fundo atacada")
    y: float = Field(..., ge=0, le=100, description="0 a 100 de uma lateral à outra")
    gol: Optional[bool] = None


class PedidoXg(BaseModel):
    chutes: list[Chute]


# ── cálculos ──────────────────────────────────────────────────────────────────
def percentil(valores: pd.Series, v: float) -> int:
    """Mesmo percentil da plataforma: (abaixo + metade dos empates) / total."""
    if valores.empty:
        return 50
    abaixo = (valores < v).sum()
    iguais = (valores == v).sum()
    return int(round((abaixo + iguais / 2) / len(valores) * 100))


def calcular_percentis(jogadores: list[Jogador], minimo: float) -> pd.DataFrame:
    df = pd.DataFrame([j.model_dump() for j in jogadores])
    if df.empty:
        return df
    elegivel = df["minutos"] >= minimo
    k = 90 / df["minutos"].where(elegivel)
    df["gols_p90"] = df["gols"] * k
    df["assist_p90"] = df["assistencias"] * k
    df["ga_p90"] = (df["gols"] + df["assistencias"]) * k
    df["cartoes_p90"] = (df["amarelos"] + df["vermelhos"]) * k
    for col in ["gols_p90", "assist_p90", "ga_p90", "cartoes_p90"]:
        pct = []
        for _, linha in df.iterrows():
            if pd.isna(linha[col]):
                pct.append(None)
                continue
            pares = df.loc[(df["posicao"] == linha["posicao"]) & df[col].notna(), col]
            p = percentil(pares, linha[col])
            pct.append(100 - p if col == "cartoes_p90" else p)  # menos cartão = melhor
        df[col.replace("_p90", "_pct")] = pct
    df["elegivel"] = elegivel
    return df


def calcular_elo(jogos: list[Jogo], k: float = ELO_K, mando: float = ELO_MANDO) -> tuple[dict, dict]:
    """Elo com vantagem de mando e peso pela diferença de gols (mesma regra da tela Meu Time)."""
    df = pd.DataFrame([j.model_dump() for j in jogos])
    rating: dict[str, float] = {}
    historico: dict[str, list] = {}
    if df.empty:
        return rating, historico
    df["data"] = pd.to_datetime(df["data"])
    df = df.sort_values("data", kind="stable")
    for j in df.itertuples():
        rc = rating.setdefault(j.casa, ELO_BASE)
        rf = rating.setdefault(j.fora, ELO_BASE)
        historico.setdefault(j.casa, [])
        historico.setdefault(j.fora, [])
        esperado = 1 / (1 + 10 ** (-(rc + mando - rf) / 400))
        resultado = 1.0 if j.gols_casa > j.gols_fora else 0.0 if j.gols_casa < j.gols_fora else 0.5
        n = abs(j.gols_casa - j.gols_fora)
        g = 1 if n <= 1 else 1.5 if n == 2 else (11 + n) / 8
        delta = k * g * (resultado - esperado)
        rating[j.casa] = rc + delta
        rating[j.fora] = rf - delta
        d = j.data.date().isoformat()
        historico[j.casa].append({"data": d, "elo": round(rating[j.casa], 1)})
        historico[j.fora].append({"data": d, "elo": round(rating[j.fora], 1)})
    return rating, historico


def xg_do_chute(x: float, y: float) -> float:
    """x, y de 0 a 100 → metros num campo 105 × 68; gol atacado em x = 105, traves em y = 30,34 e 37,66."""
    X, Y = x * 1.05, y * 0.68
    dx = 105 - X
    dist = math.hypot(dx, 34 - Y)
    a, b, c = math.hypot(dx, 30.34 - Y), math.hypot(dx, 37.66 - Y), 7.32
    ang = math.acos(max(-1.0, min(1.0, (a * a + b * b - c * c) / (2 * a * b + 1e-9))))
    z = XG_MODELO["b0"] + XG_MODELO["b_dist"] * dist + XG_MODELO["b_ang"] * ang
    return 1 / (1 + math.exp(-z))


# ── rotas ─────────────────────────────────────────────────────────────────────
@app.get("/saude")
def saude():
    return {"ok": True, "servico": "capixastat-calculos", "pandas": pd.__version__,
            "xg_modelo": XG_MODELO.get("fonte"), "minimo_minutos": MIN_MINUTOS_90}


@app.post("/percentis")
def rota_percentis(pedido: PedidoPercentis):
    df = calcular_percentis(pedido.jogadores, pedido.minimo_minutos)
    if df.empty:
        return {"jogadores": [], "minimo_minutos": pedido.minimo_minutos}
    df = df.astype(object).where(df.notna(), None)
    cols = ["id", "nome", "posicao", "minutos", "elegivel", "gols_p90", "assist_p90", "ga_p90", "cartoes_p90",
            "gols_pct", "assist_pct", "ga_pct", "cartoes_pct"]
    saida = []
    for linha in df[cols].to_dict(orient="records"):
        for c in ["gols_p90", "assist_p90", "ga_p90", "cartoes_p90"]:
            if linha[c] is not None:
                linha[c] = round(float(linha[c]), 3)
        saida.append(linha)
    return {"jogadores": saida, "minimo_minutos": pedido.minimo_minutos,
            "regra": "por 90 = valor × 90 / minutos; percentil dentro da mesma posição; cartões invertidos (menos = melhor)"}


@app.post("/elo")
def rota_elo(pedido: PedidoElo):
    rating, historico = calcular_elo(pedido.jogos, pedido.k, pedido.mando)
    ranking = sorted(({"clube": c, "elo": round(v, 1), "jogos": len(historico[c])} for c, v in rating.items()),
                     key=lambda r: -r["elo"])
    for i, r in enumerate(ranking, 1):
        r["posicao"] = i
    return {"ranking": ranking, "historico": historico, "jogos": len(pedido.jogos),
            "parametros": {"base": ELO_BASE, "k": pedido.k, "mando": pedido.mando}}


@app.post("/xg")
def rota_xg(pedido: PedidoXg):
    chutes = [{**c.model_dump(), "xg": round(xg_do_chute(c.x, c.y), 4)} for c in pedido.chutes]
    total = sum(c["xg"] for c in chutes)
    gols = sum(1 for c in chutes if c["gol"])
    return {"chutes": chutes, "xg_total": round(total, 3), "gols": gols,
            "gols_menos_xg": round(gols - total, 3), "modelo": XG_MODELO.get("fonte")}


@app.get("/xg/zonas")
def rota_xg_zonas(colunas: int = 6, linhas: int = 5):
    """xG médio de cada zona do último terço + entrada da área (x de 70 a 100)."""
    colunas, linhas = max(1, min(colunas, 20)), max(1, min(linhas, 20))
    zonas = []
    for i in range(colunas):
        x0, x1 = 70 + 30 * i / colunas, 70 + 30 * (i + 1) / colunas
        for j in range(linhas):
            y0, y1 = 100 * j / linhas, 100 * (j + 1) / linhas
            amostra = [xg_do_chute(x0 + (x1 - x0) * (a + .5) / 4, y0 + (y1 - y0) * (b + .5) / 4) for a in range(4) for b in range(4)]
            zonas.append({"x0": round(x0, 2), "x1": round(x1, 2), "y0": round(y0, 2), "y1": round(y1, 2),
                          "xg_medio": round(sum(amostra) / len(amostra), 4)})
    return {"zonas": zonas, "modelo": XG_MODELO.get("fonte")}
