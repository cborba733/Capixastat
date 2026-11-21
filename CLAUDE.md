# CapixaStat — memória do projeto

Projeto Integrador 3 (FAESA, ADS), autor Caio Borba. Plataforma web de análise de desempenho
do futebol capixaba (ES), alinhada às ODS 4, 8, 9 e 10. Projeto acadêmico, desenvolvido sozinho;
o autor sabe Python e Java em nível básico, então explique decisões técnicas e prefira soluções simples.

**Regra de trabalho:** não implementar nada sem aprovação explícita do Caio. Propor, esperar o "ok", depois fazer.
**Princípio do projeto:** separar sempre dado real de estimativa (na tela e na documentação). Se um
número não for confiável, não exibir (ex.: projeção de campanha e heatmap de câmera móvel foram removidos).

## Onde está cada coisa

| Caminho | O que é |
|---|---|
| `CapixaStat_v4.html` | **Versão principal e mais atual (v4).** SPA em um único arquivo (~2,3 MB, ~13,8 mil linhas): HTML+CSS+JS puro, Chart.js 4.4.1, html2canvas+jsPDF, Konva (`konva.min.js` local). Dados reais embutidos (~765 atletas, linhas ~3.000–3.700). Abre direto no navegador. |
| `backend/` | API Node.js + Express, JWT + bcrypt, PostgreSQL no Supabase. Rotas: `/api/auth` (register, login, me), `/api/players` (CRUD), `/api/matches` (GET/POST/PUT), `/api/ping`. Schema em `schema.sql` (users, players com `dados JSONB`, matches com `stats JSONB`). A v4 aponta para `https://capixastat.onrender.com`. |
| `web-react/` | Protótipo de migração em React 19 + Vite + TypeScript + Recharts + react-router. **Bem inicial**: 5 páginas (Dashboard, Vitrine, Perfil, Scout, Login) com `mockData.ts`, sem integração com o backend. |
| `poc-cv/` | POC de visão computacional: YOLOv8 + ByteTrack (notebook Colab + `example_tracking.py`). Detecta e rastreia jogadores e bola e separa times pela cor da camisa. Roda fora da plataforma (precisa de GPU). |
| `relatorio_pi3_capixastat.pdf` | Relatório oficial do PI3 (visão geral do projeto). |
| `CapixaStat_PreProjeto.*` | Apresentação do pré-projeto (7 slides). |
| `preproj_*.png/jpg` | Prints das telas atuais (perfil, quadro tático, YOLO). |

