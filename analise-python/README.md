# CapixaStat — Análises em Python

## V5 — Modelo de xG com StatsBomb Open Data (`xg_statsbomb.py`)
Não existe base pública com a posição dos chutes do futebol capixaba. Então o modelo de **gols esperados (xG)**
é treinado nos **dados abertos do StatsBomb** (Copa do Mundo 2018) e aplicado aos chutes que a comissão marca
no CapixaStat (tela **Scout ao Vivo → Exportar CSV**).

```bash
pip install numpy matplotlib
python xg_statsbomb.py treinar --jogos 30            # gera xg_modelo.json e mapa_chutes.png
python xg_statsbomb.py aplicar capixastat-scout.csv  # xG de cada finalização marcada no CapixaStat
```

- Regressão logística escrita do zero (numpy, gradiente descendente): `xG = 1 / (1 + e^-(b0 + b1·distância + b2·ângulo))`.
- Resultado com 30 jogos (794 chutes, 62 gols): soma do xG = 62,0 (bem calibrado), erro de Brier 0,066,
  **correlação de 0,78 com o xG oficial do StatsBomb** usando só 2 variáveis.
- Os coeficientes de `xg_modelo.json` são os mesmos usados na plataforma (mapa de finalizações, item P3).
- Créditos: StatsBomb Open Data — https://github.com/statsbomb/open-data (uso não comercial com atribuição).
