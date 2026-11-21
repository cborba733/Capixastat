# CapixaStat — Relatório do que foi feito (v4 → v5)

> Para colar em outro chat como contexto. Data: 21/11/2026. Entrega do projeto: terça 24/11/2026.

## 1. Contexto do projeto
- **CapixaStat**: plataforma web de análise de desempenho do futebol capixaba — Projeto Integrador 3 (PI3), curso de
  ADS da FAESA. Autor: Caio Borba. Alinhado aos ODS 4, 8, 9 e 10.
- Base: `CapixaStat_v4.html` (SPA num arquivo só: HTML/CSS/JS, Chart.js 4.4.1, Konva, html2canvas, jsPDF) +
  `backend/` (Node/Express, JWT + bcrypt, PostgreSQL no Supabase). O protótipo em React (`web-react/`) está **parado**.
- O tema **patrocínio foi removido** do projeto inteiro (v4, README e React), a pedido do autor.

## 2. Etapas anteriores (antes de programar)
1. Leitura do relatório do PI3, dos relatórios e dos arquivos do projeto; resumo da v4.
2. Pesquisa de referências: vídeos analisados (canal do Fernando Tancredi, @estudandofutebol), TaKampinho, Catapult,
   SkillCorner, CBF Academy, GE, FootSim, Estúdio de Dados, StatsBomb etc.
3. **`PROPOSTA_MELHORIAS.md`**: 67 itens por módulo, com prioridade e dificuldade — aprovados em 20/11/2026.
4. **`CLAUDE.md`**: memória do projeto (regras, status por item, notas técnicas, pendências, trabalhos futuros).

## 3. Regras combinadas com o autor
- Trabalhar em **`CapixaStat_v5.html`**; **a v4 não foi alterada** (backup em `backup/CapixaStat_v4_original.html`,
  conferido byte a byte no fim).
- Implementar todos os itens sem pedir aprovação item a item; **um commit por item**, com o código do item na mensagem.
- Testar após cada item (sintaxe com `tools/checkjs.py` + teste no navegador, sem erro no console).
- **Integridade dos dados**: nada inventado. Dado real tem selo "Dado real"; modelo/aproximação tem selo "estimativa".
  Dados falsos da v4 (eventos fictícios, estatísticas simuladas) foram removidos.
- Dados externos só de fontes que permitem acesso (API/dados abertos), sem burlar bloqueios nem fazer scraping;
  importação para o banco 1×/dia; fonte e data mostradas na tela; chaves só no `.env`.
- **Só PC** (decidido em 21/11): sem layout/teste para celular a partir daí.

## 4. O que foi implementado (todos os 67 itens — ✅)

### Visão Geral (Dashboard)
- **D1** hierarquia KPIs → gráficos → tabelas; card Próximo jogo e forma (V/E/D). **D2** Alertas da semana (ACWR,
  pendurados, lesionados). **D3** chip "Métrica" em cada gráfico explicando o que mede e se é real/estimado.
  **D4** seletor global de competição/temporada que filtra as telas.

### Atletas (Vitrine, Perfil, Comparativo)
- **A1** busca com filtros principais + "mais filtros" + filtros salvos. **A2** componente único de tabela (coluna fixa,
  ordenação, dicas, ícones de status). **A3** números por 90 min (mín. 270 min) + percentil na posição. **A4** selo de
  dado estimado. **A5** lista de observação + CSV. **A6** recorte "últimos 5 jogos" (eventos oficiais). **A7** relatório
  de observação estruturado. **A8** card do atleta em PNG/PDF com a marca. **A9** Nota CapixaStat do jogo com fórmula
  pública (base 6,0 + pesos). **A10** comparativo em tabela lado a lado com diferença colorida.

### Partidas e Scout
- **P1** linha do tempo redesenhada (sem eventos fictícios). **P2** Scout ao Vivo: clicar no campo marca ações com
  minuto (dado próprio do Capixabão). **P3** mapa de finalizações + xG por chute (modelo treinado no StatsBomb Open
  Data). **P4** gols e cartões por faixa de 15 min. **P5** craque da partida e presets de estatística (sem números
  simulados). **P6** gráfico de momentum (saldo das ações a cada 5 min, pesos públicos).