Relatórios de andamento (fora do repo, em `E:\`): set/2026 (radar real, Índice Ofensivo, ACWR,
Copa ES/Série D reais) e out/2026 (Quadro Tático/telestração, indicadores calculados, perfil
reorganizado, dashboard real, POC YOLOv8).

## Navegação da v4 (`goTo('<tela>')`, divs `#screen-<tela>`)

- **Principal:** Dashboard (KPIs do clube, gols por rodada, Top 5, partidas reais, insight automático)
- **Atletas:** Vitrine de Jogadores · Cadastrar Atleta (stats reais → radar/score/índice) · Perfil do Atleta
  (abas Visão Geral, Desempenho, Estatísticas, Evolução, Histórico; radar, percentil por posição,
  jogadores similares por cosseno, score 0–100, exportar PDF)
- **Análise & Dados:** Partidas (Capixabão, Copa ES, Copa Verde, Série D; detalhe com stats/H2H/classificação)
  · Estatísticas (rankings e filtros) · Ranking · Comparativo
- **Outros:** Formação (Microciclo, Sessões, Carga com ACWR, Evolução Física, Antropometria) · Meu Time
  (hero, calendário, classificação, forma, elenco) · Táticas (prancheta de formação, Dossiê do Adversário
  com heurísticas + Gemini, chat tático com IA) · Quadro Tático (telestração em imagem/vídeo com Konva)
- Login/cadastro via backend, sessão persistente, tema claro/escuro.
- Design atual: tema escuro padrão (azul-acinzentado `#0a0f18`), verde `#22c55e` como cor de destaque,
  fontes DM Sans / Space Grotesk / JetBrains Mono, sidebar fixa de 240px, cards arredondados.

## Status da v4 (nov/2026)

**Pronto:** todos os módulos acima; dados reais de jogos (gols, assistências, cartões, partidas) a
partir de SofaScore/FlashScore/Transfermarkt/oGol; radar, Índice Ofensivo, score e indicadores calculados;
ACWR; dossiê com IA; telestração; backend com auth; POC YOLOv8.

**Simulado/ilustrativo:** antropometria, flexibilidade, carga/intensidade (dependem de parceria com
clubes); eixo "Dribles" do radar (baseline por posição); "Físico"/"Consistência" são proxies de jogos
disputados; mapa de calor do perfil é ilustrativo.

**Fora do escopo (decisão do Caio, nov/2026):** o módulo Captação de Patrocínio foi descartado.
Não propor nem implementar nada de patrocínio. Já foi removido da v4 (comentário), do README e do
protótipo React (link no menu e card do Dashboard). Ocorrências de "Patrocínio"/"Patrocinense" nos
dados da v4 são cidade/clube reais e devem ficar.

**Planejado e não feito:**
- Python/Pandas/NumPy na análise de dados (só existe na POC de visão computacional).
- xG/ELO, modelos preditivos (risco de lesão, resultado, clustering tático), recomendação de jogadores
  além do "similares".
- Visão computacional integrada à plataforma (homografia, heatmap real, aba de Análise de Vídeo).
- Controle de acesso por perfil (técnico, preparador, médico, diretor); notificações por e-mail;
  integração GPS.
- Migração completa para React.
- Responsividade real para celular (há poucos `@media`, pensados para tablet/notebook).

**Observação:** o pedido inicial citava "MySQL/PostgreSQL"; o projeto usa só **PostgreSQL (Supabase)**.
A coleta automática no SofaScore passou a ser bloqueada (403).

## Pesquisa de referências (nov/2026), resumo

- **TaKampinho** (takampinho.vercel.app, @jtakaa_): prancheta tática com tema escuro, títulos em fonte
  condensada itálica, amarelo como cor de marca, jogadores como círculos com número/iniciais, barra de
  ferramentas lateral, assistente "Novo jogo" em 6 passos, simulador com quadros Q1/Q2/Q3 + legenda por
  lance, abas Prancheta/Anotações/Jogo, card do jogador com eventos (gol, assistência, cartões,
  substituição + minuto) e anotações, exportação em imagem/vídeo com rodapé da marca.
- **Vídeos (Cahú Scouting / Footure):** SofaScore (attack momentum, heatmap, notas), WhoScored (estatísticas
  de time, recorte por período do jogo, chalkboard de ações), FBref (por 90 min + percentil, jogadores
  similares, comparação), Infogol/Understat (mapa de xG com círculo proporcional), FootStats (interações
  entre jogadores), Tactical Pad / Metrica Play / KlipDraw (telestração).
- **TikTok @estudandofutebol:** simulações 2D/2.5D animadas com título-pergunta, rótulo do conceito e
  legenda por quadro, em versão clara e escura. É uma referência direta para "lance animado" com legenda.
- **Mercado:** Catapult (carga/Player Load), SkillCorner (tracking por vídeo de transmissão; "Metric
  Explainer" para documentar cada métrica), CBF Academy (competências: análise de treino/jogo/adversário,
  coleta e visualização, IA/preditiva, scouting), GE (55% da Série A tem setor de Analytics; dado
  complementa o vídeo). FBref perdeu os dados avançados da Opta em jan/2026; usar StatsBomb Open Data
  + mplsoccer para POCs em Python.
- **Fontes extras (pesquisadas por conta própria):** SofaScore (rating, attack momentum, radar de
  atributos), Wyscout/InStat (filtros → longlist/shortlist, índice com corte de minutos e comparação
  por posição), FBref/StatsBomb (por 90 + percentil, pizza chart, xG, xT, PPDA), Roboflow sports
  (keypoints do campo + homografia → posições reais, times por cor/KMeans), FotMob (página do time:
  forma em resultados coloridos, próximo jogo, tabela com forma, "melhores do elenco", XI da
  temporada com notas, estádio), ClubElo (Elo com mando de campo e saldo de gols), sRPE de Foster +
  índice de Hooper (carga interna e bem-estar com questionário, sem GPS), críticas ao ACWR (Impellizzeri)
  e a variante EWMA, maturação/PHV na base, Veo (câmera com IA barata para clubes amadores),
  Supabase RBAC/RLS (papéis por perfil), FastAPI + Pandas como microserviço Python ao lado do Express,
  Friends of Tracking / Soccermatics / McKay Johns (tutoriais de Python), acessibilidade (WCAG 1.4.11:
  contraste 3:1 em gráficos, não depender só de cor), TCCs brasileiros (FUTS3/IFPB, scout com FBref).

- **Canal @fernando_tancredi (FootSim, 6 vídeos):** UX de tabelas (filtros principais + "mais filtros",
  filtros/layouts salvos, nome fixo ao rolar, ordenar no cabeçalho, números à direita, cores por faixa,
  ícones de status junto ao nome, pontilhado = dado incerto), pós-jogo (linha do tempo, momentum com
  hover, craque do jogo, posse por zona, ameaça por corredor, presets de estatísticas), identidade
  visual minimalista (ícones Phosphor, teste de fontes), scouting por nível de conhecimento, treino
  coletivo × individual e rotinas salvas.
- **@estudandofutebol (7 de 10 baixados; 3 eram carrossel de fotos e falharam):** zonas de finalização
  (≈4/100 gols na lateral da área × ≈30/100 na pequena área central, Brasileirão 2026), PSxG para
  goleiros, compactação como polígono, passe classificado por efeito (mantém/progride/gera risco),
  papel do analista. O autor mantém o **Estúdio de Dados** (brasileirao.estudandofutebol.com.br):
  abas Classificação/Placares/Times/Jogadores/Mapa de Influência/Comparar, chip "Métrica" explicando
  cada tela, Exportar, vitrine de clube e de jogador — a referência mais próxima do CapixaStat.
- **Acessibilidade da v4 (medido):** `--text-3` tem contraste 3,3:1 (escuro) e 2,6:1 (claro), abaixo
  de 4,5:1; ~300 usos inline de fonte 9–12px.

## Melhorias aprovadas

Proposta completa (Etapa 3) em **`PROPOSTA_MELHORIAS.md`**. **Todos os itens foram aprovados**
(20/11/2026). Entrega: **terça 24/11/2026**. Segunda à noite: parar de criar coisas novas, só
revisar/corrigir; o que faltar vai para "Trabalhos futuros" abaixo.

### Regras combinadas para a implementação
- Trabalhar em **`CapixaStat_v5.html`**. **Não alterar a v4.** O React (`web-react/`) está parado.
- **Só PC (21/11):** o CapixaStat é um site web para computador. Não fazer layout nem teste para celular;
  o que já existe de responsivo pode ficar, mas não é mais critério de aceite.
- Backup do estado original: `backup/CapixaStat_v4_original.html` + commit `b450ed6`
  ("backup antes das melhorias"). Git local (sem remoto configurado), `core.autocrlf=false`.
- **Um commit por item**, com o ID na mensagem (ex.: "R1: ajuste de contraste").
- Depois de cada item: abrir a v5 e checar que não há erro no console (os 403 de fotos de
  jogadores em CDNs externos já existiam na v4 e podem ser ignorados).
  Teste: servidor estático `python -m http.server 5510` na pasta do projeto, abrir
  `http://localhost:5510/CapixaStat_v5.html`; para entrar sem backend, no console:
  `localStorage.setItem('capixastat_token','teste-local'); localStorage.setItem('capixastat_current', JSON.stringify({nome:'Caio Borba', clube:'Rio Branco ES', funcao:'Analista de Desempenho'}))` e recarregar.
  Teste rápido de todas as telas: chamar `goTo(id, navEl)` para cada `.nav-item[data-screen]`.
- Ordem: prioridade Alta (primeiro R1, I1, L1, I4; depois dificuldade baixa → média → alta),
  depois Média, depois Baixa. Resumo curto ao Caio a cada bloco.
- **Dados externos** (depois dos itens Alta): só fontes que permitem acesso (API oficial/plano
  gratuito, dados abertos, download). Nada de burlar bloqueio (403 do SofaScore) nem scraping
  proibido pelos termos. Rotina que busca → salva no PostgreSQL → atualiza 1x/dia ou por rodada; telas
  leem do banco. Registrar fonte e data (B7) e mostrar na tela. Chaves só em `.env` (nunca no
  HTML/git) — se precisar de cadastro, pedir ao Caio. Mínimo aceitável: 1 fonte + 1 competição.

### Status dos itens (✅ feito · ⏳ em andamento · ⬜ pendente)
**Alta:** ✅ R1 · ✅ I1 · ✅ L1 · ✅ I4 · ✅ D1 · ✅ D2 · ✅ D3 · ✅ A4 · ✅ P1 · ✅ F1 · ✅ F2 · ✅ T1 · ✅ B4 ·
✅ A1 · ✅ A2 · ✅ A3 · ✅ B1 · ✅ B2 · ✅ B3 · ✅ L2 · ✅ R2 · ✅ R3 · ✅ V1 · ✅ X1 · ✅ P2
**Dados externos:** ✅ pesquisa de fontes · ✅ integração TheSportsDB (rotina + banco + fonte/data na tela)
**Média:** ✅ A5 · ✅ A7 · ✅ A8 · ✅ P4 · ✅ P5 · ✅ F3 · ✅ F4 · ✅ T2 · ✅ T3 · ✅ X2 · ✅ Q2 · ✅ B6 · ✅ V5 ·
✅ I2 · ✅ I3 · ✅ M2 · ✅ M4 · ✅ R5 · ✅ D4 · ✅ A6 · ✅ A9 · ✅ P3 · ✅ F5 · ✅ T4 · ✅ X3 · ✅ Q1 · ✅ B5 ·
✅ V2 · ✅ V4 · ✅ L3 · ✅ M1 · ✅ R4 · ✅ Q3 · ✅ V3
**Baixa:** ✅ A10 · ✅ X4 · ✅ Q4 · ✅ V6 · ✅ M3 · ✅ P6 · ✅ F6 · ✅ B7 · ✅ L4

### Notas por item
- **R1:** `--text-3` escuro `#4a6a7a`→`#8299aa`, `--text-2` →`#a9bccb`; tema claro: text-3 `#56667a`,
  verde `#15803d`, vermelho `#b91c1c`, azul `#0369a1`, âmbar `#b45309`, ciano `#0e7490`; eixos e
  legendas dos gráficos com cor sólida; cores fixas apagadas do Quadro Tático trocadas por tokens.

- **I1:** papéis de cor. Marca = azul da bandeira do ES (`--brand #5b95ff`, botões `--brand-fill #2563eb`
  com texto branco) só na moldura (menu, botões, abas, foco, links). Verde/âmbar/vermelho = só status
  (`--ok/--warn/--danger`). Paleta de dados `--data-1..6`, sequencial `--seq-*`, divergente `--div-*`.
  Rosa da bandeira em `--accent` (uso pontual). Helpers JS: `csVar()`, `csData(i)`, `csStatus(kind)`.
  O verde que aparece no conteúdo gerado por JS continua significando "positivo/vitória".

- **L1:** menu em 3 grupos por tarefa — Clube (Visão Geral, Meu Time, Partidas) · Jogadores (Vitrine,
  Perfil, Ranking, Comparativo, Estatísticas) · Preparação (Formação, Táticas, Quadro Tático). "Cadastrar
  Atleta" saiu do menu (botão na Vitrine). `goTo(id)` agora acende o item sozinho; `NAV_PARENT` mapeia
  telas-filhas (cadastro-jogador → jogadores).

- **I4:** camada de componentes no fim do `<style>` principal: `.cs-metric` (+`.cs-metric-tag`),
  `.cs-status ok|warn|danger|info` (ícone+texto), `.cs-src real|est` e `.cs-est-val` (selo de dado),
  `.cs-section-head`, tokens `--space-*`/`--fs-*`, badges legíveis no tema claro. Tela **Guia visual**
  (`screen-guia`, link no rodapé do menu) documenta cores, tipografia e componentes.

- **D1:** Visão Geral reordenada: topo `#dash-top-row` (próximo/último jogo, forma últimos 5 com
  aproveitamento, alertas) → insight → KPIs → gráficos → tabelas → Metodologia/ODS no fim.
  `renderDashTopRow()` (chamada em `enterApp` e no `goTo('dashboard')`).

- **D2:** card "Alertas da semana" (`renderDashAlerts()`): contagem por tipo + 5 mais graves, clique abre o
  perfil. **`playerCondition(p)`** é a fonte única de status físico (Formação e Alertas usam); hoje vem do
  modelo simulado da v4 (marcado `est`), e `wellnessStatusFor(id)` (F2) sobrescreve com dado real.
  Teste de sintaxe: `python tools/checkjs.py CapixaStat_v5.html` (extrai os `<script>` e roda `node --check`).

- **D3:** `METRIC_NOTES` (id do canvas → texto + real/misto/estimado) e `applyMetricChips()` acrescentam o
  chip "Métrica" ao card de cada gráfico (chamado no `goTo`, no `enterApp` e no `switchFormTab`). Ao criar
  gráfico novo, **adicionar a entrada em `METRIC_NOTES`**.

- **A4:** perfil › atributos: eixos estimados (Dribles, Físico, Consistência, ou todos se o atleta não tem
  estatística real) com barra hachurada + contorno pontilhado + tooltip do motivo e legenda. Formação:
  `applyFormEstBanner(tab)` mostra faixa "Estimado" em Carga/Físico/Antropometria (Carga some quando
  `hasRealLoadData()` — F1 — for verdadeiro). Corrigido bug da v4: `.ov-bar .fil` sem `display:block`.

- **P1:** linha do tempo do detalhe da partida (`openJogoDetail`) refeita: lista única ordenada por minuto,
  separador "Intervalo"/"Fim", placar parcial nos gols, cartão desenhado + texto, substituição ▲/▼, faixa de
  cor (`--data-1` mandante / `--data-2` visitante) + sigla do time, legenda e selo "Dado real". Classes `.tl2-*`.
  **Removido** o gerador de gols/cartões fictícios da tela antiga de partida (v4 inventava eventos).

- **F1/F2 (um commit só — mesma tela):** Formação › aba **Registro diário** (`renderRegistroDiario`).
  F1 sRPE (RPE 0–10 × minutos = UA) → `realWeeklyLoads(id)`; `computeACWR` usa o real quando há carga na
  semana atual e nas 3 anteriores (`est:false`), senão o modelo da v4 (`est:true`). F2 bem-estar Hooper
  (sono, fadiga, estresse, dor 1–7; soma 4–28; ≥14 atenção, ≥20 restrito; checkbox lesão) →
  `wellnessStatusFor(id)` (últimos 2 dias) alimenta `playerCondition`. Armazenamento **`CSStore`**
  (localStorage `capixastat_v5_<coleção>`; coleções `srpe`, `bemestar`) com ganchos `csSyncPush/csSyncDelete`
  para o backend (B4). Aviso flutuante: `csToast(msg)`.

- **T1:** Meu Time › bloco `#time-destaques` (`renderTimeDestaques`): forma últimos 5 + V/E/D da temporada,
  top 3 artilheiros, assistências e score (clique abre perfil). Classificação ganhou coluna **Forma**
  (`teamFormDots(comp, time)` — últimos 5 jogos do time na competição).

- **B4:** tabelas `registros_srpe` e `registros_bemestar` (fim de `backend/schema.sql` — **rodar no Supabase**),
  rota `backend/routes/registros.js` (`GET/POST /api/registros/:tipo`, `DELETE /api/registros/:tipo/:id`, JWT,
  validação). `db.js` aceita **`DB_MEMORY=1`** (pg-mem, banco em memória para testes/dev sem Supabase).
  `server.js` exporta `app` e só escuta quando executado direto. Testes: `cd backend && npm test`
  (node:test, 4 testes). Front: `csSyncPush/csSyncDelete/csSyncPull` (só com token real ≠ 'teste-local').

- **A1:** Vitrine virou busca: escopo "Meu elenco | Toda a base" (765), filtros principais (nome, posição,
  competição, ordem) + "Mais filtros" (clube, idade, minutos, gols, assist., score, só estatística real),
  filtros salvos (localStorage `capixastat_v5_filtros`), "Mostrar mais" de 60 em 60. Helpers
  **`playerAgg(p, comp)`** (soma `p.stats[comp]`: jogos, gols, assists, amarelos, vermelhos, minutos) e
  `COMP_LABELS` (competições do recorte ES: capixabao, copaEs, serieD, copaVerde, c_copa_do_brasil).

- **A2:** componente **`csTable(container, cols, rows, opts)`** (ordenação no cabeçalho com `aria-sort` e teclado,
  coluna `sticky`, `num` à direita com tabular-nums, `title` = dica da abreviação, `range` = cor por faixa,
  sombra ao rolar, `rowClick`). **`playerStatusIcons(p)`**/`csPlayerNameCell(p)` = ícones de lesão/restrição/
  cartões junto ao nome. Usado na Vitrine (visão Cards|Tabela) e no ranking de Estatísticas (top 50).

- **A3:** **`per90(agg)`** (corte `MIN_MINUTOS_90 = 270`; abaixo disso devolve null) e card "Por 90 minutos"
  no Perfil › Desempenho (`renderPer90Card`, chamado por um wrapper de `showPlayer`): G/90, A/90, G+A/90,
  cartões/90 (invertido) com percentil vs. mesma posição (`per90Peers`). Colunas G/90 e G+A/90 nas tabelas.
  A pizza de percentis do radar já existia na v4 (`chartPizza`).

- **B1:** `API_URL` automático (localhost:3001 quando a página está em localhost; senão Render; override
  `localStorage.capixastat_api`). Tabela `documentos` (usuario_id, chave, dados JSONB) + rota `/api/dados`
  (chaves: taticas, taticas_presets, telestracao, fotos, filtros) + `/api/health`. Na v5, `Storage.prototype.setItem`
  é interceptado para as chaves de `CS_CLOUD_KEYS` → `csCloudSchedule` (PUT com debounce) e `csCloudPull()` no
  login; indicador `#cs-cloud` no rodapé do menu. `render.yaml` na raiz para publicar (Blueprint; preencher
  DATABASE_URL, JWT_SECRET, CORS_ORIGIN). JSON até 6 MB. Testado ponta a ponta com o backend em memória.
  **A publicação no Render depende do Caio** (conta dele).

- **B2:** perfis de acesso. Backend `middleware/permissao.js` (`PAPEIS` função→papel, `PERMISSOES` por área,
  `permitir(perm)` lê a função do usuário no banco → 403). Aplicado em players (escrita), matches (escrita) e
  registros (srpe/bemestar). Novas funções no cadastro: "Médico / Fisioterapeuta" e "Atleta" (com `atleta_id`
  vinculado; atleta só registra o próprio bem-estar). `users.atleta_id` (+ `ALTER TABLE ... IF NOT EXISTS`).
  Login devolve `papel` e `atleta_id`. Front: `CS_PAPEIS`/`CS_PERMS` (espelho), `csPapel()`, `csPode(perm)`,
  `applyPermissions()` (esconde botões), Registro diário em modo leitura conforme o papel. 6 testes no backend.

- **B3:** tabela `eventos_jogo` (partida, clube, atleta_id, tipo, resultado, minuto, x, y — 0–100, x=comprimento
  com 100 = gol atacado) + rota `backend/routes/eventos.js` (`GET ?partida=|?clube=`, POST, DELETE; escrita só
  para `eventos:write` = técnico/analista/scout). Front: `CS_SYNC_COLS` mapeia coleção → rota (srpe, bemestar,
  eventos). 7 testes no backend.

- **R2:** fontes mínimas: 9–10,5px → 11px (só micro-rótulos) e 11–11,5px → 12px em todo o arquivo (CSS, inline e
  strings JS; 276 ocorrências); eixos do Chart.js mínimo 11. Ficaram 6,5–8,5px apenas em números dentro de
  círculos pequenos (fichas/avatares). Corpo do texto já era 14px.

- **R3:** responsivo. ≤1024px: KPIs 2 col., cards 3 col. ≤768px: menu vira gaveta (`.cs-hamb` ☰/✕, `body.nav-open`,
  `.cs-nav-scrim`, Esc fecha, clicar num item fecha), topbar quebra linha, grades em 1 coluna, tabelas com rolagem
  horizontal, microciclo rola para o lado, filtros empilhados. ≤420px: cards 1 col. Testado em 375px: nenhuma das
  13 telas tem elemento vazando (`documentElement.scrollWidth = 375`).

- **L2:** padrão de página (cabeçalho → resumo → indicadores → visualizações → detalhes → sobre os dados) com
  `.cs-section-head` na Visão Geral e no Meu Time; padrão documentado no Guia visual.

- **X1:** nova tela **Simulador de Lances** (`screen-simulador`, menu Preparação): campo SVG 105×68 m, 11 do clube
  (azul, top-11 por score) × adversário 4-4-2 (laranja) + bola, arrastáveis (pointer events); quadros Q1…Qn
  com legenda, + Quadro/Duplicar/Excluir, ▶ animação com easing entre quadros (0,5×/1×/2×, Repetir, Rastros
  tracejados, respeita prefers-reduced-motion), salvar/abrir lances (`capixastat_v5_lances`, vai para a nuvem
  como chave `lances`), Exportar PNG com legenda e rodapé da marca. Estado em `SIM`.

- **V1:** `poc-cv/homografia.py` (DLT própria em numpy: `calcular_homografia`, `imagem_para_campo`, `pe_do_jogador`,
  `PONTOS_CAMPO` FIFA 105×68, calibração interativa com 4 cliques no OpenCV → `calib.json`) +
  `example_tracking.py --calib` grava `posicoes.csv` em metros. 7 testes (`python -m unittest test_homografia.py`).
  Testado num venv local com numpy 2.5 / OpenCV 5.1 (a máquina não tem numpy instalado globalmente).

- **P2:** nova tela **Scout ao Vivo** (`screen-scout`, menu Clube): escolhe partida (jogos do clube ou "jogo-treino"),
  atleta, tipo (`SC_TIPOS`: finalização, passe-chave, drible, desarme, interceptação, falta, cartão) e resultado,
  e **clica no campo** (x,y 0–100). Relógio 1º/2º tempo ou minuto manual, Ctrl+Z desfaz, lista + resumo por
  atleta (`csTable`), Exportar CSV. Salva em `CSStore('eventos')` → sincroniza com `/api/eventos` (B3).
  Só `eventos:write` marca. Chave da partida: `compId|mandante|visitante|data`.

- **Dados externos (fontes pesquisadas em 21/11):** TheSportsDB (API pública, chave grátis `123`, sem cadastro —
  Capixabão liga **5686**: jogos/placar/rodada/estádio/escudos/classificação com forma; Série D liga **5079**; ~15
  resultados por consulta e limite de chamadas → buscar **rodada a rodada** com pausa). API-Football cobre o
  Capixabão (liga **611**) com escalações/estatísticas, mas exige conta (100 req/dia) — **aguardando o Caio criar a
  conta** e pôr `API_FOOTBALL_KEY` no `backend/.env`. football-data.org grátis não cobre o ES. SofaScore/
  FlashScore/Transfermarkt/oGol **não** (termos/bloqueio). Wikipedia/Wikidata = reserva para histórico.
  Implementação: tabelas `fonte_partidas`, `fonte_classificacao`, `importacoes` (B7); importador
  `backend/importar/thesportsdb.js` (CLI: `node importar/thesportsdb.js --competicao capixabao --temporada 2026`);
  rotas `backend/routes/fontes.js` (`/api/fontes/status|partidas|classificacao`, `POST /atualizar` p/ técnico/
  analista/diretor); rotina diária com `IMPORT_AUTO=1` (`IMPORT_COMPETICOES`, `IMPORT_TEMPORADA`,
  `IMPORT_INTERVALO_H`). Front: painel "Dados externos" em Partidas (`renderFontesExternas`) com fonte, link e
  data em cada linha + situação da última importação. Testado com importação real (memória).
- **B7:** procedência: tabela `importacoes` (fonte, competição, início/fim, status, registros, mensagem) +
  `atualizado_em`/`fonte_url` em cada linha importada, exibidos na tela.

- **A5:** lista de observação: estrela ☆/★ nos cards e na tabela (`obsToggle`, `capixastat_v5_obs` → nuvem `observacao`),
  escopo "★ Observados" na Vitrine, **Exportar CSV** dos atletas filtrados (`vfExportCSV`, com coluna fonte real/estimado).
  Backend `/api/dados` aceita também: observacao, anotacoes, relatorios, microciclos.

- **A7:** Perfil › aba **Observação**: relatório estruturado (data, jogo, situação → comportamento → consequência,
  fortes, a desenvolver, nota 1–5, recomendação) + histórico por atleta (`renderRelatorios`, `capixastat_v5_relatorios`
  → nuvem `relatorios`). `csEsc()` escapa texto digitado.

- **A8:** botões "Card PNG" e "Exportar PDF" no Perfil (o "Exportar PDF" da v4 não tinha ação): `cardAtletaCanvas(p)`
  desenha 1080×1350 em canvas (iniciais, score, 6 números, radar, rodapé CapixaStat + real/estimado + data) sem
  depender de fotos externas (CORS); PDF via jsPDF.

- **P4:** Meu Time › card "Quando o time marca e sofre" (`clubTiming`, `renderTimeTiming`): gols pró/contra por faixa de
  15 min (barras divergentes `chartTiming`), 1º × 2º tempo, pico de gols e cartões; cobertura "N de M jogos com eventos".
  Chave dos incidentes: `INCIDENTS[compId|home|away|gh|ga]`.

- **Classificação calculada:** o plano grátis do TheSportsDB devolve só 5 times; `GET /api/fontes/classificacao`
  calcula a tabela completa a partir dos jogos importados (`calcularTabela`, `origem:'calculada'` + aviso na tela).
  Importação real testada: 45 jogos do Capixabão 2026, status ok. Mata-mata não existe nessa fonte.

- **P5:** detalhe da partida: "Destaque da partida" (`mdDestaque` — maior participação em gols nos incidentes reais;
  gol=2, assist.=1; não é nota oficial) + presets Todas/Ofensivas/Defensivas (`mdPreset`, `data-cat`). **Removidas as
  estatísticas "simuladas"** que a v4 inventava quando não havia dado oficial (agora aviso + link p/ Scout ao Vivo).
  Teste: usar `?v=algo` na URL para evitar cache do navegador.

- **F3:** ACWR com opção **Média simples | EWMA** (λ=2/(N+1), N=3 semanas; `ACWR_METODO`, `setAcwrMetodo`, salvo em
  `capixastat_v5_acwr`) e texto "leia como alerta, não previsão" citando Impellizzeri (2020–21) na aba Carga.

- **F4:** Microciclo virou planejador (`renderMicrociclo(force)`): semana real (Anterior/Hoje/Próxima — antes não
  funcionavam), + sessão por dia (`MC_TIPOS`), ✕ remove, total de minutos, **Salvar como modelo / Aplicar modelo /
  Excluir modelo** (`capixastat_v5_microciclos` → nuvem `microciclos`). Semana sem dados mostra o MOCK_WEEK como "exemplo".

- **T2:** Meu Time › aba Jogadores: resumo de disponibilidade (disponíveis/lesionados/restritos/3+ cartões, selo estimado),
  ícones de status junto ao nome e minutos jogados por atleta.

- **T3:** Meu Time › "Ranking de força — Elo" (`computeElo`: todos os jogos de `COMPETITIONS` em ordem de data, base 1500,
  K=20, mando +60, peso por saldo `G`), lista dos clubes ES com variação dos últimos 5 jogos + gráfico `chartElo`.

- **X2:** Dossiê do Adversário ganhou "Anotações do estudo" por adversário (fase ofensiva/defensiva, fortes, fracos,
  jogadores-chave; `dsNotesRender/dsNotesSave`, `capixastat_v5_anotacoes` → nuvem `anotacoes`); as anotações entram
  no relatório e no PDF do dossiê.

- **Q2:** Quadro Tático ganhou **Spotlight** (`telAddSpot`: feixe + elipse brilhante) e **Ligação** (`telAddLink`: clique nos
  pontos, duplo clique termina; linha com nós). Salvam/reabrem (`telSerializeNode/telRebuild`) e recolorem.

- **B6:** OpenAPI 3 em `backend/docs/openapi.json`, Swagger em `/api/docs` (swagger-ui via cdnjs), 404 da API em JSON,
  JSON inválido → 400 claro; seção "Backend v5" no README. 9 testes.

- **V5:** `analise-python/xg_statsbomb.py` (treinar com StatsBomb Open Data / aplicar ao CSV do Scout ao Vivo), regressão
  logística própria em numpy com distância (m) e ângulo (rad). `xg_modelo.json`: b0=-2.540, b_dist=-0.0495, b_ang=1.525
  (794 chutes, corr. 0,78 com xG StatsBomb, soma xG = gols). `mapa_chutes.png`. Cache de download no .gitignore.

- **I2:** Barlow Condensed (Google Fonts) em `--font-cond` para títulos de página, de seção, logo (itálico) e KPIs;
  `font-variant-numeric: tabular-nums` nos números. Guia visual atualizado.

- **I3:** logo SVG (bola azul com barras brancas + barra rosa) no menu (`.cs-logo`) e como favicon; regras de uso no Guia
  visual; exportação PNG do Quadro Tático (`telExport`) com rodapé "CapixaStat · Quadro Tático · data". O verde
  próprio do Quadro Tático (`#00e676`) foi trocado pelo azul de marca.

- **M2:** `csCountUp(el, alvo, casas)` nos KPIs da Visão Geral (com `setTimeout` de garantia — rAF pausa em aba oculta),
  `csSkeleton(n)` (shimmer) no carregamento dos dados externos, fade-up nas trocas de aba, transições em botões/cards.

- **M4:** `@media (prefers-reduced-motion: reduce)` zera animações/transições; Chart.js sem animação; rolagem sem
  "smooth"; contador e simulador respeitam `csReduceMotion()`. Teste geral: 15 telas + 6 abas da Formação sem erro.

- **R5:** plugin global Chart.js `csA11y`: no tema claro troca cores antigas fixas (<3:1 no branco) por versões escuras
  (`CS_A11Y_HEX/RGB`, `csA11yColor`); gráficos de linha/radar com várias séries ganham `pointStyle` e `borderDash`
  diferentes por série (não depender só de cor). Status já usa ícone+texto (I4/A2).

- **D4:** seletor global de **competição** no menu (`.ctx-box`, `CS_CTX`, `ctxSet`, `ctxFilter`, salvo em
  `capixastat_v5_ctx_comp`): filtra KPIs/próximo jogo/forma da Visão Geral, Meu Time (destaques com `playerAgg` da
  competição, timing), Vitrine (`vf-comp`) e a aba de Partidas. `CTX_STATS_KEY` mapeia id da competição (`serie-d`) →
  chave das estatísticas (`serieD`). Temporada fixa 2026 (a base só tem 2026).

- **A6:** recorte "Últimos 5 jogos do clube" na Vitrine (`vf-recorte`) e linha de participação recente no card Por 90 do
  perfil. `recentClubForm(p, n)` conta gols/assist./cartões do atleta nos incidentes oficiais dos últimos n jogos do clube
  (respeita o contexto D4); `evNomeBate` casa nome abreviado ("B. Melo") com o cadastro. Minutos não disponíveis nesse
  recorte (avisado na tela). Obs.: `buildPlayerMatches` da v4 só traz jogos com evento — não serve para "últimos 5".

- **A9:** Nota CapixaStat do jogo (`notaDoJogo`, pesos públicos em `NOTA_PESOS`: base 6,0, gol +1,0, no alvo +0,2,
  passe-chave +0,3, drible +0,15, desarme +0,25, interceptação +0,2, erro −0,15, falta −0,1, amarelo −0,5, vermelho −1,5;
  limite 3–10) — coluna "Nota" no resumo do Scout ao Vivo + fórmula na tela. Só usa ações marcadas (sem escalação
  não dá para avaliar quem jogou sem evento).

- **P3:** `xgDoChute(x, y)` em JS com os coeficientes do V5 (`XG_MODELO` — mesmos valores do Python: 6 m→0,24,
  11 m→0,11, 25 m→0,03); Scout ao Vivo ganhou **Mapa de finalizações** (`renderShotMap`, meio-campo em SVG, círculo ∝ √xG,
  amarelo = gol) e coluna xG no resumo por atleta.

- **F5:** tela **Meu dia** (`screen-atleta`, item de menu só para papel atleta; o atleta entra direto nela): bem-estar com
  botões grandes 1–7 + lesão, esforço do treino 0–10 com cor + minutos, histórico próprio (`renderAtleta`, `atSet`,
  `atSaveWell`, `atSaveRpe`). Backend: `registros:srpe` agora inclui atleta, só para o próprio `atleta_id` (teste atualizado).

- **T4:** card **Estilo do time** no Meu Time (`renderTimeEstilo`, `clubStyleStats`, `ESTILO_EIXOS`): radar com 7 eixos
  (gols pró/jogo, gols contra/jogo invertido, posse, finalizações/jogo, precisão, escanteios, disciplina invertida) em
  **percentil entre os clubes capixabas**; tabela ao lado com o valor real. Gols de todos os jogos; o resto só de jogos com
  estatística oficial (contagem mostrada). Respeita o filtro de competição (D4).

- **X3:** Simulador de Lances ganhou **Compactação** (checkbox + time: meu/adversário/os dois): fecho convexo dos 10 de
  linha (`convexHull`, `polyArea`), linhas separadas pelos 2 maiores espaços em profundidade (`teamLines`), cotas em metros
  entre linhas no campo e card com profundidade, largura, área (m²), desenho das linhas (ex.: 4-4-2) e distâncias
  (`compactacao`, `simCompSvg`). Atualiza ao arrastar e na animação.

- **Q1:** **Biblioteca de lances** abaixo do Simulador (`simLibRender`, `simLibSet`, `simLibDel`, `simLibPartidas`): tabela com
  busca (nome/tag/partida), filtro por tag em chips, tags editáveis (vírgula, até 8, minúsculas), vínculo com uma partida real
  do clube, abrir e excluir. Salvar de novo com o mesmo nome preserva tags e partida. Mesma chave `capixastat_v5_lances`
  (já sincronizada com a nuvem). Seletor de time da compactação só aparece com a opção ligada.

- **B5:** pasta **`servico-python/`** (FastAPI + Pandas): `GET /saude`, `POST /percentis` (por 90 com corte 270 min +
  percentil na posição, cartões invertidos), `POST /elo` (mesma regra do T3), `POST /xg` e `GET /xg/zonas` (modelo do
  V5). 8 testes `pytest` passando. Conferido via HTTP a partir do navegador: 136 jogos reais → Elo idêntico ao da tela
  (dif. 0,0 nos 29 clubes); xG igual ao JS (< 0,0001). Serviço `capixastat-calculos` adicionado ao `render.yaml`
  (opcional). A plataforma continua calculando no navegador; o serviço é a versão testável/reutilizável das fórmulas.

- **V2:** `poc-cv/times.py` (só numpy): máscara do gramado, cor mediana do tronco sem grama, KMeans k=2 próprio,
  "outro" para árbitro/goleiro (distância ao centro), voto por ID e descarte de banco/torcida (sem grama sob os pés).
  `example_tracking.py --times` aprende as cores nos 25 primeiros quadros (guardados e processados depois), pinta as caixas
  por time e grava a coluna `time` no `posicoes.csv`. Testes: `test_times.py` (6) + `test_tracking_mock.py` (laço completo
  com cv2/YOLO falsos) → 14 testes no poc-cv. Não foi rodado em vídeo real (sem GPU/ultralytics nesta máquina).

- **V4:** tela **Análise de Vídeo** (`screen-video`, menu Clube): abre o `anotado.mp4` (fica local, `createObjectURL`) e o
  `posicoes.csv` do poc-cv (`vaParseCsv` valida colunas, `vaCarregar`); **visão de cima** sincronizada com o vídeo
  (`vaSync` por tempo×fps, `vaIrQuadro` pelo controle deslizante), IDs coloridos pelo time mais votado; resumo (quadros,
  duração, FPS, IDs por time, % de quadros com bola). Sem CSV mostra estado vazio — nenhum dado inventado.
  Testado com CSV sintético gerado só no console (não salvo). Sincronia com vídeo real não testada (sem vídeo de jogo aqui).

- **V3:** CSV `quadro, tempo_s, id, classe, time, x_px, y_px, x_m, y_m` (coluna `time` do V2) e, na Análise de Vídeo:
  **posições médias** por ID (`vaMedias`, apagado se < 30% dos quadros), **mapa de calor real** por time ou bola
  (`vaCalor`, grade 21 × 14), **compactação ao longo do clipe** (área do fecho convexo por time, quadro a quadro, até 300
  pontos — `vaSerieCompactacao`, reusa `convexHull`/`polyArea` do X3) e polígono do bloco na visão de cima
  (`vaExtraSvg`). Testado com CSV sintético no console.

- **L3:** **barra de contexto** acima do título de todas as telas (`ctxBarRender`, chamada no `goTo`): escudo + clube ·
  competição · temporada. Nas telas cujos números mudam com a competição (`CTX_TELAS`: Visão Geral, Meu Time, Vitrine,
  Perfil) a competição é um seletor (mesmo `ctxSet` do D4, com × para limpar); nas outras aparece em itálico, só
  informativo. `ctxSet` agora sincroniza o seletor do menu lateral. Topbar passou de altura fixa para `min-height` 66px.

- **M1:** plugin global do Chart.js **`csFocus`**: ao passar o mouse, a série apontada fica em destaque, as outras
  esmaecem (alpha 0,18) e a grade/eixo ao fundo é coberta por um véu da cor do card (sobra o valor + tooltip); ponto em
  hover maior (raio 6). Vale para todos os gráficos com eixos; desliga com `plugins: { csFocus: false }`.
  Testado no Elo do Meu Time (foco no dataset certo e volta ao normal no mouseout).

- **R4:** acessibilidade de teclado e leitor de tela: foco visível global (`:focus-visible`, contorno da marca); link
  **"Pular para o conteúdo"** (primeiro Tab); `csA11yScan` (no carregamento e a cada troca de tela) dá `tabindex=0` +
  `role=button` a divs/spans/linhas clicáveis (itens do menu etc.), que passam a responder a Enter/Espaço, marca o item
  ativo com `aria-current=page` e nomeia botões só com ícone pelo `title`/`data-tip` (0 botões sem nome). Todo gráfico
  criado por `mkChart` ganha `role=img` + `aria-label` e uma **tabela alternativa** (`csChartTabela`) — escondida para
  leitor de tela e visível no link "Ver dados em tabela" (gráficos miniatura só para leitor de tela).

- **Q3:** botão **Exportar vídeo** no Simulador (`simExportVideo`, `simDesenharCanvas`): desenha o lance quadro a quadro
  num canvas 1280 × 916 (campo + jogadores + legenda Qn + rodapé CapixaStat/clube/data), mesma animação da tela
  (pausa 650 ms + transição 1100 ms suavizada, respeita a velocidade), grava com `MediaRecorder` a 30 fps e baixa **MP4**
  (Chrome/Edge atuais) ou **WebM**. Usa `setTimeout` para não parar com a aba em segundo plano. Testado: 2 quadros →
  MP4 de 2,7 s, 114 KB, conteúdo conferido lendo um quadro do vídeo. **GIF não foi feito** (precisaria de biblioteca;
  MP4 já abre no WhatsApp/Instagram) — ver Trabalhos futuros.

- **A10:** card **Lado a lado** no Comparativo (`renderCmpTabela`): 16 linhas (jogos, minutos, gols, assistências, por 90
  min, cartões, Score e os 6 eixos do radar), valor dos dois atletas, diferença (1º − 2º) com barra proporcional e cor de
  quem leva vantagem (cartões: menos é melhor), contagem de vantagens no rodapé. Eixos aproximados marcados "est.";
  por 90 só com ≥ 270 min; gols/assistências de goleiro ficam "—".

- **X4:** Dossiê do Adversário ganhou a seção **Como marcam e sofrem gols** (`_dossieTimingHtml`, usa `clubTiming` do P4):
  barras verdes/vermelhas por faixa de 15 min, totais por tempo, faixa de pico ("sofre mais entre 76–90' — momento para
  pressionar") e quantos jogos têm eventos. Entra no PDF (o PDF é captura do relatório). Adversário de fora do ES sem
  eventos → aviso. Testado: dossiê do Vitória-ES + PDF de 1 página gerado (download interceptado no teste).

- **Q4:** todas as exportações de imagem/PDF levam a marca: telestração (I3), Simulador PNG e vídeo (Q3), card do atleta
  PNG/PDF (A8) já tinham; faltava o **PDF do Dossiê** → rodapé em todas as páginas (CapixaStat · Dossiê do adversário ·
  clube · data · página n/N). CSVs ficam sem rodapé (são dados para planilha).

- **V6:** texto pronto para o relatório em **`docs/relatorio_secao_visao_computacional.md`** (limites da transmissão:
  câmera móvel, campo parcial, troca de ID, árbitro/reserva, resolução; alternativa câmera fixa: celular em tripé alto,
  duas câmeras fixas, panorâmica automática tipo Veo/Pixellot/Trace; próximos passos). Resumo no `poc-cv/README.md` e
  card "Limites" na tela Análise de Vídeo. **O PDF do relatório não foi editado** — o Caio cola a seção no documento.

- **M3:** selo **"editado"** (amarelo tracejado) quando algo salvo é alterado: na Vitrine, ao mudar qualquer campo de um
  filtro salvo escolhido (`vfCheckEditado`, botão **atualizar** → `vfUpdateSaved`); no Simulador, ao mexer num lance
  salvo aberto (`simCheckEditado` compara com a foto do momento em que foi salvo/aberto; botão **salvar** grava com o
  mesmo nome). Corrigido de quebra: a lista de filtros salvos perdia a seleção a cada redesenho da Vitrine.

- **P6:** **Momentum do jogo** no Scout ao Vivo (`renderMomentum`, `momentumPeso`, pesos públicos em `MOMENTUM_PESOS`):
  barras verdes/vermelhas com o saldo das ações do seu time a cada 5 min (gol +3, finalização +1 + 5×xG, passe-chave +1,
  drible/recuperação +0,7 ×1,3 no terço final; erro −0,7, falta −0,5, amarelo −1, vermelho −3), melhor e pior momento,
  tooltip com positivas/negativas. Aparece com ≥ 5 marcações (só usa o que foi marcado — o Scout não registra o adversário).

- **F6:** card **Maturação e crescimento** no Perfil (só atletas ≤ 18 anos ou com medidas): comissão registra nascimento,
  sexo, data, altura, altura sentado (opcional) e peso (`matAdd`, validações de faixa); calcula a **distância do pico de
  crescimento (PHV)** por Mirwald 2002 (com altura sentado) ou Moore 2015 (só idade + altura; versão para meninas),
  idade estimada do pico, velocidade de crescimento (cm/ano) e fase (antes / perto / depois do pico) com orientação de
  carga; gráfico altura × distância do pico por idade; tabela de medidas. Selo "estimativa" e aviso de erro ±1 ano.
  Dados em `capixastat_v5_medidas` → nuvem na chave **`medidas`** (adicionada em `backend/routes/dados.js` e no OpenAPI;
  9 testes do backend passando). Nenhuma medida real cadastrada — o card começa vazio.

- **L4:** **assistente de primeiro acesso** (`obStart`, `obRender`, `obConcluir`, `obPular`; abre sozinho no 1º login de
  cada usuário — marca `capixastat_v5_onboard_<email|nome>`): 1) clube (10 clubes com escudo), 2) função (8 funções com
  descrição; travada quando o papel vem do cadastro na nuvem), 3) por onde começar — 3 telas sugeridas por função
  (`OB_FUNCOES`) e legenda dos selos real/estimativa. Grava clube/função no usuário atual e reaplica permissões.
  "Pular" e Esc fecham; **Rever apresentação** no menu, acima de Sair da conta, reabre.

