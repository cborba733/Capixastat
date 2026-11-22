// Layout comum (px num palco 1280×720). O HTML usa direto; o PPTX converte px → polegadas (13,333 in / 1280 px).
const TAM = require('./tamanhos.json');
const C = { bg: '0A0F18', card: '111A2B', card2: '16213A', borda: '24324D', texto: 'F0F4FF', muted: 'A3B3C9', marca: '5B95FF', marcaFill: '2563EB', ok: '22C55E', warn: 'FBBF24', rosa: 'F472B6' };
const F = { titulo: 38, ponto: 19, legenda: 15, chip: 14 };

function fit(f, x, y, w, h, alinhar) { // encaixa a imagem (contain) e centraliza
  const [iw, ih] = TAM[f]; const k = Math.min(w / iw, h / ih); const W = Math.round(iw * k), H = Math.round(ih * k);
  const X = alinhar === 'esq' ? x : alinhar === 'dir' ? x + w - W : Math.round(x + (w - W) / 2);
  return { k: 'img', f, x: X, y: Math.round(y + (h - H) / 2), w: W, h: H };
}
const chip = (t, x, y) => ({ k: 'chip', t, x, y, w: Math.max(120, Math.round(t.length * 8.6 + 34)), h: 30 });
const texto = (t, x, y, w, h, o = {}) => Object.assign({ k: 'text', t, x, y, w, h, size: F.ponto, color: C.texto }, o);
const selo = (t, img, cor) => ({ k: 'badge', t, x: img.x + img.w - Math.round(t.length * 8.2 + 30) - 14, y: img.y + 14, w: Math.round(t.length * 8.2 + 30), h: 28, cor: cor || C.warn });

function colunaEsq(s) { // chip + título + pontos na coluna da esquerda
  return [chip(s.chip, 64, 64), texto(s.titulo, 64, 108, 330, 200, { size: F.titulo, bold: true, valign: 'top', lh: 1.12 }),
    { k: 'list', itens: s.pontos, x: 64, y: 330, w: 330, h: 330, size: F.ponto, color: C.muted }];
}
function topo(s) { return [chip(s.chip, 64, 48), texto(s.titulo, 64, 90, 1152, 56, { size: F.titulo, bold: true })]; }
const AREA = { x: 430, y: 56, w: 786, h: 608 };

