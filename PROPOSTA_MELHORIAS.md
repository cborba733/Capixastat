# CapixaStat — Proposta de melhorias (Etapa 3)

Status: **aguardando aprovação do Caio** (nov/2026). Nada aqui foi implementado.
Base: v4 (`CapixaStat_v4.html`) + pesquisa da Etapa 2 (resumo no `CLAUDE.md`).
Patrocínio está fora do escopo e não aparece aqui.

Legenda — **Prioridade:** Alta / Média / Baixa (valor para o projeto e para a banca).
**Dificuldade** (pensando em quem sabe Python/Java básico, com ajuda de IA): Baixa (horas, mexe em
uma tela) · Média (1–3 dias, mexe em dados ou em mais de uma tela) · Alta (semana+, tecnologia nova).

---

## A) Funcionalidades por setor

### 1. Dashboard
| ID | Melhoria | Prior. | Dific. | Referência |
|---|---|---|---|---|
| D1 | Reorganizar em hierarquia: linha de KPIs → gráficos → tabelas; card **Próximo jogo** e **forma (últimos 5)** em bolinhas V/E/D | Alta | Baixa | FotMob, Estúdio de Dados |
| D2 | Card **Alertas da semana**: atletas em zona de risco (ACWR), pendurados (cartões), lesionados | Alta | Baixa | Catapult, FootSim |
| D3 | **Chip "Métrica"** em cada gráfico: uma frase dizendo o que o gráfico mede e se é dado real ou estimado (vira glossário) | Alta | Baixa | Estúdio de Dados, SkillCorner |
| D4 | Seletor global de **competição e temporada** que filtra todas as telas | Média | Média | Estúdio de Dados, FootSim |

### 2. Atletas (Vitrine, Cadastro, Perfil, Ranking, Comparativo, Estatísticas)
| ID | Melhoria | Prior. | Dific. | Referência |
|---|---|---|---|---|
| A1 | **Busca com filtros**: poucos filtros principais (posição, idade, clube, competição, minutos mínimos) + botão "mais filtros"; **filtros salvos** | Alta | Média | Wyscout, FootSim, SofaScore |
| A2 | **Componente único de tabela**: nome fixo ao rolar, ordenar clicando no cabeçalho, dica nas abreviações, números alinhados à direita, cores por faixa, **ícones de status junto ao nome** (lesionado, pendurado) | Alta | Média | FootSim (UI de tabelas) |
| A3 | Estatísticas **por 90 minutos** com corte mínimo de minutos + **pizza de percentis** vs. mesma posição | Alta | Média | FBref, StatsBomb, InStat |
| A4 | **Selo de confiabilidade**: dado estimado aparece com estilo pontilhado/legenda (padrão visual único no sistema) | Alta | Baixa | FootSim ("fog of war") |
| A5 | **Lista de observação** (shortlist) + exportar CSV | Média | Baixa | Wyscout |
| A6 | Recorte temporal: temporada, por competição, últimos 5 jogos | Média | Média | FootSim, FBref |
| A7 | **Relatório de observação** estruturado: situação → comportamento → consequência + pontos fortes/fracos | Média | Baixa | @estudandofutebol, TaKampinho |
| A8 | **Card do atleta compartilhável** (PNG com rodapé CapixaStat) — visibilidade do atleta capixaba (ODS 8/10) | Média | Baixa | TaKampinho, Estúdio de Dados |
| A9 | **Nota CapixaStat por jogo** com fórmula pública (base 6,0 + pesos documentados) | Média | Média | SofaScore, FotMob |
| A10 | Comparativo com tabela lado a lado e diferença colorida | Baixa | Baixa | FBref |

### 3. Partidas
| ID | Melhoria | Prior. | Dific. | Referência |
|---|---|---|---|---|
| P1 | **Linha do tempo** redesenhada (gols, cartões, substituições com ícones) | Alta | Baixa | FootSim, SofaScore |
| P2 | **Registro manual de eventos** ("scout ao vivo"): clicar no campo para marcar finalização/gol/desarme com minuto → gera dados próprios do Capixabão, que não existem em fonte pública | Alta | Alta | Wyscout, StatsBomb (formato de evento) |
| P3 | **Mapa de finalizações** + **xG simples por zona** (a partir de P2; ex.: lateral da área ≈4%, pequena área central ≈30%) | Média | Média | Infogol, @estudandofutebol |
| P4 | Gols e cartões **por faixa de 15 min** e **1º vs 2º tempo** (dá para fazer já com os eventos existentes) | Média | Baixa | WhoScored, Estúdio de Dados |
| P5 | **Craque da partida** com 3 números principais; estatísticas com presets (ofensivas/defensivas/todas) | Média | Baixa | FootSim, FotMob |
| P6 | **Gráfico de momentum** (barras +/− por minuto) — só quando houver eventos por minuto (depende de P2) | Baixa | Média | SofaScore, FootSim |