### Revisão final (21/11/2026)
- **Todos os itens da proposta estão feitos** (Alta, Média e Baixa) — um commit por item no git local.
- Passada em todas as 17 telas da v5, tema escuro e claro: **nenhum erro de JavaScript** no console (só 403/CORS de
  fotos e escudos externos, que já existiam na v4 e não quebram nada).
- Corrigido na revisão: a tela **Ranking** só desenhava pódio e tabela depois de clicar numa aba (bug herdado da v4).
- Testado de ponta a ponta com o backend em memória: cadastro/login real, sincronização de documentos (ex.: `medidas`),
  registros de sRPE (incluir e apagar) e o fluxo do **atleta** (entra direto em "Meu dia", grava bem-estar e esforço só
  para si).
- Testes automáticos: backend **9** (`npm test`), serviço Python **8** (`servico-python`), visão computacional **14**
  (`poc-cv`). `tools/checkjs.py` sem erro de sintaxe. **A v4 continua idêntica ao backup.**

### Pendências do Caio (não dependem de código)
1. Rodar `backend/schema.sql` no Supabase (cria as tabelas novas).
2. Publicar a API no Render pelo `render.yaml` (Blueprint) e preencher `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`.
   O serviço Python (`capixastat-calculos`) também está no `render.yaml`, é opcional.
