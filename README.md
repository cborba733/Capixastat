# CapixaStat — Plataforma de Análise de Desempenho do Futebol Capixaba

Plataforma web de análise de desempenho voltada aos clubes do Espírito Santo: estatísticas de atletas e clubes,
análise de partidas, estúdio tático, preparação física e análise de vídeo, usando dados reais da temporada 2026.

Projeto Integrador 2 — Análise e Desenvolvimento de Sistemas — FAESA · Autor: **Caio Borba**

📄 **Relatório completo do projeto:** [docs/relatorio_pi2_capixastat.pdf](docs/relatorio_pi2_capixastat.pdf)
(também em [Word](docs/relatorio_pi2_capixastat.docx))

---

## Como abrir

1. Baixe os dois arquivos deste repositório para a mesma pasta: **`CapixaStat_v5.html`** e **`konva.min.js`**
   (ou use *Code → Download ZIP*).
2. Abra `CapixaStat_v5.html` no Google Chrome ou no Microsoft Edge (é preciso estar conectado à internet, porque os
   gráficos e as exportações usam bibliotecas carregadas da web).
3. Na tela de login, clique em **Usar sem servidor (modo local)**. Um assistente pede o seu clube e a sua função e
   sugere por onde começar. Nesse modo, o que você registra fica salvo no próprio navegador.

> A plataforma foi feita para uso em computador. Com a API publicada, o login com conta salva tudo no banco de
> dados e libera os perfis de acesso descritos abaixo.

---

## O problema

Os clubes capixabas não têm acesso a ferramentas de análise de desempenho compatíveis com sua realidade: as
plataformas do mercado (Wyscout, InStat, StatsBomb) são caras e voltadas a grandes clubes, e as competições do
estado não têm dados públicos de eventos de jogo. O CapixaStat oferece essas análises a baixo custo, em português,
e cria dentro da própria plataforma os dados que não existem em fontes públicas.

**Público-alvo:** técnicos, analistas de desempenho, preparadores físicos, departamentos médicos, scouts, dirigentes,
atletas (inclusive da base) e estudantes da área.

**ODS da ONU:** 4 (Educação de Qualidade), 8 (Trabalho Decente e Crescimento Econômico), 9 (Indústria, Inovação e
Infraestrutura) e 10 (Redução das Desigualdades).

---

## Funcionalidades

### Clube
- **Visão Geral:** último e próximo jogo, forma recente (V/E/D), alertas da semana (lesão, carga e cartões) e
  indicadores do clube. Cada gráfico tem o selo "Métrica", que explica o que ele mede e se o dado é real.
- **Meu Time:** destaques do elenco, disponibilidade, gols marcados e sofridos por faixa de 15 minutos, radar de
  estilo em percentis entre os clubes capixabas e **ranking de força Elo** com gráfico de evolução.
- **Partidas:** jogos e resultados reais de 2026 com linha do tempo de gols, cartões e substituições, e a aba
  **Scout ao Vivo**: o analista clica no campo para registrar cada ação (finalização, passe-chave, drible, desarme,
  interceptação, falta, cartão) com o minuto. Daí saem o **xG** de cada chute, o mapa de finalizações, a **nota do
  jogo** de cada atleta (fórmula pública) e o gráfico de **momentum**. Exporta em CSV.
- **Análise de Vídeo (experimental):** lê o arquivo de posições gerado pela visão computacional e mostra uma visão
  de cima sincronizada ao vídeo, posições médias, mapa de calor e compactação.

### Jogadores
- **Vitrine:** busca com filtros (posição, idade, minutos, competição, últimos 5 jogos), filtros salvos, lista de
  observação e exportação em CSV.
- **Perfil do Atleta:** números **por 90 minutos** (mínimo de 270 minutos), percentil contra a mesma posição,
  radar de atributos, relatório de observação, maturação biológica (atletas da base) e card para compartilhar em
  PNG ou PDF.
- **Ranking, Comparativo** (tabela lado a lado com diferença colorida) e **Estatísticas** da competição.

### Preparação
- **Formação:** microciclos salvos e reaplicáveis, sessões de treino, **registro diário de carga (sRPE)** e de
  **bem-estar (índice de Hooper)** com semáforo, **ACWR** como alerta, evolução física e **avaliação
  antropométrica** com corpo clicável (frente e costas) e medidas no padrão **ISAK**.
- **Meu dia:** tela do próprio atleta para responder o bem-estar antes do treino e o esforço depois.
- **Estúdio Tático**, com três abas:
  - **Campo:** prancheta com formação, funções e comportamentos com e sem bola, e predefinições salvas;
  - **Lance animado:** jogadas em quadros com legenda, medição de **compactação** (área, profundidade e distância
    entre linhas em metros), biblioteca de lances e exportação em vídeo MP4;
  - **Sobre vídeo:** desenho e anotação em cima de imagem ou vídeo de jogo.