### 4. Formação
| ID | Melhoria | Prior. | Dific. | Referência |
|---|---|---|---|---|
| F1 | **Carga interna por sRPE** (nota de esforço 0–10 × minutos) — dado real coletável sem GPS, substitui parte do simulado | Alta | Baixa | Foster (2004), Catapult |
| F2 | **Questionário de bem-estar** diário (sono, fadiga, estresse, dor — índice de Hooper) com semáforo | Alta | Baixa | Hooper, literatura de monitoramento |
| F3 | ACWR apresentado como **alerta** (não previsão), com opção EWMA e texto de limitações | Média | Baixa | Impellizzeri (2020/21) |
| F4 | **Rotinas de microciclo salvas** e aplicadas em outras semanas | Média | Baixa | FootSim (treino) |
| F5 | **Tela do atleta** (celular) para responder sRPE e bem-estar — depende de B2 | Média | Média | apps de monitoramento |
| F6 | Base: **maturação/PHV** e curva de crescimento | Baixa | Média | estudos de maturação na base |

### 5. Meu Time
| ID | Melhoria | Prior. | Dific. | Referência |
|---|---|---|---|---|
| T1 | Página no padrão **"vitrine do clube"**: forma, próximo jogo, tabela com coluna de forma, **melhores do elenco** (gols, assistências, nota), estádio | Alta | Baixa | FotMob, Estúdio de Dados |
| T2 | **Elenco com disponibilidade** (lesionado/pendurado) e minutagem por atleta | Média | Baixa | FootSim |
| T3 | **Ranking Elo** dos clubes capixabas com gráfico de evolução | Média | Baixa | ClubElo |
| T4 | **Radar de estilo do time** com o que existe (gols pró/contra por jogo, finalizações, posse quando houver) | Média | Média | Driblab, StatsBomb |

### 6. Táticas
| ID | Melhoria | Prior. | Dific. | Referência |
|---|---|---|---|---|
| X1 | **Simulador de lances em quadros** (Q1, Q2, Q3…) com legenda por quadro e animação entre posições | Alta | Média | TaKampinho, @estudandofutebol |
| X2 | **Anotações do estudo** por time (fase ofensiva/defensiva, fortes/fracos, jogadores) ligadas ao Dossiê | Média | Baixa | TaKampinho |
| X3 | Ferramenta de **compactação**: polígono ligando os jogadores e distância entre linhas | Média | Média | @estudandofutebol (Código Tático) |
| X4 | Dossiê em PDF com seção "como marcam/sofrem gols" (usa P4) | Baixa | Baixa | — |

### 7. Quadro Tático (telestração)
| ID | Melhoria | Prior. | Dific. | Referência |
|---|---|---|---|---|
| Q1 | **Biblioteca de lances salvos** (lista, tags, partida) | Média | Média | Metrica Play, KlipDraw |
| Q2 | Novas marcações: **spotlight** e **ligação entre jogadores** (ex.: "saída de 3") | Média | Baixa | Metrica Play |
| Q3 | **Exportar vídeo/GIF** do lance anotado | Média | Alta | TaKampinho, KlipDraw |
| Q4 | Rodapé da marca nas imagens exportadas | Baixa | Baixa | TaKampinho |

### 8. Backend
| ID | Melhoria | Prior. | Dific. | Referência |
|---|---|---|---|---|
| B1 | API publicada e estável; mover para o banco o que hoje fica só no navegador (fotos, táticas, telestrações, formação) | Alta | Média | — |
| B2 | **Perfis de acesso** (técnico, preparador, analista, atleta) via JWT + middleware | Alta | Média | Supabase RBAC |
| B3 | Tabela de **eventos de jogo** (partida, atleta, tipo, minuto, x, y) no formato StatsBomb — base para P2/P3 | Alta | Média | StatsBomb Open Data |
| B4 | Tabelas de **treino, sRPE e bem-estar** (para F1/F2) | Alta | Baixa | — |
| B5 | **Serviço Python (FastAPI + Pandas)** para cálculos: percentis, Elo, xG por zona — coloca Python de fato no projeto | Média | Média | FastAPI + Pandas |
| B6 | Validação de entrada, mensagens de erro, documentação da API (Swagger) e testes simples | Média | Baixa | — |
| B7 | Registro da **fonte e data** de cada dado importado (rastreabilidade) | Baixa | Média | princípio "real × estimado" |

### 9. Visão computacional
| ID | Melhoria | Prior. | Dific. | Referência |
|---|---|---|---|---|
| V1 | **Homografia com 4 cliques**: usuário marca 4 pontos do campo → posições em metros | Alta | Média | Roboflow sports, OpenCV |
| V2 | Separação de times mais robusta (cor só do tronco + KMeans) e filtro de árbitro/banco (máscara do campo) | Média | Média | Roboflow sports |
| V3 | Exportar **CSV** (quadro, id, time, x, y) e mostrar na plataforma: posições médias, mapa de calor real, compactação | Média | Alta | Estúdio de Dados (mapa de influência) |
| V4 | Aba **Análise de Vídeo** na plataforma consumindo o resultado | Média | Média | Metrica |
| V5 | POC de **xG/xT em Python com dados abertos** (StatsBomb + mplsoccer) para o relatório | Média | Baixa | Soccermatics, Friends of Tracking |
| V6 | Registrar no relatório os limites (câmera móvel) e a alternativa de câmera fixa/barata (ex.: Veo) | Baixa | Baixa | Veo |