3. (Opcional) Conta na API-Football → `API_FOOTBALL_KEY` no `backend/.env`.
4. Colar no relatório a seção `docs/relatorio_secao_visao_computacional.md` (V6).

## Rodada 2 — pedidos de 21/11/2026 (entrega 24/11)
Ordem pedida: 1 navegação · 2 GitHub · 3 sem emojis · 4 Táticas · 5 Formação. Mesmas regras (commit por
item, testar sem erro no console, atualizar este arquivo).

- **R2-1 Navegação:** menu sem Scout ao Vivo, Simulador e Quadro Tático. **Estúdio Tático** (antes "Táticas") é uma
  entrada só, com abas **Campo** (`taticas`), **Lance animado** (`simulador`) e **Sobre vídeo** (`telestrador`) —
  `CS_ABAS`, `CS_ABA_DE`, `csAbasRender` (chamada no `goTo`); as telas continuam as mesmas, só mudam título e abas.
  **Partidas** ganhou as abas **Jogos** e **Scout ao Vivo**. `NAV_PARENT` acende o item pai. **Biblioteca de lances**
  vira botão nas abas que salvam (Lance animado e Sobre vídeo) e abre em janela (`simLibAbrir`; `simLibRender` desenha
  no card e na janela; "Abrir" leva à aba Lance animado). **Análise de Vídeo** com selo "Exp." no menu e aviso
  "Experimental" (testado só com dados sintéticos). Sugestões do assistente (L4) com os nomes novos.

