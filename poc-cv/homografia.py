"""
CapixaStat — V1: HOMOGRAFIA COM 4 CLIQUES (imagem da câmera → metros no campo)

Problema: o YOLO devolve a posição do jogador em PIXELS da imagem. Para falar em
"posição no campo", distância percorrida ou mapa de calor real, é preciso converter
pixels em METROS. Uma homografia faz isso: é uma matriz 3×3 que leva pontos de um
plano (o gramado visto pela câmera) para outro plano (o campo desenhado de cima).

Como calibrar: o usuário clica em 4 pontos do gramado que ele sabe onde ficam no
campo real (ex.: os 4 cantos da grande área). Com 4 pares (pixel ↔ metro) dá para
calcular a matriz. A partir daí, qualquer ponto do gramado na imagem vira (x, y) em metros.

Limite importante (leitura honesta): a matriz só vale enquanto a câmera NÃO se mexer.
Na transmissão do Capixabão a câmera gira e dá zoom, então é preciso recalibrar a cada
corte de câmera (ou usar uma câmera tática fixa). Por isso o script trabalha por clipe curto.

Uso:
    # 1) calibrar num quadro do vídeo (abre uma janela para clicar nos 4 pontos)
    python homografia.py calibrar --video clip.mp4 --quadro 0 \
        --pontos ga_dir_sup ga_dir_inf ga_dir_linha_inf ga_dir_linha_sup --saida calib.json
    # 2) usar no rastreamento: gera CSV com posições em metros
    python example_tracking.py --video clip.mp4 --calib calib.json --out saida/
    # ver os nomes de pontos disponíveis
    python homografia.py pontos

Só depende de numpy para a matemática (OpenCV só na janela de clique).
"""

import argparse
import json

import numpy as np

# Campo padrão FIFA: 105 m × 68 m. Origem no canto superior esquerdo, x no comprimento
# (0 = linha de fundo esquerda, 105 = direita), y na largura (0 = lateral de cima, 68 = de baixo).
COMPRIMENTO, LARGURA = 105.0, 68.0
GA_PROF, GA_LARG = 16.5, 40.32          # grande área
PA_PROF, PA_LARG = 5.5, 18.32           # pequena área
Y_GA = (LARGURA - GA_LARG) / 2          # 13.84
Y_PA = (LARGURA - PA_LARG) / 2          # 24.84

PONTOS_CAMPO = {
    # cantos do campo
    'canto_sup_esq': (0.0, 0.0), 'canto_inf_esq': (0.0, LARGURA),
    'canto_sup_dir': (COMPRIMENTO, 0.0), 'canto_inf_dir': (COMPRIMENTO, LARGURA),
    # meio-campo
    'meio_sup': (COMPRIMENTO / 2, 0.0), 'meio_inf': (COMPRIMENTO / 2, LARGURA), 'centro': (COMPRIMENTO / 2, LARGURA / 2),
    # grande área esquerda (linha de fundo e linha da frente da área)
    'ga_esq_linha_sup': (0.0, Y_GA), 'ga_esq_linha_inf': (0.0, Y_GA + GA_LARG),
    'ga_esq_sup': (GA_PROF, Y_GA), 'ga_esq_inf': (GA_PROF, Y_GA + GA_LARG),
    # grande área direita
    'ga_dir_linha_sup': (COMPRIMENTO, Y_GA), 'ga_dir_linha_inf': (COMPRIMENTO, Y_GA + GA_LARG),
    'ga_dir_sup': (COMPRIMENTO - GA_PROF, Y_GA), 'ga_dir_inf': (COMPRIMENTO - GA_PROF, Y_GA + GA_LARG),
    # pequenas áreas
    'pa_esq_sup': (PA_PROF, Y_PA), 'pa_esq_inf': (PA_PROF, Y_PA + PA_LARG),
    'pa_dir_sup': (COMPRIMENTO - PA_PROF, Y_PA), 'pa_dir_inf': (COMPRIMENTO - PA_PROF, Y_PA + PA_LARG),
    # marcas do pênalti
    'penalti_esq': (11.0, LARGURA / 2), 'penalti_dir': (COMPRIMENTO - 11.0, LARGURA / 2),
}


def calcular_homografia(pts_imagem, pts_campo):
    """Matriz H (3×3) que leva pixels → metros, a partir de 4 (ou mais) pares de pontos.

    Método DLT (Direct Linear Transform): cada par (u,v) → (x,y) gera 2 equações lineares
    nas 8 incógnitas de H (fixando h33 = 1). Com 4 pares o sistema é 8×8; com mais pares,
    resolve por mínimos quadrados (fica mais robusto a erro de clique).
    """
    src = np.asarray(pts_imagem, dtype=float)
    dst = np.asarray(pts_campo, dtype=float)
    if src.shape != dst.shape or src.shape[0] < 4 or src.shape[1] != 2:
        raise ValueError('São necessários pelo menos 4 pares de pontos (x, y).')
    linhas, alvo = [], []
    for (u, v), (x, y) in zip(src, dst):
        linhas.append([u, v, 1, 0, 0, 0, -u * x, -v * x]); alvo.append(x)
        linhas.append([0, 0, 0, u, v, 1, -u * y, -v * y]); alvo.append(y)
    A, b = np.array(linhas), np.array(alvo)
    if np.linalg.matrix_rank(A) < 8:
        raise ValueError('Pontos degenerados: escolha 4 pontos sem 3 deles na mesma reta.')
    h, *_ = np.linalg.lstsq(A, b, rcond=None)
    return np.append(h, 1.0).reshape(3, 3)


