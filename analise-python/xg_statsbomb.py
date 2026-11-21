"""
CapixaStat — V5: MODELO DE xG (gols esperados) COM DADOS ABERTOS DO STATSBOMB

O que é xG: a probabilidade de um chute virar gol, estimada a partir de onde ele foi feito.
Um chute da pequena área de frente vale muito mais que um chute de longe pela lateral.

Por que StatsBomb: não existe base pública com a posição de cada chute do futebol capixaba.
O StatsBomb publica dados abertos (github.com/statsbomb/open-data, uso não comercial com crédito),
com as coordenadas de cada finalização. Treinamos o modelo neles e aplicamos aos chutes que a
comissão marca no CapixaStat (tela Scout ao Vivo → Exportar CSV).

Modelo: regressão logística com 2 variáveis — distância ao gol (m) e ângulo de visão do gol (rad).
Escrita do zero com numpy (gradiente descendente) para ficar didática; sem scikit-learn.

Uso:
    pip install numpy matplotlib
    python xg_statsbomb.py treinar --jogos 30            # baixa 30 jogos, treina, salva xg_modelo.json e mapa_chutes.png
    python xg_statsbomb.py aplicar capixastat-scout.csv  # calcula o xG de cada finalização marcada no CapixaStat

Dados: StatsBomb Open Data (https://github.com/statsbomb/open-data) — atribuição exigida.
"""
import argparse
import csv
import json
import math
import os
import urllib.request

import numpy as np

BASE = 'https://raw.githubusercontent.com/statsbomb/open-data/master/data/'
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cache_statsbomb')
UA = {'User-Agent': 'CapixaStat/1.0 (projeto academico)'}
# Campo StatsBomb: 120 × 80 jardas, gol atacado em x = 120, entre y = 36 e y = 44.
SB_COMP, SB_LARG, TRAVE1, TRAVE2 = 120.0, 80.0, 36.0, 44.0
JARDA_M = 0.9144


def baixar(caminho):
    """Baixa um JSON do StatsBomb (com cache local para não repetir downloads)."""
    os.makedirs(CACHE, exist_ok=True)
    arq = os.path.join(CACHE, caminho.replace('/', '_'))
    if not os.path.exists(arq):
        with urllib.request.urlopen(urllib.request.Request(BASE + caminho, headers=UA), timeout=60) as r:
            open(arq, 'wb').write(r.read())
    with open(arq, encoding='utf-8') as f:
        return json.load(f)


def features(x, y):
    """Distância (m) e ângulo (rad) a partir da posição do chute em coordenadas StatsBomb."""
    dx, dy = (SB_COMP - x) * JARDA_M, (SB_LARG / 2 - y) * JARDA_M
    dist = math.hypot(dx, dy)
    # ângulo entre as duas traves visto do ponto do chute (lei dos cossenos)
    a = math.hypot((SB_COMP - x) * JARDA_M, (TRAVE1 - y) * JARDA_M)
    b = math.hypot((SB_COMP - x) * JARDA_M, (TRAVE2 - y) * JARDA_M)
    c = (TRAVE2 - TRAVE1) * JARDA_M
    cosang = max(-1.0, min(1.0, (a * a + b * b - c * c) / (2 * a * b + 1e-9)))
    return dist, math.acos(cosang)


def coletar_chutes(n_jogos, competicao=43, temporada=3):
    """Chutes (exceto pênaltis) de n jogos. Padrão: Copa do Mundo 2018 (competição 43, temporada 3)."""
    jogos = baixar(f'matches/{competicao}/{temporada}.json')[:n_jogos]
    chutes = []
    for i, j in enumerate(jogos, 1):
        for ev in baixar(f"events/{j['match_id']}.json"):
            if ev.get('type', {}).get('name') != 'Shot':
                continue
            sh = ev.get('shot', {})
            if sh.get('type', {}).get('name') == 'Penalty':
                continue
            x, y = ev['location'][:2]
            d, ang = features(x, y)
            chutes.append({'x': x, 'y': y, 'dist': d, 'ang': ang, 'gol': 1 if sh.get('outcome', {}).get('name') == 'Goal' else 0,
                           'xg_statsbomb': sh.get('statsbomb_xg')})
        print(f'  jogo {i}/{len(jogos)}: {len(chutes)} chutes até agora')
    return chutes


def treinar_logistica(X, y, passos=20000, taxa=0.05):
    """Regressão logística por gradiente descendente: p = 1 / (1 + e^-(b0 + b1·dist + b2·ang))."""
    mu, sd = X.mean(axis=0), X.std(axis=0) + 1e-9
    Z = np.hstack([np.ones((len(X), 1)), (X - mu) / sd])     # padroniza para o gradiente convergir
    w = np.zeros(Z.shape[1])
    for _ in range(passos):
        p = 1 / (1 + np.exp(-Z @ w))
        w -= taxa * Z.T @ (p - y) / len(y)
    # volta para a escala original (metros e radianos) — é o que a plataforma usa
    b = w[1:] / sd
    b0 = w[0] - np.sum(w[1:] * mu / sd)
    return float(b0), [float(v) for v in b]


