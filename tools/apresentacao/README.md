# Apresentação do CapixaStat (HTML + PPTX)

Gera `CapixaStat_Apresentacao.html` e `CapixaStat_Apresentacao.pptx` (na raiz) a partir de um único roteiro.

1. Site rodando em `http://localhost:5510` (servidor estático da pasta do projeto).
2. `npm i pptxgenjs puppeteer-core` nesta pasta (o Chrome instalado é usado pelo puppeteer-core).
3. `node captura.js` → tira as telas para `telas/` (as telas com "demo" usam dados de demonstração, avisados no slide).
4. Recorte da barra lateral: ver o trecho com Pillow no histórico (arquivos `*-c.jpg`) e atualize `tamanhos.json`.
5. `node gen_html.js ../../CapixaStat_Apresentacao.html` e `node gen_pptx.js ../../CapixaStat_Apresentacao.pptx`
   (`gen_pptx.js` usa o `apply_theme.js` da skill de PPTX; ajuste o caminho `SK` se for rodar em outra máquina).
6. `node qa_html.js <arquivo.html>` renderiza cada slide e avisa se algum texto estourou a caixa.

Conteúdo dos slides e notas do apresentador: `slides.json`. Posições (palco 1280 × 720): `layout.js`.
