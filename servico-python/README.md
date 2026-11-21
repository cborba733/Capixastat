# Serviço de cálculos em Python (B5)

FastAPI + Pandas com as **mesmas fórmulas** usadas na plataforma (`CapixaStat_v5.html`):
percentis por 90 minutos, ranking Elo e xG por finalização / por zona. Serve para conferir
os números da tela, testar as fórmulas com `pytest` e reaproveitar os cálculos em outros
sistemas (backend, notebooks, relatórios).

## Rodar

```powershell
cd servico-python
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload --port 8000
```

Documentação interativa (Swagger): http://localhost:8000/docs

## Rotas

| Rota | O que faz |
|---|---|
| `GET /saude` | status do serviço |
| `POST /percentis` | gols, assistências, G+A e cartões **por 90 min** (só com ≥ 270 min) e percentil dentro da posição |
| `POST /elo` | ranking Elo (base 1500, K = 20, mando +60, peso pela diferença de gols) + histórico por clube |
| `POST /xg` | xG de cada chute (`x`, `y` de 0 a 100) + soma e gols − xG |
| `GET /xg/zonas` | xG médio por zona do último terço (grade configurável) |

O modelo de xG vem de `analise-python/xg_modelo.json` (regressão logística treinada no
StatsBomb Open Data — ver `analise-python/README.md`).

## Testes

```powershell
python -m pytest -q
```

8 testes: fórmula do Elo conferida à mão, Elo soma zero e em ordem cronológica, xG igual ao do
JavaScript, validação de entrada, percentis e corte de 270 minutos.

**Conferência com a plataforma (21/11/2026):** os 136 jogos reais de 2026 enviados para `/elo`
deram exatamente o mesmo Elo da tela Meu Time (diferença 0,0 em todos os 29 clubes); o xG de
5 pontos de chute ficou igual ao `xgDoChute()` do HTML (diferença < 0,0001).
