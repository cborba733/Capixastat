"""Testa o laço de example_tracking.py (V1 + V2) sem GPU: OpenCV e YOLO são substituídos por falsos.
Rodar: python -m pytest -q test_tracking_mock.py"""
import csv
import json
import sys
import types

import numpy as np

from test_times import campo, jogador


class _Arr:
    def __init__(self, a): self.a = np.asarray(a)
    def cpu(self): return self
    def numpy(self): return self.a


def _instalar_falsos(quadros):
    cv2 = types.ModuleType("cv2")
    cv2.CAP_PROP_FPS, cv2.CAP_PROP_FRAME_WIDTH, cv2.CAP_PROP_FRAME_HEIGHT = 5, 3, 4
    cv2.FONT_HERSHEY_SIMPLEX = 0

    class Cap:
        def __init__(self, *_): pass
        def isOpened(self): return True
        def get(self, k): return {5: 25, 3: quadros[0][0].shape[1], 4: quadros[0][0].shape[0]}[k]
        def release(self): pass

    class Writer:
        n = 0
        def __init__(self, *a): pass
        def write(self, f): Writer.n += 1
        def release(self): pass

    cv2.VideoCapture, cv2.VideoWriter = Cap, Writer
    cv2.VideoWriter_fourcc = lambda *a: 0
    cv2.rectangle = cv2.putText = lambda *a, **k: None
    ul = types.ModuleType("ultralytics")

    class YOLO:
        def __init__(self, *_): pass
        def track(self, **_):
            for img_rgb, dets in quadros:
                boxes = types.SimpleNamespace(id=_Arr([d[1] for d in dets]), xyxy=_Arr([d[0] for d in dets]), cls=_Arr([d[2] for d in dets]))
                yield types.SimpleNamespace(orig_img=img_rgb[..., ::-1].copy(), boxes=boxes)  # YOLO entrega BGR

    ul.YOLO = YOLO
    sys.modules["cv2"], sys.modules["ultralytics"] = cv2, ul
    return Writer


def test_laco_completo_com_times_e_calibracao(tmp_path):
    img = campo(300, 900)
    img[260:, :] = (90, 90, 95)  # faixa de banco/pista
    dets = [(jogador(img, 30 + 60 * i, 40, (205, 30, 35)), i, 0) for i in range(5)]
    dets += [(jogador(img, 30 + 60 * i, 140, (25, 45, 190)), 10 + i, 0) for i in range(5)]
    dets += [(jogador(img, 500, 210, (205, 30, 35)), 99, 0)]  # pés em y=260 → banco
    dets += [((600, 100, 606, 106), 50, 32)]  # bola
    quadros = [(img, [(np.array(b, float), t, c) for b, t, c in dets])] * 30
    Writer = _instalar_falsos(quadros)
    # calibração identidade em escala: 900 px = 105 m, 300 px ≈ 68 m
    calib = tmp_path / "calib.json"
    H = [[105 / 900, 0, 0], [0, 68 / 300, 0], [0, 0, 1]]
    calib.write_text(json.dumps({"H": H, "erro_medio_m": 0}), encoding="utf-8")
    sys.modules.pop("example_tracking", None)
    import example_tracking as et
    et.run("x.mp4", out_dir=str(tmp_path), calib=str(calib), times=True, quadros_aquecimento=10)
    assert Writer.n == 30
    linhas = list(csv.DictReader(open(tmp_path / "posicoes.csv", encoding="utf-8")))
    assert len({l["quadro"] for l in linhas}) == 30
    ids_time = {int(l["id"]): l["time"] for l in linhas if l["classe"] == "pessoa"}
    assert 99 not in ids_time  # banco descartado
    assert {ids_time[i] for i in range(5)} == {"A"} or {ids_time[i] for i in range(5)} == {"B"}
    assert {ids_time[i] for i in range(5)} != {ids_time[i] for i in range(10, 15)}
    assert any(l["classe"] == "bola" for l in linhas)