### Preparação física (Formação)
- **F1** carga por sRPE. **F2** bem-estar diário (índice de Hooper) com semáforo. **F3** ACWR como alerta, com opção
  EWMA e limitações. **F4** microciclos salvos e reaplicáveis. **F5** tela "Meu dia" do atleta (entra direto nela).
  **F6** maturação/PHV (Mirwald 2002 ou Moore 2015) e curva de crescimento para atletas de até 18 anos.

### Meu Time
- **T1** vitrine do clube (forma, próximo jogo, destaques). **T2** elenco com disponibilidade e minutagem.
  **T3** ranking Elo dos clubes (K=20, mando +60, peso por saldo de gols) com gráfico. **T4** radar de estilo em
  percentis entre os clubes capixabas.

### Táticas e ferramentas
- **X1** Simulador de Lances em quadros com legenda e animação. **X2** anotações do estudo ligadas ao Dossiê.
  **X3** compactação (polígono do bloco e distância entre linhas). **X4** Dossiê do Adversário com "como marcam e
  sofrem gols", também no PDF.
- **Q1** biblioteca de lances (busca, tags, partida). **Q2** telestração com spotlight e ligação entre jogadores.
  **Q3** exportar o lance animado em vídeo MP4/WebM. **Q4** rodapé da marca em todas as exportações.

### Backend e dados
- **B1** API publicável (`render.yaml`) e sincronização com a nuvem do que ficava só no navegador (táticas, lances,
  filtros, relatórios, microciclos, anotações, medidas…). **B2** perfis de acesso (técnico, analista, preparador,
  médico, scout, diretor, atleta, estudante) via JWT + middleware. **B3** tabela de eventos de jogo (formato
  StatsBomb). **B4** tabelas de sRPE e bem-estar. **B5** serviço Python FastAPI + Pandas (`servico-python/`) com
  percentis, Elo e xG — conferido: Elo idêntico ao da tela nos 136 jogos reais. **B6** validação, erros em JSON,
  Swagger (`/api/docs`) e testes. **B7** fonte e data de cada dado importado, mostradas na tela.
- **Dados externos:** importador do **TheSportsDB** (Capixabão e Série D), com limite de requisições, gravação no
  banco, rotina diária e tabela calculada pelos jogos quando a fonte devolve a classificação incompleta. Testado com
  os 45 jogos reais do Capixabão 2026.

### Visão computacional (`poc-cv/`) e análise em Python
- **V1** homografia com 4 cliques (pixels → metros, DLT em numpy). **V2** separação de times pela cor do tronco
  (KMeans) e descarte de banco/torcida. **V3** CSV de posições → posições médias, mapa de calor real e compactação na
  plataforma. **V4** aba **Análise de Vídeo** (vídeo + "visão de cima" sincronizada). **V5** modelo de xG com
  StatsBomb Open Data (`analise-python/`). **V6** seção para o relatório sobre limites da câmera móvel e alternativa
  de câmera fixa (`docs/relatorio_secao_visao_computacional.md`).

### Identidade visual, layout, movimento e acessibilidade
- **I1** cores separadas por papel (marca, status, paleta de dados). **I2** tipografia (títulos, corpo, números
  tabulares). **I3** logo e rodapé de marca. **I4** guia de componentes (tela `guia`).
- **L1** menu agrupado por tarefa. **L2** padrão de página. **L3** barra de contexto (clube · competição · temporada)
  no topo de todas as telas. **L4** assistente de primeiro acesso (clube → função → por onde começar).
- **M1** destaque da série ao passar o mouse nos gráficos. **M2** contadores animados, esqueleto de carregamento,
  aviso "salvo". **M3** selo "editado" em filtros e lances salvos. **M4** respeita `prefers-reduced-motion`.
- **R1** contraste AA. **R2** tamanhos mínimos de fonte. **R3** responsividade (feita antes da decisão "só PC").
  **R4** foco visível, navegação por teclado, nomes acessíveis, tabela alternativa para cada gráfico.
  **R5** gráficos com contraste e marcadores que não dependem só de cor.

