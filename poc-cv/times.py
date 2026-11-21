"""
CapixaStat — separação de times (item V2)
=========================================
Depois que o YOLO acha as pessoas, é preciso saber de que time cada uma é. Este módulo
faz isso só com a COR DA CAMISA, de forma robusta:

1. Máscara do gramado: pixels "verdes" (G bem maior que R e B) são ignorados — assim
   o fundo dentro da caixa não contamina a cor da camisa.
2. Cor do tronco: só a faixa do peito (20–50 % da altura da caixa, metade central da
   largura). Calção, meião, cabeça e braços ficam de fora.
3. KMeans com 2 grupos (os dois times) sobre as cores coletadas nos primeiros quadros.
   Quem fica longe dos dois centros (árbitro, goleiros) vira "outro".
4. Voto por ID: cada ID do rastreador acumula votos quadro a quadro e fica com o time
   mais votado — um quadro ruim (sombra, oclusão) não troca o jogador de time.
5. Filtro de banco/torcida: se quase não há grama logo abaixo dos pés, a pessoa está
   fora do gramado (banco, placa, arquibancada) e é descartada.

Só usa numpy (testável sem OpenCV/YOLO). Imagens em RGB, formato (altura, largura, 3).
"""
from __future__ import annotations

from collections import Counter, defaultdict

import numpy as np

OUTRO = "outro"


def mascara_gramado(img: np.ndarray, margem: int = 20) -> np.ndarray:
    """True onde o pixel é grama (verde dominante)."""
    img = img.astype(np.int16)
    r, g, b = img[..., 0], img[..., 1], img[..., 2]
    return (g > r + margem) & (g > b + margem)


def recorte_tronco(box) -> tuple[int, int, int, int]:
    x1, y1, x2, y2 = [float(v) for v in box]
    h, w = y2 - y1, x2 - x1
    return int(x1 + .25 * w), int(y1 + .20 * h), int(x2 - .25 * w), int(y1 + .50 * h)


def cor_do_tronco(img: np.ndarray, box, minimo_px: int = 12):
    """Cor mediana (RGB) da faixa do peito, sem os pixels de grama. None se sobrar pouco pixel."""
    H, W = img.shape[:2]
    a, b, c, d = recorte_tronco(box)
    a, c = max(0, a), min(W, c)
    b, d = max(0, b), min(H, d)
    if c <= a or d <= b:
        return None
    reg = img[b:d, a:c].reshape(-1, 3)
    reg = reg[~mascara_gramado(img[b:d, a:c]).reshape(-1)]
    if len(reg) < minimo_px:
        return None
    return np.median(reg, axis=0).astype(float)


def no_gramado(img: np.ndarray, box, fracao_minima: float = .35) -> bool:
    """Olha uma faixa logo abaixo dos pés: no gramado tem grama; no banco/arquibancada não."""
    H, W = img.shape[:2]
    x1, y1, x2, y2 = [int(v) for v in box]
    alt = max(2, int((y2 - y1) * .15))
    a, c = max(0, x1), min(W, x2)
    b, d = max(0, y2), min(H, y2 + alt)
    if c <= a or d <= b:  # pés na borda da imagem: não dá para saber, mantém
        return True
    return float(mascara_gramado(img[b:d, a:c]).mean()) >= fracao_minima


def kmeans(X: np.ndarray, k: int = 2, iters: int = 50, semente: int = 0):
    """KMeans simples (k-means++ determinístico). Retorna (centros, rótulos)."""
    X = np.asarray(X, dtype=float)
    rng = np.random.default_rng(semente)
    centros = [X[rng.integers(len(X))]]
    for _ in range(1, k):
        d2 = np.min([((X - c) ** 2).sum(1) for c in centros], axis=0)
        centros.append(X[int(np.argmax(d2))] if d2.sum() == 0 else X[rng.choice(len(X), p=d2 / d2.sum())])
    C = np.array(centros)
    for _ in range(iters):
        rot = np.argmin(((X[:, None, :] - C[None]) ** 2).sum(-1), axis=1)
        novo = np.array([X[rot == i].mean(0) if np.any(rot == i) else C[i] for i in range(k)])
        if np.allclose(novo, C):
            break
        C = novo
    return C, rot


class SeparadorDeTimes:
    """Uso:
        sep = SeparadorDeTimes()
        # fase 1 (primeiros quadros): sep.coletar(img, box) para cada pessoa
        sep.ajustar()
        # fase 2: time = sep.votar(id, img, box); final = sep.time_do_id(id)
    """

    def __init__(self, fator_outro: float = 2.2):
        self.amostras: list[np.ndarray] = []
        self.centros = None
        self.limite = None
        self.fator_outro = fator_outro
        self.votos: dict[int, Counter] = defaultdict(Counter)

    def coletar(self, img, box):
        cor = cor_do_tronco(img, box)
        if cor is not None and no_gramado(img, box):
            self.amostras.append(cor)

    def ajustar(self):
        if len(self.amostras) < 4:
            raise ValueError("Poucas amostras de cor para separar os times (colete mais quadros).")
        X = np.array(self.amostras)
        C, rot = kmeans(X, 2)
        # time A = camisa mais clara, só para o resultado ser estável entre execuções
        ordem = np.argsort(C.sum(1))[::-1]
        self.centros = C[ordem]
        mapa = {int(o): i for i, o in enumerate(ordem)}
        rot = np.array([mapa[int(r)] for r in rot])
        dist = np.linalg.norm(X - self.centros[rot], axis=1)
        # distância "normal" ao próprio centro; muito além disso = árbitro/goleiro
        self.limite = max(25.0, float(np.median(dist)) * self.fator_outro + 10)
        return self

    def classificar_cor(self, cor) -> str:
        if cor is None or self.centros is None:
            return OUTRO
        d = np.linalg.norm(self.centros - np.asarray(cor, float), axis=1)
        i = int(np.argmin(d))
        return OUTRO if d[i] > self.limite else ("A", "B")[i]

    def classificar(self, img, box) -> str | None:
        """None = fora do gramado (descartar)."""
        if not no_gramado(img, box):
            return None
        return self.classificar_cor(cor_do_tronco(img, box))

    def votar(self, tid: int, img, box) -> str | None:
        t = self.classificar(img, box)
        if t is not None:
            self.votos[int(tid)][t] += 1
        return self.time_do_id(tid) if t is not None else None

    def time_do_id(self, tid: int) -> str:
        v = self.votos.get(int(tid))
        return v.most_common(1)[0][0] if v else OUTRO
