# Seção para o relatório — Visão computacional: limites e alternativas (item V6)

> Texto pronto para colar no relatório do PI3 (capítulo de resultados / trabalhos futuros).
> Ajuste a numeração das seções e figuras ao documento final.

## Limites da abordagem atual

O módulo de visão computacional do CapixaStat (pasta `poc-cv`) detecta e rastreia jogadores e bola
com YOLOv8 + ByteTrack, separa os times pela cor da camisa (KMeans no tronco) e converte a posição
de pixels para metros por homografia calibrada com 4 pontos do gramado. Com vídeos de **transmissão
de TV**, porém, há limites importantes:

1. **Câmera móvel.** A câmera de transmissão gira, aproxima e corta para replays. A homografia só vale
   enquanto o enquadramento não muda; a cada movimento é preciso recalibrar. Por isso, posições em
   metros, distâncias percorridas, velocidades e mapas de calor só são confiáveis em trechos curtos,
   com a câmera parada.
2. **Campo parcial.** A transmissão mostra só a região da bola. Jogadores fora do quadro não são
   medidos, o que afeta compactação e posições médias (o time "encolhe" quando metade dele está fora).
3. **Troca de identidade.** Quando jogadores se cruzam ou saem do quadro, o rastreador pode trocar o
   número (ID) de um jogador. O CapixaStat mostra a porcentagem de quadros em que cada ID aparece e
   apaga IDs pouco presentes, mas não resolve o problema.
4. **Quem é quem.** O YOLO detecta "pessoas". Árbitros, reservas e goleiros são separados por regras
   simples (cor diferente dos dois times, ausência de grama sob os pés), que podem falhar com
   uniformes parecidos ou sombra forte.
5. **Resolução e compressão.** Vídeos de jogos estaduais costumam ter baixa resolução; a bola,
   pequena e rápida, é perdida em parte dos quadros.

Por esses motivos, o projeto **não apresenta como dado real** nenhuma métrica física (distância,
velocidade) tirada de transmissão. A aba *Análise de Vídeo* mostra apenas o que o arquivo
`posicoes.csv` contém e avisa que as posições valem enquanto a câmera não muda de enquadramento.

## Alternativa: câmera fixa (tática)

A forma de transformar a prova de conceito em ferramenta de uso diário é gravar com **câmera fixa,
alta e enquadrando o campo inteiro** — a chamada câmera tática. Com ela:

- a calibração por homografia é feita **uma vez por estádio** e vale para o jogo todo;
- todos os 22 jogadores ficam no quadro o tempo inteiro (compactação, posições médias e mapa de
  calor passam a ser completos);
- o rastreamento fica mais estável (menos entradas e saídas do quadro).

Opções, da mais barata para a mais completa:

| Opção | Como funciona | Observação |
|---|---|---|
| Celular ou câmera de ação com lente grande-angular em tripé alto (andaime, arquibancada) | Grava o campo inteiro sem operador | Custo baixo; exige posição elevada e boa luz |
| Duas câmeras fixas (uma para cada metade) | Cada metade calibrada separadamente, as posições são unidas no CSV | Melhora a resolução na área distante |
| Câmeras panorâmicas automáticas com IA (ex.: **Veo**, Pixellot, Trace) | Gravam o campo inteiro em panorâmica e geram vídeo que acompanha a bola automaticamente | Serviço por assinatura; a gravação panorâmica é ideal para o `poc-cv`, pois a câmera não se move |

Para clubes capixabas, o caminho mais viável é começar com **celular em tripé alto** nos jogos em
casa e nos treinos (custo quase zero) e avaliar uma câmera panorâmica automática quando houver
orçamento. Em todos os casos, o fluxo do CapixaStat continua o mesmo: `homografia.py` (calibrar uma
vez) → `example_tracking.py --calib --times` → abrir o `posicoes.csv` na aba *Análise de Vídeo*.

## Próximos passos técnicos

- Recalibração automática a cada corte de câmera (detectar linhas do campo em vez de 4 cliques).
- Modelo YOLO ajustado com imagens do futebol capixaba (melhor detecção da bola e de goleiros).
- Reidentificação de jogadores (manter o mesmo ID após cruzamentos) e ligação do ID ao atleta do
  elenco pelo número da camisa.