## 5. Revisão final e testes
- 17 telas percorridas nos temas escuro e claro: **nenhum erro de JavaScript** (só avisos 403/CORS de fotos e escudos
  externos, que já existiam na v4).
- Bug herdado da v4 corrigido: a tela **Ranking** só aparecia depois de clicar numa aba.
- Teste de ponta a ponta com o backend: cadastro/login, sincronização de documentos, registros de sRPE (incluir e
  apagar) e o fluxo do atleta.
- Testes automáticos: **backend 9** (`npm test`), **serviço Python 8** (`pytest`), **visão computacional 14**
  (`pytest`). Sintaxe do HTML conferida com `tools/checkjs.py`.
- Git local com **~72 commits** (sem repositório remoto).

## 6. Onde está cada coisa
| Caminho | O que é |
|---|---|
| `CapixaStat_v5.html` | plataforma (entrega) |
| `CapixaStat_v4.html` / `backup/` | versão anterior, intacta |
| `backend/` | API Node (rotas auth, players, matches, registros, dados, eventos, fontes), `schema.sql`, testes, OpenAPI, importador TheSportsDB |
| `servico-python/` | FastAPI + Pandas (percentis, Elo, xG) + testes |
| `poc-cv/` | YOLOv8 + ByteTrack, homografia, separação de times, testes |
| `analise-python/` | modelo de xG (StatsBomb Open Data) |
| `docs/relatorio_secao_visao_computacional.md` | texto pronto para o relatório |
| `PROPOSTA_MELHORIAS.md` | proposta aprovada |
| `CLAUDE.md` | memória do projeto: regras, status, notas por item, trabalhos futuros |
| `render.yaml` | publicação no Render (API + serviço Python opcional) |

## 7. Pendências que dependem do autor (não de código)
1. Rodar `backend/schema.sql` no Supabase.
2. Publicar a API no Render pelo `render.yaml` e preencher `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`.
3. Colar no relatório do PI3 a seção `docs/relatorio_secao_visao_computacional.md`.
4. (Opcional) Criar conta na API-Football e pôr `API_FOOTBALL_KEY` em `backend/.env`.

## 8. Limites e trabalhos futuros
- **Visão computacional não foi rodada em vídeo real** (máquina sem GPU nem `ultralytics`): V1–V4 foram testados com
  dados sintéticos e um YOLO falso. Falta testar com um clipe de jogo capixaba.
- GIF do lance (hoje é MP4/WebM); recalibração automática da câmera e reidentificação de jogadores; Scout das ações do
  adversário; dados físicos reais (abas Físico/Antropometria e alguns eixos do radar seguem estimados); mais fontes de
  dados (só TheSportsDB está na rotina); a plataforma ainda não chama a API do serviço Python; selo "editado" ainda
  não existe no Quadro Tático; React parado.

## 9. Rodada 2 (21/11/2026)
1. **Navegação:** "Estúdio Tático" com abas Campo / Lance animado / Sobre vídeo; Scout ao Vivo dentro de Partidas;
   Análise de Vídeo com selo Experimental; biblioteca de lances em janela nas abas que salvam lances.
2. **GitHub:** publicado em https://github.com/cborba733/Capixastat (histórico unido sem force push; sem `.env`).
3. **Sem emojis:** todos trocados por ícones Lucide (SVG, licença ISC) com o mesmo estilo.
4. **Táticas:** avaliação e pesquisa em `docs/PROPOSTA_TATICAS.md`; Dossiê com "Resumo para a preleção" (3 chaves do
   jogo, números reais, confronto direto, lances ligados), perfil tático marcado como não verificado/informado pela
   comissão, anotações por fases do jogo + SWOT, Auxiliar Tático ancorado nos dados. Corrigido o PDF do dossiê.
5. **Formação:** avaliação em `docs/PROPOSTA_FORMACAO.md`; Antropometria e Evolução Física **inventavam números** —
   substituídas por medidas reais (ISAK) com corpo em SVG clicável (frente/costas). O 3D ficou para depois.
