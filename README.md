⚽ CapixaStat — Plataforma de Análise do Futebol Capixaba

📌 Sobre o Projeto
O CapixaStat é uma plataforma web desenvolvida com o objetivo de contribuir para o
desenvolvimento do futebol capixaba por meio de análise de dados, visibilidade de
atletas e gestão de informações esportivas.

O sistema busca resolver problemas como:

- Falta de visibilidade de jogadores locais
- Ausência de dados estruturados sobre desempenho
- Dificuldade na análise tática e individual dos jogadores
- Baixo investimento e captação de patrocínio no futebol do Espírito Santo

🎯 Objetivo
Desenvolver uma plataforma web que utiliza ciência de dados para analisar o desempenho
de jogadores e clubes do futebol capixaba, promovendo a visibilidade dos atletas,
apoiando a tomada de decisão em clubes e estimulando o desenvolvimento do ecossistema
esportivo do Espírito Santo.

👥 Público-Alvo
- Técnicos e comissões técnicas
- Clubes e dirigentes
- Atletas (principalmente categorias de base)
- Patrocinadores e investidores
- Federação de Futebol do Espírito Santo (FES)

🌍 ODS (Objetivos de Desenvolvimento Sustentável)
O projeto está alinhado com as seguintes ODS da ONU:

- ODS 4 — Educação de Qualidade
- ODS 8 — Trabalho Decente e Crescimento Econômico
- ODS 9 — Indústria, Inovação e Infraestrutura
- ODS 10 — Redução das Desigualdades

🧩 Funcionalidades do Sistema

⚽ Vitrine de Jogadores
- Cadastro de atletas
- Perfil com informações (idade, posição, clube)
- Estatísticas individuais e score geral

📊 Análise de Desempenho
- Cadastro de partidas
- Registro de estatísticas por rodada
- Ranking de jogadores com KPIs
- Comparativo entre atletas

🧠 Formação de Atletas
- Acompanhamento físico: carga e intensidade de treino
- Evolução física e avaliação antropométrica
- Microciclo e registro de sessões

🛡️ Meu Time
- Painel do clube: escudo, estádio, fundação e elenco
- Competições do clube (Capixabão, Copa ES, Série D, Copa Verde)
- Classificação e partidas recentes por competição

🤖 Auxiliar Tático com IA
- Dossiê do adversário e análise tática
- Conversa com IA (Google Gemini) usando os dados cadastrados no sistema

🖥️ Sistema Web (CapixaStat v4)
A versão atual é um sistema web funcional desenvolvido em HTML, CSS e JavaScript,
com dashboards interativos, gráficos em tempo real e navegação completa entre módulos.

Para visualizar:
1. Baixe o arquivo `CapixaStat_v4.html`
2. Abra no navegador (Chrome, Firefox ou Edge)
3. Nenhuma instalação necessária

> Recomendado visualizar em desktop para melhor experiência.

🔄 Evolução em React (pasta `web-react/`)
Em paralelo ao MVP, o frontend está sendo reescrito em **React + Vite + TypeScript**
(pasta `web-react/`), preparando o sistema para uma arquitetura componentizada e
integrada ao backend. Para rodar localmente:

```
cd web-react
npm install
npm run dev
```

🗄️ Backend (pasta `backend/`)
API REST em **Node.js + Express** com autenticação via **JWT**, senhas protegidas com
**bcrypt** e persistência em banco **PostgreSQL hospedado na nuvem (Supabase)**.
Rotas para autenticação, jogadores e partidas.

🎥 Exibição em Vídeo
Vídeo demonstrando o funcionamento e a explicação do projeto:

🔗 Assista aqui:
👉 https://youtu.be/AtuLAsqaVMQ

📄 Relatório
O relatório completo do PI3 está disponível no repositório:

📎 [Baixar Relatório](https://github.com/cborba733/Capixastat/raw/main/relatorio_pi3_capixastat.pdf) · [Visualizar no GitHub](https://github.com/cborba733/Capixastat/blob/main/relatorio_pi3_capixastat.pdf)

📊 Ciência de Dados no Projeto
O sistema aplica conceitos de ciência de dados para:

- Análise de desempenho dos jogadores
- Criação de indicadores (KPIs)
- Classificação e ranking de atletas
- Comparação entre jogadores
- Geração de insights automáticos para tomada de decisão

📌 Origem dos dados
O sistema utiliza **dados reais** da temporada 2026 do futebol capixaba, coletados de
fontes públicas e integrados à plataforma:

- **Resultados e eventos das partidas:** FlashScore
- **Estatísticas individuais dos atletas** (gols, assistências, jogos, cartões, minutos),
  por competição (Capixabão, Série D, Copa Verde, Copa do ES e Copa do Brasil):
  Transfermarkt e oGol
- **Fotos dos jogadores:** API da SofaScore (com opção de upload manual de foto)
- **Escudos e logos dos clubes:** TheSportsDB e Transfermarkt
- **Auxiliar Tático com IA** ("Dossiê do Adversário"): API do Google Gemini
  (usa a chave do próprio usuário, salva apenas no navegador)

> Sobre as camadas de dados: indicadores como gols, assistências, jogos e o **Score Geral**
> (calculado pelo próprio sistema) partem de dados reais. Já os **gráficos de radar e mapas
> de calor são ilustrativos** nesta fase — a análise por **visão computacional (YOLOv8)** sobre
> vídeos de jogo é o próximo passo planejado do projeto.

⚙️ Tecnologias Utilizadas

✔️ Frontend
- HTML, CSS e JavaScript (MVP `CapixaStat_v4.html`)
- React + Vite + TypeScript (evolução em `web-react/`)
- Chart.js (gráficos e visualizações)
- Figma (protótipo)

✔️ Backend e dados
- Node.js + Express (API REST)
- Autenticação JWT + bcrypt
- PostgreSQL hospedado na nuvem (Supabase)

✔️ Integrações e APIs
- FlashScore (resultados de partidas)
- Transfermarkt e oGol (estatísticas dos atletas)
- SofaScore (fotos dos jogadores)
- TheSportsDB (escudos dos clubes)
- Google Gemini (auxiliar tático com IA)

🔜 Planejadas para evolução
- Python (análise de dados) — Pandas, NumPy
- YOLOv8 (visão computacional — prova de conceito)
- Machine learning para análise preditiva

🚀 Status do Projeto
📍 Fase atual: Entrega C3 — PI3

O projeto encontra-se na terceira entrega, com foco em:

- Sistema web funcional com dashboards interativos
- Integração de dados reais do futebol capixaba (temporada 2026)
- Backend com API REST, autenticação e banco de dados na nuvem
- Auxiliar tático com inteligência artificial
- Início da migração do frontend para React

🔮 Evoluções Futuras
- Análise automática de vídeos com visão computacional (YOLOv8)
- Machine learning para análise preditiva
- Métricas avançadas: xG (gols esperados) e ELO
- Conclusão da migração do frontend para React
