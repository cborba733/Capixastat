# CapixaStat — Visão Computacional (POC)

Módulo de **Ciência de Dados** do Projeto Integrador. Demonstra, de forma **executável**,
o uso de Visão Computacional (YOLOv8) para **detectar e rastrear jogadores e bola** no vídeo
bruto de partidas do futebol capixaba.

## Arquivos
- **`capixaba_yolo_colab.ipynb`** — notebook do **Google Colab** (recomendado): baixa um trecho
  do jogo (ou aceita upload), roda YOLOv8 + ByteTrack e exporta o **vídeo anotado** (jogadores
  com ID + bola). Roda ponta a ponta.
- **`example_tracking.py`** — mesma lógica em script local (requer GPU para ser rápido):
  `python example_tracking.py --video clip.mp4 --model yolov8m.pt --out saida/ --max-frames 250`

## Como rodar (Colab — recomendado)
1. Abra `capixaba_yolo_colab.ipynb` no Google Colab.
2. `Runtime` → `Change runtime type` → **GPU (T4)**.
3. Rode as células na ordem. O notebook aponta para o jogo **Capixaba x Rio Branco ES**
   (ajuste `START`/`DUR`), ou faça upload de um MP4.
4. Saída: `anotado.mp4` (vídeo com caixas + IDs + bola).

## O que a POC entrega
- **Detecção**: jogadores (`person`) e bola (`sports ball`) com YOLOv8.
- **Rastreamento**: ID por jogador ao longo do lance (ByteTrack).
- **Vídeo anotado** para baixar.

## Limitações (leitura honesta)
- **GPU**: YOLOv8 precisa de aceleração — por isso roda no Colab, não no hosting gratuito do site.
- **Câmera móvel**: a transmissão do Capixabão **não tem câmera fixa** (gira/zoom) e o vídeo é 2D.
  Logo, **posição no campo, distância, velocidade e mapa de calor não são confiáveis** com esse
  material — por isso a POC foca em detecção + rastreamento.
- **Marca qualquer pessoa**: o YOLO detecta árbitros, bandeirinhas, gandulas e reservas, não só jogadores.

## Para onde evolui
- **Separar por time** (cor da camisa) e filtrar quem não é jogador.
- **Homografia** (calibrar 4 pontos do campo) → posições reais; aí heatmap/distância fazem sentido.
- **Câmera tática fixa** → tracking e métricas diretamente aproveitáveis.
- **Aba de Análise de Vídeo no CapixaStat** consumindo os resultados (vídeo anotado + dados).

## Tecnologias
Python 3 · Ultralytics YOLOv8 · OpenCV · ByteTrack · (Google Colab para GPU)
