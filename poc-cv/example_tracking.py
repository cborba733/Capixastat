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

Leitura honesta: a transmissão usa câmera móvel e o vídeo é 2D. Logo, posição no
campo, distância, velocidade e mapa de calor NÃO são confiáveis com esse material
— por isso a POC foca em detecção + rastreamento. O YOLO também marca qualquer
pessoa (árbitros, reservas), não só jogadores. Métricas reais exigiriam câmera
tática fixa ou calibração por homografia.
"""

import argparse
import os

import cv2


def run(video_path, model_name="yolov8m.pt", out_dir="saida", conf=0.30, max_frames=0):
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

    print("[*] Rodando detecção + rastreamento (classes: person, sports ball) ...")
    # COCO: 0 = person, 32 = sports ball
    results = model.track(
        source=video_path, stream=True, persist=True,
        classes=[0, 32], conf=conf, tracker="bytetrack.yaml", verbose=False,
    )

    n = 0
    for r in results:
        n += 1
        if max_frames and n > max_frames:
            break
        frame = r.orig_img.copy()
        boxes = r.boxes
        if boxes is not None and boxes.id is not None:
            ids = boxes.id.cpu().numpy().astype(int)
            xyxy = boxes.xyxy.cpu().numpy()
            clss = boxes.cls.cpu().numpy().astype(int)
            for (x1, y1, x2, y2), tid, c in zip(xyxy, ids, clss):
                is_ball = c == 32
                color = (0, 165, 255) if is_ball else (118, 230, 0)  # BGR
                cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)
                label = "bola" if is_ball else f"#{tid}"
                cv2.putText(frame, label, (int(x1), int(y1) - 6),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                if not is_ball:
                    ids_vistos.add(int(tid))
        writer.write(frame)

    writer.release()
    print(f"[+] Vídeo anotado salvo em: {annotated_path}")
    print(f"[+] IDs de pessoas rastreadas: {len(ids_vistos)} "
          "(inclui árbitros/reservas — o YOLO marca qualquer pessoa)")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="POC CapixaStat — tracking YOLOv8")
    ap.add_argument("--video", required=True, help="caminho do clipe .mp4")
    ap.add_argument("--model", default="yolov8m.pt", help="modelo YOLO (n/m/x)")
    ap.add_argument("--out", default="saida", help="pasta de saída")
    ap.add_argument("--conf", type=float, default=0.30, help="confiança mínima")
    ap.add_argument("--max-frames", type=int, default=0, help="processar no máximo N quadros (0 = todos)")
    args = ap.parse_args()
    run(args.video, args.model, args.out, args.conf, args.max_frames)
