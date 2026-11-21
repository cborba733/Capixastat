"""Testes da separação de times (V2) com imagens sintéticas. Rodar: python -m pytest -q test_times.py"""
import numpy as np

from times import OUTRO, SeparadorDeTimes, cor_do_tronco, kmeans, mascara_gramado, no_gramado

VERDE = (40, 140, 50)


def campo(h=200, w=400):
    img = np.zeros((h, w, 3), np.uint8)
    img[:] = VERDE
    return img


def jogador(img, x, y, camisa, calcao=(240, 240, 240), w=20, h=50):
    img[y:y + h // 2, x:x + w] = camisa          # tronco
    img[y + h // 2:y + h, x:x + w] = calcao      # calção/pernas
    img[y:y + int(h * .2), x + 6:x + w - 6] = (200, 160, 130)  # cabeça
    return (x, y, x + w, y + h)


def test_mascara():
    img = campo(10, 10)
    img[0, 0] = (200, 30, 30)
    m = mascara_gramado(img)
    assert m.sum() == 99 and not m[0, 0]


def test_cor_do_tronco_ignora_grama_e_calcao():
    img = campo()
    box = jogador(img, 50, 40, (200, 30, 30))
    cor = cor_do_tronco(img, box)
    assert np.allclose(cor, (200, 30, 30), atol=2)


def test_kmeans_dois_grupos():
    X = np.vstack([np.random.default_rng(1).normal((200, 30, 30), 8, (20, 3)),
                   np.random.default_rng(2).normal((30, 40, 200), 8, (20, 3))])
    C, rot = kmeans(X, 2)
    assert len(set(rot[:20])) == 1 and len(set(rot[20:])) == 1 and rot[0] != rot[-1]


def test_separa_times_e_arbitro():
    img = campo(220, 900)
    rng = np.random.default_rng(0)
    vermelhos = [jogador(img, 20 + 40 * i, 30, tuple(int(v) for v in np.clip(np.array((205, 30, 35)) + rng.normal(0, 6, 3), 0, 255))) for i in range(10)]
    azuis = [jogador(img, 20 + 40 * i, 120, tuple(int(v) for v in np.clip(np.array((25, 45, 190)) + rng.normal(0, 6, 3), 0, 255))) for i in range(10)]
    arbitro = jogador(img, 600, 30, (15, 15, 15), calcao=(15, 15, 15))
    sep = SeparadorDeTimes()
    for b in vermelhos + azuis + [arbitro]:
        sep.coletar(img, b)
    sep.ajustar()
    tv = {sep.classificar(img, b) for b in vermelhos}
    ta = {sep.classificar(img, b) for b in azuis}
    assert len(tv) == 1 and len(ta) == 1 and tv != ta and OUTRO not in tv | ta
    assert sep.classificar(img, arbitro) == OUTRO


def test_banco_fora_do_gramado():
    img = campo(200, 300)
    img[150:, :] = (90, 90, 95)  # faixa cinza = pista/banco
    dentro = jogador(img, 40, 40, (200, 30, 30))
    fora = jogador(img, 120, 100, (200, 30, 30))  # pés em y=150 → abaixo é cinza
    assert no_gramado(img, dentro) and not no_gramado(img, fora)


def test_voto_por_id_resiste_a_quadro_ruim():
    img = campo(220, 900)
    times = [jogador(img, 20 + 40 * i, 30, (205, 30, 35)) for i in range(6)] + [jogador(img, 20 + 40 * i, 120, (25, 45, 190)) for i in range(6)]
    sep = SeparadorDeTimes()
    for b in times:
        sep.coletar(img, b)
    sep.ajustar()
    alvo = times[0]
    for _ in range(5):
        sep.votar(7, img, alvo)
    sombra = img.copy()
    sombra[alvo[1]:alvo[3], alvo[0]:alvo[2]] = (25, 45, 190)  # 1 quadro com a cor errada
    sep.votar(7, sombra, alvo)
    assert sep.time_do_id(7) == sep.classificar(img, alvo)