def aplicar(H, pontos):
    """Aplica H a uma lista de pontos (N×2) e devolve N×2 (coordenadas homogêneas → cartesianas)."""
    p = np.asarray(pontos, dtype=float).reshape(-1, 2)
    hom = np.hstack([p, np.ones((len(p), 1))]) @ H.T
    return hom[:, :2] / hom[:, 2:3]


def imagem_para_campo(H, pontos_px):
    return aplicar(H, pontos_px)


def campo_para_imagem(H, pontos_m):
    return aplicar(np.linalg.inv(H), pontos_m)


def pe_do_jogador(x1, y1, x2, y2):
    """O ponto que toca o gramado é o centro da base da caixa (os pés), não o centro da caixa."""
    return ((x1 + x2) / 2.0, y2)


def dentro_do_campo(x, y, folga=2.0):
    return -folga <= x <= COMPRIMENTO + folga and -folga <= y <= LARGURA + folga


def erro_reprojecao(H, pts_imagem, pts_campo):
    """Erro médio (em metros) ao reprojetar os pontos de calibração — quanto menor, melhor."""
    est = aplicar(H, pts_imagem)
    return float(np.mean(np.linalg.norm(est - np.asarray(pts_campo, dtype=float), axis=1)))


def salvar_calibracao(caminho, pts_imagem, nomes, H, quadro=None, video=None):
    dados = {
        'pontos_imagem': [list(map(float, p)) for p in pts_imagem],
        'nomes': list(nomes),
        'pontos_campo': [list(PONTOS_CAMPO[n]) for n in nomes],
        'H': H.tolist(),
        'erro_medio_m': erro_reprojecao(H, pts_imagem, [PONTOS_CAMPO[n] for n in nomes]),
        'quadro': quadro, 'video': video,
        'aviso': 'Válida só enquanto a câmera não se move (recalibrar a cada corte de câmera).',
    }
    with open(caminho, 'w', encoding='utf-8') as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)
    return dados


def carregar_calibracao(caminho):
    with open(caminho, encoding='utf-8') as f:
        dados = json.load(f)
    return np.array(dados['H'], dtype=float), dados


def calibrar_interativo(video, quadro, nomes, saida):
    """Abre o quadro do vídeo e pede 4 cliques, na ordem dos nomes informados."""
    import cv2  # só aqui: a matemática acima não precisa do OpenCV
    if len(nomes) < 4:
        raise SystemExit('Informe pelo menos 4 nomes de pontos (veja: python homografia.py pontos).')
    for n in nomes:
        if n not in PONTOS_CAMPO:
            raise SystemExit(f'Ponto desconhecido: {n}. Veja: python homografia.py pontos')
    cap = cv2.VideoCapture(video)
    cap.set(cv2.CAP_PROP_POS_FRAMES, quadro)
    ok, img = cap.read()
    cap.release()
    if not ok:
        raise SystemExit(f'Não consegui ler o quadro {quadro} de {video}')
    cliques = []
    janela = 'CapixaStat - clique nos pontos (Esc cancela)'

    def ao_clicar(evento, x, y, *_):
        if evento == cv2.EVENT_LBUTTONDOWN and len(cliques) < len(nomes):
            cliques.append((x, y))

    cv2.namedWindow(janela)
    cv2.setMouseCallback(janela, ao_clicar)
    while len(cliques) < len(nomes):
        tela = img.copy()
        for i, (x, y) in enumerate(cliques):
            cv2.circle(tela, (x, y), 6, (0, 255, 255), -1)
            cv2.putText(tela, nomes[i], (x + 8, y - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 255), 2)
        cv2.putText(tela, f'Clique em: {nomes[len(cliques)]}', (20, 34), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
        cv2.imshow(janela, tela)
        if cv2.waitKey(30) == 27:
            cv2.destroyAllWindows()
            raise SystemExit('Calibração cancelada.')
    cv2.destroyAllWindows()
    H = calcular_homografia(cliques, [PONTOS_CAMPO[n] for n in nomes])
    dados = salvar_calibracao(saida, cliques, nomes, H, quadro, video)
    print(f'[+] Calibração salva em {saida} — erro médio de {dados["erro_medio_m"]:.3f} m nos pontos clicados')
    return H


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description='CapixaStat — homografia com 4 cliques')
    sub = ap.add_subparsers(dest='cmd', required=True)
    sub.add_parser('pontos', help='lista os pontos do campo que podem ser usados na calibração')
    c = sub.add_parser('calibrar', help='abre um quadro do vídeo para clicar nos pontos')
    c.add_argument('--video', required=True)
    c.add_argument('--quadro', type=int, default=0)
    c.add_argument('--pontos', nargs='+', required=True, help='nomes dos pontos, na ordem em que você vai clicar')
    c.add_argument('--saida', default='calib.json')
    a = ap.parse_args()
    if a.cmd == 'pontos':
        for n, (x, y) in PONTOS_CAMPO.items():
            print(f'{n:20s} x={x:6.2f} m  y={y:5.2f} m')
    else:
        calibrar_interativo(a.video, a.quadro, a.pontos, a.saida)