def prever(modelo, dist, ang):
    z = modelo['b0'] + modelo['b_dist'] * dist + modelo['b_ang'] * ang
    return 1 / (1 + math.exp(-z))


def mapa_chutes(chutes, modelo, arquivo):
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots(figsize=(8, 6), facecolor='#0a0f18')
    ax.set_facecolor('#1b5e33')
    # meio campo de ataque (x de 60 a 120)
    for (x1, y1, x2, y2) in [(60, 0, 120, 0), (60, 80, 120, 80), (120, 0, 120, 80), (60, 0, 60, 80),
                             (102, 18, 120, 18), (102, 62, 120, 62), (102, 18, 102, 62), (114, 30, 120, 30), (114, 50, 120, 50), (114, 30, 114, 50)]:
        ax.plot([x1, x2], [y1, y2], color='white', lw=1, alpha=.7)
    xs = [c['x'] for c in chutes]; ys = [c['y'] for c in chutes]
    tam = [40 + 900 * prever(modelo, c['dist'], c['ang']) for c in chutes]
    cor = ['#facc15' if c['gol'] else '#5b95ff' for c in chutes]
    ax.scatter(xs, ys, s=tam, c=cor, alpha=.6, edgecolors='white', linewidths=.4)
    ax.set_xlim(60, 121); ax.set_ylim(81, -1); ax.set_aspect('equal'); ax.axis('off')
    ax.set_title(f'{len(chutes)} chutes · amarelo = gol · tamanho = xG do modelo CapixaStat\nDados: StatsBomb Open Data',
                 color='white', fontsize=11)
    fig.savefig(arquivo, dpi=120, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close(fig)


def cmd_treinar(args):
    print(f'[*] Baixando {args.jogos} jogos do StatsBomb Open Data...')
    chutes = coletar_chutes(args.jogos)
    X = np.array([[c['dist'], c['ang']] for c in chutes]); y = np.array([c['gol'] for c in chutes], dtype=float)
    b0, (b_dist, b_ang) = treinar_logistica(X, y)
    modelo = {'b0': b0, 'b_dist': b_dist, 'b_ang': b_ang, 'n_chutes': len(chutes), 'n_gols': int(y.sum()),
              'fonte': 'StatsBomb Open Data (Copa do Mundo 2018)', 'variaveis': 'dist (m) e ang (rad) até o centro do gol'}
    # avaliação simples: soma do xG previsto x gols reais, e comparação com o xG oficial do StatsBomb
    prev = [prever(modelo, c['dist'], c['ang']) for c in chutes]
    sb = [c['xg_statsbomb'] for c in chutes if c['xg_statsbomb'] is not None]
    modelo['soma_xg'] = round(sum(prev), 1)
    modelo['brier'] = round(float(np.mean((np.array(prev) - y) ** 2)), 4)  # erro quadrático médio (menor = melhor)
    if sb:
        modelo['correlacao_com_xg_statsbomb'] = round(float(np.corrcoef([prever(modelo, c['dist'], c['ang']) for c in chutes if c['xg_statsbomb'] is not None], sb)[0, 1]), 3)
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'xg_modelo.json')
    json.dump(modelo, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'[+] Modelo salvo em {out}:'); print(json.dumps(modelo, ensure_ascii=False, indent=2))
    for d in (6, 11, 16, 25):
        print(f'    chute central a {d} m → xG {prever(modelo, d, features(SB_COMP - d / JARDA_M, 40)[1]):.2f}')
    png = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mapa_chutes.png')
    mapa_chutes(chutes, modelo, png); print(f'[+] Mapa de chutes: {png}')


def cmd_aplicar(args):
    """Aplica o modelo ao CSV exportado da tela Scout ao Vivo (x, y de 0 a 100; x = 100 é o gol atacado)."""
    modelo = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'xg_modelo.json'), encoding='utf-8'))
    total = 0.0
    with open(args.csv, encoding='utf-8-sig') as f:
        for r in csv.DictReader(f):
            if r['tipo'] != 'finalizacao':
                continue
            x_sb, y_sb = float(r['x']) * SB_COMP / 100, float(r['y']) * SB_LARG / 100
            d, ang = features(x_sb, y_sb)
            xg = prever(modelo, d, ang); total += xg
            print(f"{r['minuto']:>3}' {r['atleta']:<22} {r['resultado']:<10} dist {d:5.1f} m  xG {xg:.2f}")
    print(f'xG total: {total:.2f}')


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description='CapixaStat — xG com StatsBomb Open Data')
    sub = ap.add_subparsers(dest='cmd', required=True)
    t = sub.add_parser('treinar'); t.add_argument('--jogos', type=int, default=30)
    a = sub.add_parser('aplicar'); a.add_argument('csv')
    args = ap.parse_args()
    cmd_treinar(args) if args.cmd == 'treinar' else cmd_aplicar(args)