function layout(s) {
  const L = [];
  if (s.tipo === 'capa' || s.tipo === 'fim') {
    L.push({ k: 'glow' });
    if (s.chip) L.push(chip(s.chip, 64, 196));
    if (s.tipo === 'capa') L.push({ k: 'logo', x: 64, y: 240, w: 560, h: 96 });
    else L.push(texto(s.titulo, 64, 230, 560, 100, { size: 76, bold: true }));
    L.push(texto(s.sub, 64, s.tipo === 'capa' ? 348 : 340, 520, 70, { size: 24, color: s.tipo === 'fim' ? C.marca : C.muted }));
    if (s.rodape) L.push(texto(s.rodape, 64, 600, 520, 30, { size: 17, color: C.muted }));
    if (s.tipo === 'fim') L.push(texto('Perguntas?', 64, 420, 520, 40, { size: 22, color: C.muted }));
    L.push(Object.assign(fit(s.img, 640, 150, 600, 420), { sombra: true }));
    return L;
  }
  if (s.tipo === 'numeros') {
    L.push(...topo(s), texto(s.sub, 64, 156, 1000, 60, { size: F.ponto, color: C.muted }));
    s.stats.forEach((st, i) => {
      const x = 64 + i * 294, y = 236;
      L.push({ k: 'card', x, y, w: 270, h: 330 }, texto(st[0], x + 28, y + 34, 220, 84, { size: 72, bold: true, color: C.marca, lh: 1.05 }), texto(st[1], x + 28, y + 132, 220, 60, { size: 21, bold: true }),
        texto(st[2], x + 28, y + 200, 220, 110, { size: 17, color: C.muted, valign: 'top' }));
    });
    return L;
  }
  if (s.tipo === 'lado') {
    L.push(...colunaEsq(s));
    const im = Object.assign(fit(s.img, AREA.x, AREA.y, AREA.w, AREA.h), { sombra: true }); L.push(im);
    if (s.demo) L.push(selo('Dados de demonstração', im));
    if (s.aviso) L.push(Object.assign(selo(s.aviso, im, C.rosa), { y: im.y - 40 }));
    return L;
  }
  if (s.tipo === 'pilha') {
    L.push(...colunaEsq(s));
    const a = fit(s.imgs[0], 430, 70, 786, 300), b = fit(s.imgs[1], 430, 390, 786, 290);
    L.push(Object.assign(a, { sombra: true }), Object.assign(b, { sombra: true })); return L;
  }
  if (s.tipo === 'duo') {
    L.push(...topo(s));
    s.imgs.forEach((f, i) => { const x = 64 + i * 592, im = Object.assign(fit(f, x, 168, 560, 380), { sombra: true }); L.push(im, texto(s.legendas[i], x, 566, 560, 90, { size: F.ponto, color: C.muted, valign: 'top' })); });
    return L;
  }
  if (s.tipo === 'xg') {
    L.push(...colunaEsq(s));
    const a = Object.assign(fit(s.imgs[0], 430, 70, 430, 590), { sombra: true }), b = Object.assign(fit(s.imgs[1], 884, 70, 332, 260, 'esq'), { sombra: true });
    L.push(a, b, selo('Demonstração', a)); return L;
  }
  if (s.tipo === 'lance') {
    L.push(...colunaEsq(s));
    const a = Object.assign(fit(s.imgs[0], 430, 50, 786, 520), { sombra: true }), b = Object.assign(fit(s.imgs[1], 430, 586, 786, 90), { sombra: true });
    L.push(a, b); return L;
  }
  if (s.tipo === 'dossie') {
    L.push(...colunaEsq(s));
    const a = Object.assign(fit(s.imgs[0], 430, 56, 786, 500), { sombra: true }), b = Object.assign(fit(s.imgs[1], a.x, 574, a.w, 110, 'esq'), { sombra: true });
    L.push(a, b); return L;
  }
  if (s.tipo === 'formacao') {
    L.push(...colunaEsq(s));
    const a = Object.assign(fit(s.imgs[0], 430, 56, 786, 480, 'esq'), { sombra: true }), b = Object.assign(fit(s.imgs[1], 990, 360, 236, 300), { sombra: true, borda: C.marca });
    L.push(a, b, texto('Tela “Meu dia” do atleta', b.x - 230, b.y + b.h - 30, 216, 30, { size: F.legenda, color: C.marca, align: 'right' }), selo('Exemplo', b)); return L;
  }
  if (s.tipo === 'arquitetura') {
    L.push(...topo(s));
    const cx = [64, 480, 896], W = 320;
    const box = (x, y, h, t1, t2, cor, n) => { L.push({ k: 'card', x, y, w: W, h, cor }, texto(t1, x + 22, y + 18, W - 44, 30, { size: 21, bold: true, color: cor || C.texto }), texto(t2, x + 22, y + 54, W - 44, h - 64, { size: 16, color: C.muted, valign: 'top' }));
      if (n) L.push({ k: 'badge', t: n, x: x + W - 112, y: y + h - 40, w: 96, h: 26, cor: C.ok }); };
    box(cx[0], 190, 150, 'Navegador', 'CapixaStat v5: HTML, CSS e JavaScript · Chart.js · 17 telas', C.marca);
    box(cx[1], 190, 150, 'API Node.js', 'Express · login JWT · 8 perfis de acesso · OpenAPI', C.marca, '9 testes');
    box(cx[2], 190, 150, 'PostgreSQL', 'Supabase · jogos, registros, eventos, documentos, fontes', C.marca);
    box(cx[0], 420, 170, 'Visão computacional', 'YOLOv8 + ByteTrack · homografia · times pela cor → posicoes.csv', C.rosa, '14 testes');
    box(cx[1], 420, 170, 'Serviço Python', 'FastAPI + Pandas · percentis, Elo e xG com as mesmas fórmulas da tela', C.rosa, '8 testes');
    box(cx[2], 420, 170, 'Dados externos', 'TheSportsDB · importação diária · fonte e data na tela', C.rosa);
    L.push({ k: 'seta', x1: 384, y1: 265, x2: 480, y2: 265 }, { k: 'seta', x1: 800, y1: 265, x2: 896, y2: 265 }, { k: 'seta', x1: 1056, y1: 420, x2: 1056, y2: 340 },
      { k: 'seta', x1: 224, y1: 420, x2: 224, y2: 340 }, { k: 'seta', x1: 640, y1: 420, x2: 640, y2: 340 });
    L.push(texto('Publicação: Render (API) + Supabase (banco) · código no GitHub', 64, 632, 1152, 30, { size: F.legenda, color: C.muted }));
    return L;
  }
  if (s.tipo === 'integridade') {
    L.push(...topo(s));
    L.push(texto('Antes', 360, 168, 380, 26, { size: F.legenda, bold: true, color: C.muted }), texto('Agora', 812, 168, 400, 26, { size: F.legenda, bold: true, color: C.ok }));
    s.trocas.forEach((t, i) => { const y = 200 + i * 128;
      L.push(texto(t[0], 64, y + 34, 270, 50, { size: 22, bold: true }), { k: 'card', x: 360, y, w: 380, h: 104, cor: C.borda }, texto(t[1], 384, y + 18, 336, 70, { size: F.ponto, color: C.muted, valign: 'middle' }),
        { k: 'seta', x1: 750, y1: y + 52, x2: 798, y2: y + 52 }, { k: 'card', x: 812, y, w: 404, h: 104, cor: C.ok, tint: true }, texto(t[2], 836, y + 18, 360, 70, { size: F.ponto, valign: 'middle' })); });
    const selos = [['DADO REAL', C.ok], ['MEDIDO', C.ok], ['ESTIMATIVA', C.warn], ['NÃO VERIFICADO', C.warn]]; let x = 64;
    selos.forEach(([t, c]) => { const w = Math.round(t.length * 9 + 30); L.push({ k: 'badge', t, x, y: 610, w, h: 30, cor: c, grande: true }); x += w + 14; });
    L.push(texto('selos que aparecem em cada número', x + 6, 612, 440, 28, { size: F.legenda, color: C.muted }));
    return L;
  }
  if (s.tipo === 'proximos') {
    L.push(...topo(s));
    s.colunas.forEach((c, i) => { const x = 64 + i * 592, cor = i ? C.ok : C.warn;
      L.push({ k: 'card', x, y: 180, w: 560, h: 330, cor }, texto(c[0], x + 32, y0(), 500, 40, { size: 26, bold: true, color: cor }), { k: 'list', itens: c[1], x: x + 32, y: 272, w: 496, h: 220, size: 22, color: C.texto }); });
    L.push(texto('Propostas completas, com prioridade e dificuldade: docs/PROPOSTA_TATICAS.md e docs/PROPOSTA_FORMACAO.md', 64, 560, 1152, 30, { size: 17, color: C.muted }));
    function y0() { return 210; }
    return L;
  }
  throw new Error('tipo desconhecido ' + s.tipo);
}
module.exports = { layout, C, F };
