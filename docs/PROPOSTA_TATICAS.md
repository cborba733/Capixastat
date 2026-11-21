# Táticas — avaliação, pesquisa e proposta (Rodada 2, 21/11/2026)

## 1. Opinião sincera sobre o que existe hoje

**Campo (prancheta)** — é a parte mais sólida: formação, funções, titulares/reservas e predefinições salvas funcionam
bem e são úteis para a comissão. Não precisa mudar agora.

**Dossiê do Adversário** — útil como ponto de partida, mas **não está no nível de um relatório profissional**:
- O bloco "Como o time joga" (estilo, mentalidade, pressão, bloco defensivo) vem de **rótulos fixos no código, sem
  fonte**. O "plano de jogo" é montado em cima desses rótulos como se fossem fato — fere a regra de integridade do
  próprio projeto.
- Falta o que um analista entrega na preleção: **resumo de uma página com 3 chaves do jogo**, forma recente com placares,
  desempenho em casa × fora, comparação de força com o seu time, confronto direto, quem está pendurado, e os **lances
  em vídeo** que sustentam cada ponto.
- O texto é corrido; o técnico precisa de algo que leia em 2 minutos.

**Auxiliar Tático (chat com IA)** — é o ponto mais fraco:
- Depende de cada usuário colar uma chave do Gemini no navegador; sem chave vira um "modo offline" de respostas prontas.
- O modo "busca na web" pode **inventar dados** (o próprio aviso na tela admite isso) — perigoso num sistema que se
  vende pela confiabilidade.
- Um chat aberto é menos útil para o técnico do que um texto curto, ancorado nos números, sobre o próximo adversário.
- Conclusão: vale manter, mas **só respondendo com os dados do sistema e mostrando quais dados usou**, e como "redator"
  do dossiê — não como oráculo.

## 2. O que a pesquisa mostrou (como profissionais fazem)
- **Relatório de adversário** responde: pontos fortes e fracos, que sistema encaixa melhor no jogo, e como o adversário
  deve jogar contra nós. É organizado por **fases do jogo**: 1ª e 2ª fase de construção, último terço, transição
  ofensiva, transição defensiva, organização defensiva e **bolas paradas** (Footure; relatórios de estágio da U. Lisboa e
  U. Porto; PFSA).
- **Formato**: resumo de **uma página**, **3 a 5 chaves do jogo**, números-chave do adversário, plano do nosso time e
  **clipes curtos** ligados a cada chave ("uma página limpa comunica mais que três de texto"). Modelos comerciais listam:
  3 chaves para vencer, números-chave, estrutura e funções, fases do jogo, bolas paradas, forças/fraquezas, nosso plano,
  cenários de placar, duelos-chave + clipes.
- **Fluxo de trabalho** (Hudl): conteúdo → processo → entrega; o analista prepara dados + vídeo no início da semana e o
  auxiliar leva para o treino. Rugby/World Rugby sugere **SWOT** com participação de comissão e atletas.
- **Dados de equipe** (StatsBomb/Wyscout/SkillCorner): comparar o adversário com a liga e ao longo do tempo; pressão,
  construção e bolas paradas como blocos próprios.
- **IA em análise**: as ferramentas sérias usam a IA **ancorada nos dados** do próprio sistema — ex.: Twelve Football
  ("wordalisation": o modelo escreve o texto a partir dos números já calculados), Sevilla FC + IBM/Llama (busca nos
  relatórios do clube), Databricks "La Pizarra" (IA sobre os mesmos dados governados). A IA redige e organiza; a decisão
  é do treinador.

## 3. Proposta (prioridade × dificuldade)

| # | Mudança | Prioridade | Dificuldade |
|---|---|---|---|
| TA1 | **Integridade do perfil tático**: estilo/mentalidade/pressão/bloco aparecem como "informado pela comissão (não verificado)", editáveis e salvos na nuvem; o plano de jogo diz em que dado se baseia | Alta | Baixa |
| TA2 | **Resumo de uma página** no topo do Dossiê: 3 chaves do jogo (geradas dos dados reais e editáveis), números-chave e "nosso plano" | Alta | Média |
| TA3 | **Números reais que já temos** no Dossiê: últimos 5 jogos com placar, casa × fora, Elo comparado ao seu time, estilo em percentis (T4), confronto direto, pendurados, artilheiros com G+A por 90 | Alta | Média |
| TA4 | **Lances ligados ao Dossiê**: lances da biblioteca marcados com o adversário (tag ou partida) aparecem no dossiê para a preleção | Alta | Baixa |
| TA5 | **Auxiliar ancorado**: responde só com os dados do sistema, lista os dados usados, proíbe inventar; busca na web desligada e marcada como não confiável | Alta | Baixa |
| TA6 | Anotações por **fases do jogo** (construção, último terço, transições, organização defensiva, bolas paradas) + **SWOT** | Média | Baixa |
| TA7 | Exportar o dossiê como **apresentação** (slides) para a preleção | Média | Média |
| TA8 | IA como **redatora** do dossiê: texto curto gerado a partir dos números já calculados (estilo "wordalisation") | Média | Média |
| TA9 | **Escalação provável** e duelos-chave | Baixa | Alta (não há escalações nas fontes abertas) |
| TA10 | Bolas paradas com dados (cobranças, zonas) | Baixa | Alta (exige scout próprio ou vídeo) |

**Implementar até terça:** TA1–TA5 (alta). TA6 se sobrar tempo. O resto vai para Trabalhos futuros.

## Fontes
- Hudl — workflows de análise pré-jogo: https://www.hudl.com/blog/workflows-pre-match-opposition-analysis
- PFSA — análise de adversário e relatórios: https://thepfsa.co.uk/opposition-analysis/ · https://thepfsa.co.uk/scouting-material/
- World Rugby Passport — SWOT na análise do adversário: https://passport.world.rugby/coaching/developing-your-performance-analysis-skills/analysing-the-opposition/
- Footure — curso de análise de desempenho (estrutura do departamento; análise tática coletiva por fases): https://footure.com.br/wp-content/uploads/2024/05/Curso-Analise-Desempenho-Footure-Aula-07-A-Estrutura-do-Departamento-de-Analise.pdf · https://footure.com.br/wp-content/uploads/2024/05/Curso-Analise-Desempenho-Footure-Aula-03-Analise-Tatica-Coletiva-e-Individual.pdf
- Relatório de estágio (U. Lisboa) com modelo de relatório de adversário: https://repositorio.ulisboa.pt/bitstreams/9f066a4a-da21-4baf-be3a-119a8a388d94/download
- Opposition pack em uma página: https://www.womenssoccercoaching.com/coaching-advice/how-to-create-an-opposition-pack-for-your-team
- Coach Logic — exemplo de análise de adversário: https://coach-logic.com/blog/an-example-of-effective-opposition-analysis
- SciSports — análise de adversário (bolas paradas): https://scisports.com/services/opponent-analysis
- Hudl StatsBomb (pressão, bolas paradas): https://www.hudl.com/en_gb/products/statsbomb/platform
- Twelve Football / wordalisation (arXiv): https://arxiv.org/html/2504.00767v1
- Sevilla FC + Llama/IBM: https://about.fb.com/news/2025/02/sevilla-football-club-llama-ibm-watsonx-scout-players/
- Databricks "La Pizarra": https://www.startuphub.ai/ai-news/technology/2026/databricks-builds-ai-soccer-coach