- **R2-2 GitHub:** remoto `origin` = https://github.com/cborba733/Capixastat (branch `main`). O GitHub tinha 34 commits
  do projeto original e o git local começou de uma cópia baixada; o conteúdo do GitHub já estava todo no local, então
  os históricos foram unidos com `git merge -s ours --allow-unrelated-histories` (mantém os arquivos locais e preserva
  o histórico do GitHub) e enviados **sem force push**. Inclui `backup/`; `.env` não existe nem é rastreado (`.gitignore`).
  Existe um PR #1 antigo aberto no GitHub (não mexido). Daqui em diante: `git push` normal ao fim de cada bloco.

- **R2-3 Sem emojis:** todos os emojis/pictogramas da interface (menu, KPIs, abas da Formação, cadastro, pódio, alertas,
  Auxiliar Tático, Dossiê, linha do tempo, botões de mídia, tema claro/escuro, menu de celular) trocados por ícones
  **Lucide** (https://lucide.dev, licença ISC) embutidos: mapa `CS_ICONES` + `ico(nome, classe)` e classe `.cs-ico`
  (1em, traço 2, `currentColor`) — mesmo estilo e tamanho em todas as telas. Varredura das 17 telas + Dossiê + menu:
  0 emojis renderizados. Sobraram só ★ em comentários do CSS e ✓ num `console.log` (não aparecem para o usuário).
  As exportações (PNG, PDF, vídeo) não tinham emojis.

- **R2-4 Táticas:** avaliação + pesquisa + proposta em **`docs/PROPOSTA_TATICAS.md`** (TA1–TA10 com prioridade e
  dificuldade e fontes). Implementado (alta + TA6):
  - **TA1** perfil tático do adversário (estilo, mentalidade, pressão, bloco) marcado **"Não verificado"** (rótulos fixos
    do sistema, sem fonte) ou **"Informado pela comissão"** quando preenchido nas anotações (`_dossiePerfil`, `DS_PERFIL`);
    o plano de jogo diz em que se baseia.
  - **TA2/TA3** **Resumo para a preleção** no topo do Dossiê (`_dossieResumoHtml`, `_dossieNumeros`, `_dossieChaves`):
    3 chaves do jogo sugeridas por regras sobre dados reais (faixas de 15', estilo em percentis, casa × fora, Elo,
    cartões) ou as da comissão (campo "3 chaves do jogo"); últimos 5 jogos com placar, casa × fora, Elo dos dois times,
    estilo em percentis, confronto direto, atletas com 3+ cartões.
  - **TA4** lances da biblioteca com tag do adversário ou ligados a uma partida contra ele aparecem no Dossiê (`_dossieLances`).
  - **TA5** Auxiliar Tático ancorado: REGRA 0 no prompt (só números do contexto, perfis = hipótese, linha "Dados usados"
    no fim), temperatura 0,3, busca na web marcada "não recomendado"; descrição falsa da plataforma (mapa de calor por
    YOLOv8 no Perfil) corrigida no prompt.
  - **TA6** anotações por **fases do jogo** (construção, último terço, transições, organização defensiva, bolas paradas)
    + **SWOT** (forças, fraquezas, oportunidades, ameaças).
  Ficaram para Trabalhos futuros: TA7 (dossiê em slides), TA8 (IA redatora), TA9 (escalação provável), TA10 (bolas
  paradas com dados). O Auxiliar com IA **não foi testado com chave real do Gemini** (sem chave aqui).

- **R2-5 Formação / Antropometria (FM1):** avaliação e proposta em **`docs/PROPOSTA_FORMACAO.md`** (FM1–FM7). A aba
  antiga **inventava todas as medidas a partir do nome do atleta** (e um "Score Físico" em cima) — removida. Nova aba:
  corpo em **SVG** (frente/costas, `antroCorpoSvg`) com 11 + 9 regiões clicáveis (mouse e teclado), regiões com medida
  destacadas; ao lado, as medidas **ISAK** daquela região (perímetros e dobras, lados D/E onde existe), variação desde a
  avaliação anterior, selo "Medido"; corpo todo: massa, estatura, IMC, Σ dobras, **% de gordura só como estimativa**
  (Jackson & Pollock 1978 / Jackson, Pollock & Ward 1980 + Siri, citados na tela) e diferença entre lados (alerta > 5%).
  Formulário de avaliação (só o que foi medido, faixas validadas) e histórico. Dados em `capixastat_v5_medidas[id].antropo`
  (mesmo documento do F6, já sincronizado com a nuvem). **3D não feito**: inviável com licença e qualidade até terça
  (justificativa no doc) — vai para Trabalhos futuros. `corpo_anatomico.png.png` deixou de ser usado.

## Trabalhos futuros
O que ficou de fora ou só parcialmente feito, em ordem de valor:
- **Visão computacional em vídeo real:** V1/V2/V3 foram testados com dados sintéticos e um YOLO falso (sem GPU nem
  `ultralytics` nesta máquina). Falta rodar `example_tracking.py --calib --times` num clipe real de jogo capixaba,
  conferir a separação de times e abrir o CSV na aba Análise de Vídeo com o vídeo sincronizado.
- **Recalibração automática** da homografia a cada corte de câmera (detectar linhas do campo) e reidentificação de
  jogadores (manter o mesmo ID; ligar ID ao atleta pelo número da camisa).
- **GIF do lance (Q3):** hoje exporta MP4/WebM; GIF precisaria de biblioteca (ex.: gif.js).
- **Scout do adversário:** o Scout ao Vivo marca só o próprio time; o momentum (P6) e a nota (A9) ficariam completos
  com as ações do adversário.
- **Dados físicos reais:** as abas Físico/Antropometria da Formação e alguns eixos do radar (Dribles, Físico,
  Consistência) seguem estimados — dependem de aferição do clube ou de GPS/câmera tática. A maturação (F6) já recebe
  medidas reais, mas começa vazia.
- **Mais fontes de dados:** só o TheSportsDB (Capixabão) está integrado na rotina diária; API-Football depende da
  chave. Minutos por jogo de cada atleta não vêm das fontes abertas (o recorte "últimos 5 jogos" do A6 não tem minutos).
- **Plataforma consumir o serviço Python (B5):** hoje os cálculos rodam no navegador; o serviço tem as mesmas fórmulas,
  testadas, mas a tela ainda não chama a API dele.
- **Presets táticos com selo "editado" (M3):** feito para filtros da Vitrine e lances do Simulador; falta no Quadro
  Tático.
- **Layout para celular:** fora do escopo — o CapixaStat é um site para PC (decisão de 21/11).
- **React (`web-react/`):** parado; a v5 em HTML é a versão de entrega.