- **Dossiê do Adversário:** resumo de uma página para a preleção (3 chaves do jogo tiradas dos dados reais,
  últimos jogos, casa × fora, Elo, confronto direto, lances salvos), gols por faixa de tempo, jogadores perigosos,
  anotações por fases do jogo e matriz SWOT. Exporta em PDF.
- **Auxiliar Tático com IA (Google Gemini):** responde perguntas usando só os dados do sistema e informa quais
  dados usou (requer chave do próprio usuário).

### Em todas as telas
- Barra de contexto (clube, competição e temporada) e filtro por competição.
- Tema escuro e claro, ícones Lucide, acessibilidade (contraste, navegação por teclado, tabela alternativa para
  cada gráfico) e assistente de primeiro acesso.

---

## Integridade dos dados

Todo número da plataforma diz de onde vem, com os selos **Dado real**, **Medido**, **Estimativa** e
**Não verificado**. Nada é inventado: lesões, carga, condição física e medidas corporais só aparecem quando são
registradas pela comissão ou pelo atleta; sem registro, a tela mostra "sem registro". O perfil tático dos
adversários aparece como "não verificado" até a comissão confirmar.

---

## Dados

- **Temporada 2026 real:** mais de 760 atletas dos 10 principais clubes capixabas e de adversários de outros
  estados; 136 partidas do Campeonato Capixaba, Copa Espírito Santo, Copa Verde, Série D e Copa do Brasil, com
  placares, eventos e estatísticas oficiais quando disponíveis.
- **Fontes:** SofaScore e FlashScore (placares, eventos e estatísticas), Transfermarkt e ogol (estatísticas
  individuais), **TheSportsDB** (importação automática diária com fonte e data registradas) e **StatsBomb Open
  Data** (treino do modelo de xG).

## Métricas e métodos

| Métrica | Como é calculada |
|---|---|
| Por 90 minutos e percentis | valor × 90 / minutos (≥ 270 min); percentil contra a mesma posição |
| xG | regressão logística (distância e ângulo) treinada com 794 chutes do StatsBomb Open Data |
| Elo | base 1500, K = 20, +60 para o mandante, peso pelo saldo de gols (ELO, 1978) |
| Nota do jogo e momentum | pesos públicos por ação registrada no Scout ao Vivo |
| Compactação | fecho convexo dos jogadores de linha e distância entre as linhas, em metros |
| sRPE e ACWR | esforço 0–10 × minutos (FOSTER et al., 2001); carga aguda ÷ crônica, zona 0,8–1,3 |
| Bem-estar | índice de Hooper (4 a 28): até 13 liberado, 14–19 atenção, 20+ treino restrito |
| Antropometria | perímetros e dobras ISAK; % de gordura estimado (Jackson & Pollock + Siri) |
| Maturação | distância até o pico de crescimento (Mirwald 2002 / Moore 2015) |

---

## Arquitetura do projeto

| Parte | Tecnologias | Situação |
|---|---|---|
| Plataforma (este repositório) | HTML5, CSS3, JavaScript, Chart.js, Konva, html2canvas, jsPDF, Lucide | funciona sozinha, no navegador |
| API | Node.js, Express, JWT, bcrypt, PostgreSQL (Supabase), OpenAPI | 8 perfis de acesso, 9 testes, pronta para o Render |
| Serviço de cálculos | Python, FastAPI, Pandas | percentis, Elo e xG com as mesmas fórmulas da plataforma; 8 testes |
| Visão computacional | Python, YOLOv8, ByteTrack, NumPy (homografia e KMeans) | prova de conceito; 14 testes com dados sintéticos |

**Perfis de acesso da API:** técnico, analista de desempenho, preparador físico, médico/fisioterapeuta, scout,
diretor, atleta (só vê e registra os próprios dados) e estudante.

Este repositório contém o necessário para abrir e usar a plataforma e o relatório do projeto (pasta `docs`). A API,
o serviço em Python e a prova de conceito de visão computacional fazem parte do projeto e estão descritos no relatório.

---

## Limitações e próximos passos

- A visão computacional ainda não foi validada com vídeo real de jogo; o próximo passo é gravar com câmera fixa e
  alta, que permite calibrar o campo uma vez por estádio.
- Dados físicos dependem do registro da comissão; a aba de carga semanal ainda é estimada (sinalizada).
- O Auxiliar Tático depende de uma chave do Google Gemini.
- Planejado: testes físicos com protocolo (salto, sprint, Yo-Yo), corpo em 3D na antropometria, dossiê em
  apresentação e modelos preditivos de risco de lesão.

---

Vídeo de apresentação: https://youtu.be/qr0UMUFSi3o
