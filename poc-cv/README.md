# Capixaba Hub - Visão Computacional (POC)

Este diretório contém os scripts de Prova de Conceito (Proof of Concept) exigidos pelo módulo de **Ciência de Dados** da matéria de Projeto Integrador 3.

## Objetivo
Demonstrar a aplicabilidade técnica de algoritmos de Visão Computacional (*Deep Learning*) no contexto real do futebol amador/semi-profissional capixaba. Como não possuímos dados ricos estruturados (APIs financeiras caríssimas), esta POC visa extrair estatísticas de tracking e mapas de calor a partir do vídeo puro das partidas.

## Estratégia Adotada
1. O Core da aplicação (`/src` - React) lida com as análises inseridas manualmente e consolidadas através do nosso algoritmo `CapixabaScore`.
2. Esta POC de Visão Computacional funciona como um módulo **assíncrono apartado**. 
3. **Por que separado?** Modelos de IA baseados em arquiteturas YOLOv8 requerem aceleração de hardware (GPU) inviáveis de se hospedar em instâncias gratuitas da AWS (ex: EC2 `t2.micro` que rodará a aplicação React).
4. O *Python script* neste diretório é projetado para rodar localmente (desde que com GPU compatível) ou no **Google Colab** consumindo um clipe de vídeo da partida esportil e gerando como saída um "Mapa de Calor" e um *Dataframe* processado. Esse *Dataframe* então pode alimentar a nossa aplicação futuramente.

## Tecnologias Abordadas
- Python 3
- OpenCV (`cv2`) para manipulação dos frames e geração das heatmaps
- Ultralytics / YOLOv8 (Detecção de Ojetos)
- Pandas (Tratamento dos Dados Temporais)

## Como utilizar (Google Colab Recomendado)
1. Crie um Notebook Python.
2. Faça upload de um clipe MP4 (câmera tática/lateral de um campeonato capixaba).
3. Adapte e execute o script contido em `example_tracking.py`.
4. Os *assets* gerados (Imagens de Mapa de Calor) alimentam a aba "POC CV" no *Perfil do Jogador* na nossa plaforma Frontend.
