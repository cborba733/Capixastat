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

Proposta completa (Etapa 3) em **`PROPOSTA_MELHORIAS.md`**, com IDs (D1, A1, P2…), prioridade e
dificuldade. Status: **aguardando aprovação**. Quando o Caio aprovar, listar aqui os IDs aprovados,
a ordem combinada e o status de cada um (pendente / em andamento / feito).
