"""Testes do serviço de cálculos (B5). Rodar: python -m pytest -q"""
from fastapi.testclient import TestClient

from app import app, xg_do_chute

c = TestClient(app)


def test_saude():
    r = c.get("/saude")
    assert r.status_code == 200 and r.json()["ok"] is True


def test_xg_igual_ao_javascript():
    # valores conferidos com xgDoChute() do CapixaStat_v5.html: pênalti ~0,24 (6 m do gol na pequena área), 25 m ~0,03
    assert 0.20 < xg_do_chute(100 - 6 / 1.05, 50) < 0.28
    assert 0.09 < xg_do_chute(100 - 11 / 1.05, 50) < 0.13
    assert xg_do_chute(100 - 25 / 1.05, 50) < 0.05
    # de frente é melhor que no ângulo, na mesma distância de linha de fundo
    assert xg_do_chute(90, 50) > xg_do_chute(90, 10)


def test_rota_xg():
    r = c.post("/xg", json={"chutes": [{"x": 94, "y": 50, "gol": True}, {"x": 75, "y": 30, "gol": False}]})
    d = r.json()
    assert r.status_code == 200 and d["gols"] == 1 and len(d["chutes"]) == 2
    assert abs(d["xg_total"] - sum(ch["xg"] for ch in d["chutes"])) < 1e-3


def test_xg_valida_entrada():
    assert c.post("/xg", json={"chutes": [{"x": 140, "y": 50}]}).status_code == 422


def test_zonas():
    d = c.get("/xg/zonas?colunas=3&linhas=3").json()
    assert len(d["zonas"]) == 9
    centro_perto = [z for z in d["zonas"] if z["x0"] >= 90 and z["y0"] > 30 and z["y1"] < 70][0]
    assert centro_perto["xg_medio"] == max(z["xg_medio"] for z in d["zonas"])


def test_elo():
    jogos = [
        {"data": "2026-01-10", "casa": "A", "fora": "B", "gols_casa": 2, "gols_fora": 0},
        {"data": "2026-01-17", "casa": "B", "fora": "C", "gols_casa": 1, "gols_fora": 1},
        {"data": "2026-01-03", "casa": "C", "fora": "A", "gols_casa": 0, "gols_fora": 4},
    ]
    d = c.post("/elo", json={"jogos": jogos}).json()
    assert d["ranking"][0]["clube"] == "A"
    soma = sum(r["elo"] for r in d["ranking"])
    assert abs(soma - 3 * 1500) < 0.5  # Elo é soma zero
    assert d["historico"]["A"][0]["data"] == "2026-01-03"  # ordem cronológica


def test_elo_primeiro_jogo_confere_formula():
    # casa 1500+60 vs 1500: esperado = 1/(1+10^(-60/400)) = 0,5856; vitória por 1 → delta = 20·(1−0,5856) = 8,29
    d = c.post("/elo", json={"jogos": [{"data": "2026-02-01", "casa": "X", "fora": "Y", "gols_casa": 1, "gols_fora": 0}]}).json()
    elo = {r["clube"]: r["elo"] for r in d["ranking"]}
    assert abs(elo["X"] - 1508.3) < 0.1 and abs(elo["Y"] - 1491.7) < 0.1


def test_percentis():
    jog = [
        {"id": "1", "posicao": "Atacante", "minutos": 900, "gols": 10, "assistencias": 2},
        {"id": "2", "posicao": "Atacante", "minutos": 900, "gols": 2, "assistencias": 1},
        {"id": "3", "posicao": "Atacante", "minutos": 100, "gols": 3},          # abaixo de 270 min
        {"id": "4", "posicao": "Zagueiro", "minutos": 900, "gols": 1, "amarelos": 5},
    ]
    d = {j["id"]: j for j in c.post("/percentis", json={"jogadores": jog}).json()["jogadores"]}
    assert d["1"]["gols_p90"] == 1.0 and d["1"]["gols_pct"] == 75 and d["2"]["gols_pct"] == 25
    assert d["3"]["elegivel"] is False and d["3"]["gols_p90"] is None and d["3"]["gols_pct"] is None
    assert d["4"]["gols_pct"] == 50  # sozinho na posição
