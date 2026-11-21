"""
CAPIXABA HUB / CapixaStat — POC DE VISÃO COMPUTACIONAL (Ciência de Dados — PI)

Detecção + rastreamento de jogadores e bola (YOLOv8 + ByteTrack) sobre um clipe
de partida, com exportação de vídeo anotado (cada jogador com um ID).

É a versão local/standalone do notebook `capixaba_yolo_colab.ipynb`.
Rode onde houver GPU (ou aceite que em CPU fica lento).

Dependências:
    pip install ultralytics opencv-python

Uso:
    python example_tracking.py --video clip.mp4 --model yolov8m.pt --out saida/
    # V1: com calibração por homografia (ver homografia.py), também grava posicoes.csv em METROS
    python example_tracking.py --video clip.mp4 --calib calib.json --out saida/
    # V2: separa os times pela cor da camisa (KMeans no tronco) e descarta banco/torcida
    python example_tracking.py --video clip.mp4 --calib calib.json --times --out saida/

Leitura honesta: a transmissão usa câmera móvel e o vídeo é 2D. Logo, posição no
campo, distância, velocidade e mapa de calor NÃO são confiáveis com esse material
— por isso a POC foca em detecção + rastreamento. O YOLO também marca qualquer
pessoa (árbitros, reservas), não só jogadores. Métricas reais exigiriam câmera
tática fixa ou calibração por homografia.
"""

import argparse
import csv
import os

import cv2


CORES_TIME = {"A": (255, 140, 40), "B": (40, 90, 255), "outro": (200, 200, 200)}  # BGR


