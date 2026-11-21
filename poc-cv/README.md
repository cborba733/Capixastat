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

## V1 — Homografia com 4 cliques (pixels → metros) — `homografia.py`
A posição que o YOLO devolve está em **pixels**. Para falar em posição no campo, distância ou
mapa de calor real é preciso converter para **metros**. A homografia é uma matriz 3×3 calculada a
partir de **4 pontos do gramado que você clica** e cuja posição real é conhecida (ex.: os 4 cantos
da grande área).

```bash
pip install numpy opencv-python
python homografia.py pontos                       # lista os pontos de referência (FIFA 105×68 m)
python homografia.py calibrar --video clip.mp4 --quadro 0     --pontos ga_dir_sup ga_dir_inf ga_dir_linha_inf ga_dir_linha_sup --saida calib.json
python example_tracking.py --video clip.mp4 --calib calib.json --out saida/   # gera saida/posicoes.csv
python -m unittest test_homografia.py               # 7 testes (só precisa de numpy)
```
- Matemática própria (DLT com numpy), comentada linha a linha — o OpenCV só abre a janela de clique.
- Usa o **pé do jogador** (centro da base da caixa) e descarta o que cai fora do gramado (torcida, banco).
- `posicoes.csv`: `quadro, tempo_s, id, classe, time, x_px, y_px, x_m, y_m` (`time` vazio sem `--times`).
- **Limite:** a calibração só vale enquanto a câmera não se mexe. Na transmissão é preciso recalibrar
  a cada corte de câmera; com câmera tática fixa, calibra-se uma vez só.

## V2 — Separação de times pela cor da camisa — `times.py`
```bash
python example_tracking.py --video clip.mp4 --calib calib.json --times --out saida/
python -m pytest -q                                   # 14 testes (homografia, times e o laço com YOLO falso)
```
- **Máscara do gramado:** pixel verde (G bem maior que R e B) é ignorado ao medir a cor.
- **Só o tronco:** faixa do peito (20–50 % da altura da caixa, metade central) — calção, meião e cabeça ficam de fora.
- **KMeans (k = 2)** em numpy sobre as cores coletadas nos primeiros 25 quadros → time **A** (camisa mais clara)
  e **B**. Quem fica longe dos dois centros (árbitro, goleiros) vira **outro**.
- **Voto por ID:** cada jogador rastreado fica com o time mais votado ao longo do vídeo (um quadro com sombra não troca o time).
- **Banco e torcida:** se quase não há grama logo abaixo dos pés, a pessoa é descartada.
- Vídeo anotado com caixas laranja (A), azuis (B) e cinza (outro); coluna `time` no `posicoes.csv`.

## Para onde evolui
- ~~**Separar por time**~~ — feito (V2, acima).
- ~~**Homografia**~~ — feito (V1, acima). Próximo: mapa de calor e posições médias a partir do CSV.
- **Câmera tática fixa** → tracking e métricas diretamente aproveitáveis.
- **Aba de Análise de Vídeo no CapixaStat** consumindo os resultados (vídeo anotado + dados).

## Tecnologias
Python 3 · Ultralytics YOLOv8 · OpenCV · ByteTrack · (Google Colab para GPU)
