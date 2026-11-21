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
**Média:** ✅ A5 · ✅ A7 · ✅ A8 · ✅ P4 · ⬜ P5 · ⬜ F3 · ⬜ F4 · ⬜ T2 · ⬜ T3 · ⬜ X2 · ⬜ Q2 · ⬜ B6 · ⬜ V5 ·
⬜ I2 · ⬜ I3 · ⬜ M2 · ⬜ M4 · ⬜ R5 · ⬜ D4 · ⬜ A6 · ⬜ A9 · ⬜ P3 · ⬜ F5 · ⬜ T4 · ⬜ X3 · ⬜ Q1 · ⬜ B5 ·
⬜ V2 · ⬜ V4 · ⬜ L3 · ⬜ M1 · ⬜ R4 · ⬜ Q3 · ⬜ V3
**Baixa:** ⬜ A10 · ⬜ X4 · ⬜ Q4 · ⬜ V6 · ⬜ M3 · ⬜ P6 · ⬜ F6 · ✅ B7 · ⬜ L4

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

## Trabalhos futuros
_(preencher na revisão de segunda-feira com o que não der tempo)_