---

## B) Design como um todo

### B1. Identidade visual
| ID | Melhoria | Prior. | Dific. |
|---|---|---|---|
| I1 | **Separar papéis de cor**: 1 cor de marca + cores de status (verde/amarelo/vermelho só para estado físico) + paleta de dados (categórica para times, sequencial para heatmap, divergente para acima/abaixo da média). Hoje o verde da marca é o mesmo do "disponível". | Alta | Baixa |
| I2 | **Tipografia**: títulos em fonte condensada (ex.: Barlow Condensed/Oswald), corpo em DM Sans, números com `tabular-nums`/JetBrains Mono | Média | Baixa |
| I3 | **Logo simples** (símbolo + nome) e regras de uso; rodapé de marca em tudo que é exportado | Média | Baixa |
| I4 | **Guia de componentes**: card, tabela, chip de métrica, badge de status, botões — mesmo visual em todas as telas | Alta | Média |

### B2. Layout, hierarquia e navegação
| ID | Melhoria | Prior. | Dific. |
|---|---|---|---|
| L1 | Menu lateral reagrupado por tarefa (ex.: Clube · Jogadores · Jogos · Preparação · Ferramentas) em vez de 12 itens soltos | Alta | Baixa |
| L2 | Padrão de página: cabeçalho → KPIs → visualizações → tabela; detalhe só ao clicar | Alta | Média |
| L3 | Barra de contexto global (clube, competição, temporada) | Média | Média |
| L4 | **Assistente de primeiro acesso** em passos (escolher clube, função) | Baixa | Média |

### B3. Visualização de dados (o que usar para cada dado)
| Dado | Visual recomendado |
|---|---|
| Perfil de atributos | Radar 5–6 eixos (já existe) |
| Posição do atleta vs. colegas de posição | Pizza de percentis |
| Rankings | Barras horizontais ordenadas |
| Evolução (score, peso, carga) | Linha com faixa de referência |
| Forma recente | Bolinhas V/E/D ou sparkline na tabela |
| Momentum / acima-abaixo da média | Barras +/− (divergente) |
| Onde acontece (chutes, ações, posições) | Componente **Campo** reutilizável: heatmap, chutes com círculo do tamanho do xG, posições médias |
| Probabilidades ("≈4 em 100") | Pictograma de pontos |
| Status físico | Semáforo **+ ícone + texto** (não só cor) |
Evitar pizza/doughnut com muitas categorias.

### B4. Microinterações e animações
| ID | Melhoria | Prior. | Dific. |
|---|---|---|---|
| M1 | Ao passar o mouse no gráfico, destacar o valor e esconder o excesso (eixo/campo ao fundo) | Média | Média |
| M2 | Contador animado nos KPIs, transição suave entre abas, carregamento com esqueleto, aviso "salvo" | Média | Baixa |
| M3 | Indicar "editado" quando filtro/layout salvo for alterado | Baixa | Baixa |
| M4 | Respeitar `prefers-reduced-motion` | Média | Baixa |

### B5. Responsividade e acessibilidade
| ID | Melhoria | Prior. | Dific. |
|---|---|---|---|
| R1 | **Contraste**: `--text-3` tem 3,3:1 no tema escuro e 2,6:1 no claro (mínimo AA = 4,5:1) — ajustar | Alta | Baixa |
| R2 | **Tamanho de fonte**: ~300 usos de 9–12px na v4; mínimo 12px para rótulos e 14px para texto | Alta | Média |
| R3 | **Celular (375px)**: menu vira barra inferior/hambúrguer; tabelas com coluna fixa ou viram cards; gráficos simplificados | Alta | Média |
| R4 | Teclado e leitor de tela: foco visível, `aria-label` nos ícones, tabela alternativa para gráficos | Média | Média |
| R5 | Gráficos com contraste mínimo 3:1 e informação que não dependa só de cor | Média | Baixa |

### B6. Referências visuais para seguir
- **Estúdio de Dados (brasileirao.estudandofutebol.com.br)**: a mais próxima do CapixaStat — menu de abas por tema, chip "Métrica" explicando cada tela, botão Exportar, vitrine do clube/jogador, mapa de influência.
- **TaKampinho**: prancheta, simulador em quadros, card do jogador, anotações, exportação com marca.
- **FotMob**: página do time limpa e escaneável.
- **FootSim**: regras de tabela (UX) e consistência visual.
- **SofaScore / FBref / Infogol**: notas, momentum, percentis, mapa de xG.
- **@estudandofutebol (TikTok)**: lances 2D com título-pergunta e legenda por quadro.

---

## Sugestão de pacote inicial (se quiser aprovar por partes)
1. **Rápidos e de alto impacto:** D1, D2, D3, A4, P1, F1, F2, T1, R1, I1, L1.
2. **Núcleo de dados próprios:** B3 + P2 + P3 (e B4 para F1/F2).
3. **Diferencial visual/tático:** X1, A2, A3, R3.
4. **Python e IA (ODS 4/9):** B5, V1, V5.