def run(video_path, model_name="yolov8m.pt", out_dir="saida", conf=0.30, max_frames=0, calib=None,
        times=False, quadros_aquecimento=25):
    from ultralytics import YOLO  # import tardio: só precisa quando roda de verdade

    os.makedirs(out_dir, exist_ok=True)
    annotated_path = os.path.join(out_dir, "anotado.mp4")

    print(f"[*] Carregando modelo {model_name} ...")
    model = YOLO(model_name)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise SystemExit(f"Não consegui abrir o vídeo: {video_path}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 25
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    cap.release()

    writer = cv2.VideoWriter(annotated_path, cv2.VideoWriter_fourcc(*"mp4v"), fps, (w, h))
    ids_vistos = set()

    # V1: homografia (pixels → metros). Sem --calib, nada muda.
    H, csv_w, csv_f = None, None, None
    if calib:
        import homografia as hg
        H, info = hg.carregar_calibracao(calib)
        print(f"[*] Calibração carregada ({info.get('erro_medio_m', 0):.3f} m de erro nos pontos clicados)")
        csv_f = open(os.path.join(out_dir, "posicoes.csv"), "w", newline="", encoding="utf-8")
        csv_w = csv.writer(csv_f)
        csv_w.writerow(["quadro", "tempo_s", "id", "classe", "time", "x_px", "y_px", "x_m", "y_m"])

    # V2: separação de times. Os primeiros quadros só coletam cores; depois ajusta o KMeans
    # e processa esses quadros guardados junto com o resto.
    sep = None
    if times:
        from times import SeparadorDeTimes
        sep = SeparadorDeTimes()
        print(f"[*] Separação de times ligada (aprende as cores nos primeiros {quadros_aquecimento} quadros)")

    print("[*] Rodando detecção + rastreamento (classes: person, sports ball) ...")
    # COCO: 0 = person, 32 = sports ball
    results = model.track(
        source=video_path, stream=True, persist=True,
        classes=[0, 32], conf=conf, tracker="bytetrack.yaml", verbose=False,
    )

    def processar(n, frame, dets):
        rgb = frame[..., ::-1] if sep is not None else None
        for (x1, y1, x2, y2), tid, c in dets:
            is_ball = c == 32
            time = ""
            if is_ball:
                color = (0, 165, 255)
            elif sep is not None:
                time = sep.votar(tid, rgb, (x1, y1, x2, y2))
                if time is None:  # V2: banco/torcida (sem grama sob os pés) → ignora
                    continue
                color = CORES_TIME[time]
            else:
                color = (118, 230, 0)  # BGR
            cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)
            label = "bola" if is_ball else (f"{time} #{tid}" if time else f"#{tid}")
            cv2.putText(frame, label, (int(x1), int(y1) - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
            if not is_ball:
                ids_vistos.add(int(tid))
            if H is not None:
                # pés do jogador (base da caixa) ou centro da bola → metros no campo
                px, py = hg.pe_do_jogador(x1, y1, x2, y2) if not is_ball else ((x1 + x2) / 2, (y1 + y2) / 2)
                xm, ym = hg.imagem_para_campo(H, [[px, py]])[0]
                if hg.dentro_do_campo(xm, ym):  # descarta torcida, banco e ruído fora do gramado
                    csv_w.writerow([n, round(n / fps, 2), int(tid), "bola" if is_ball else "pessoa", time,
                                    round(float(px), 1), round(float(py), 1), round(float(xm), 2), round(float(ym), 2)])
        writer.write(frame)

    buffer = []  # V2: quadros do aquecimento, processados depois do KMeans
    n = 0
    for r in results:
        n += 1
        if max_frames and n > max_frames:
            break
        frame = r.orig_img.copy()
        boxes = r.boxes
        dets = []
        if boxes is not None and boxes.id is not None:
            dets = list(zip(boxes.xyxy.cpu().numpy(), boxes.id.cpu().numpy().astype(int), boxes.cls.cpu().numpy().astype(int)))
        if sep is not None and sep.centros is None:
            for box, _, c in dets:
                if c != 32:
                    sep.coletar(frame[..., ::-1], box)
            buffer.append((n, frame, dets))
            if len(buffer) >= quadros_aquecimento and len(sep.amostras) >= 4:
                sep.ajustar()
                print(f"[*] Cores dos times (RGB): A={sep.centros[0].round().tolist()} B={sep.centros[1].round().tolist()}")
                for item in buffer:
                    processar(*item)
                buffer = []
            continue
        processar(n, frame, dets)
    if buffer:  # vídeo curto demais para aquecer: tenta assim mesmo, senão grava sem times
        try:
            sep.ajustar()
        except ValueError as e:
            print(f"[!] {e} Gravando sem separação de times.")
            sep = None
        for item in buffer:
            processar(*item)

    writer.release()
    if csv_f:
        csv_f.close()
        print(f"[+] Posições em metros salvas em: {os.path.join(out_dir, 'posicoes.csv')} "
              "(válidas enquanto a câmera não se mexe — recalibre a cada corte)")
    print(f"[+] Vídeo anotado salvo em: {annotated_path}")
    print(f"[+] IDs de pessoas rastreadas: {len(ids_vistos)} "
          "(inclui árbitros/reservas — o YOLO marca qualquer pessoa)")
    if sep is not None:
        cont = {}
        for tid in ids_vistos:
            t = sep.time_do_id(tid)
            cont[t] = cont.get(t, 0) + 1
        print(f"[+] IDs por time (V2): {cont}  — 'outro' = árbitros/goleiros")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="POC CapixaStat — tracking YOLOv8")
    ap.add_argument("--video", required=True, help="caminho do clipe .mp4")
    ap.add_argument("--model", default="yolov8m.pt", help="modelo YOLO (n/m/x)")
    ap.add_argument("--out", default="saida", help="pasta de saída")
    ap.add_argument("--conf", type=float, default=0.30, help="confiança mínima")
    ap.add_argument("--max-frames", type=int, default=0, help="processar no máximo N quadros (0 = todos)")
    ap.add_argument("--calib", default=None, help="V1: arquivo de calibração gerado por homografia.py (posições em metros)")
    ap.add_argument("--times", action="store_true", help="V2: separa os times pela cor da camisa e ignora banco/torcida")
    args = ap.parse_args()
    run(args.video, args.model, args.out, args.conf, args.max_frames, args.calib, args.times)
