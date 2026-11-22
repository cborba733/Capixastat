// Gera a apresentação PPTX a partir do mesmo layout do HTML (px 1280×720 → LAYOUT_WIDE 13,333 × 7,5 in)
const fs = require('fs'), path = require('path');
const pptxgen = require('pptxgenjs');
const { layout, C } = require('./layout.js');
const SK = 'C:/Users/User/AppData/Local/Claude-Data/claude_pzs8sxrjxfjjc/local-agent-mode-sessions/skills-plugin/fc729da9-29c1-452e-bbc7-d48b8708f9b5/846c5d8a-e4ab-4939-a233-83d761897609/skills/pptx';
const { applyTheme } = require(SK + '/scripts/apply_theme.js');
const spec = JSON.parse(fs.readFileSync(path.join(__dirname, 'slides.json'), 'utf8'));
const OUT = process.argv[2];
const K = 13.333 / 1280, I = v => +(v * K).toFixed(3), PT = px => +(px * 0.75).toFixed(1);

const THEME = { name: 'CapixaStat', headFontFace: 'Arial', bodyFontFace: 'Arial',
  colors: { dk1: C.texto, lt1: C.bg, dk2: C.muted, lt2: C.card, accent1: C.marca, accent2: C.ok, accent3: C.warn, accent4: C.rosa, accent5: C.marcaFill, accent6: C.borda, hlink: C.marca, folHlink: C.muted } };

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = 'Caio Borba'; pres.title = 'CapixaStat — Apresentação v5'; pres.subject = 'Projeto Integrador 3 · ADS FAESA';
pres.theme = { headFontFace: 'Arial', bodyFontFace: 'Arial' };
const numero = { x: I(1180), y: I(690), w: I(80), h: I(22), color: C.muted, fontFace: 'Arial', fontSize: 10, align: 'right' };
// Layouts: fundo escuro e número do slide; o título vai num placeholder (lado ou topo)
pres.defineSlideMaster({ title: 'CAPA', background: { color: C.bg }, objects: [] });
pres.defineSlideMaster({ title: 'LADO', background: { color: C.bg }, slideNumber: numero,
  objects: [{ placeholder: { options: { name: 'title', type: 'title', x: I(64), y: I(108), w: I(330), h: I(200), fontFace: 'Arial', fontSize: PT(38), bold: true, color: C.texto, valign: 'top', align: 'left', margin: 0, lineSpacingMultiple: 1.05 }, text: '' } }] });
pres.defineSlideMaster({ title: 'TOPO', background: { color: C.bg }, slideNumber: numero,
  objects: [{ placeholder: { options: { name: 'title', type: 'title', x: I(64), y: I(90), w: I(1152), h: I(56), fontFace: 'Arial', fontSize: PT(38), bold: true, color: C.texto, valign: 'top', align: 'left', margin: 0 }, text: '' } }] });
const MASTER = { capa: 'CAPA', fim: 'CAPA', numeros: 'TOPO', duo: 'TOPO', arquitetura: 'TOPO', integridade: 'TOPO', proximos: 'TOPO' };

let n = 0; const nome = p => p + '-' + (++n);
function poe(sl, e, s) {
  const box = { x: I(e.x), y: I(e.y), w: I(e.w), h: I(e.h) };
  switch (e.k) {
    case 'glow': return;
    case 'chip':
      box.w = +(e.t.length * 0.098 + 0.42).toFixed(3); // o PowerPoint desenha caixa alta com espaçamento mais larga que o navegador
      sl.addText(e.t.toUpperCase(), Object.assign({}, box, { wrap: false, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.5, line: { color: C.marca, width: 1 }, fill: { color: C.bg },
        color: C.marca, bold: true, fontSize: 10.5, charSpacing: 1.5, margin: [0, 8, 0, 8], valign: 'middle', isTextBox: true, objectName: nome('chip') }));
      return;
    case 'logo':
      sl.addText([{ text: 'Capixa', options: { color: C.texto } }, { text: 'Stat', options: { color: C.marca } }], Object.assign({}, box, { fontSize: 66, bold: true, italic: true, margin: 0, valign: 'middle', isTextBox: true, objectName: 'logo' }));
      return;
    case 'text': {
      if (e.ehTitulo) return; // vai no placeholder
      sl.addText(e.t, Object.assign({}, box, { fontSize: PT(e.size), bold: !!e.bold, color: e.color, align: e.align || 'left', valign: e.valign === 'middle' ? 'middle' : 'top', margin: 0,
        lineSpacingMultiple: e.lh ? Math.max(0.9, e.lh * 0.9) : 1.05, fit: 'none', isTextBox: true, objectName: nome('texto') }));
      return;
    }
    case 'list':
      sl.addText(e.itens.map((t, i) => ({ text: t, options: { bullet: { indent: 16 }, breakLine: i < e.itens.length - 1, paraSpaceAfter: 12 } })),
        Object.assign({}, box, { fontSize: PT(e.size), color: e.color, valign: 'top', margin: 0, lineSpacingMultiple: 1.1, isTextBox: true, objectName: nome('lista') }));
      return;
    case 'img':
      sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: I(e.x - 2), y: I(e.y - 2), w: I(e.w + 4), h: I(e.h + 4), rectRadius: 0.08, fill: { color: e.borda || C.borda }, line: { color: e.borda || C.borda, width: 0.5 },
        shadow: e.sombra ? { type: 'outer', color: '000000', blur: 18, offset: 8, angle: 90, opacity: 0.45 } : undefined, objectName: nome('moldura') });
      sl.addImage({ path: path.join(__dirname, 'telas', e.f), x: box.x, y: box.y, w: box.w, h: box.h, altText: 'Tela do CapixaStat: ' + s.titulo, objectName: nome('tela') });
      return;
    case 'badge': {
      const direita = box.x + box.w; box.w = +(e.t.length * (e.grande ? 0.098 : 0.09) + 0.3).toFixed(3); if (!e.grande) box.x = +(direita - box.w).toFixed(3);
      sl.addText(e.t.toUpperCase(), Object.assign({}, box, { wrap: false, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.5, fill: { color: e.cor, transparency: 84 }, line: { color: e.cor, width: 1 },
        color: e.cor, bold: true, fontSize: e.grande ? 10.5 : 9.5, charSpacing: 0.5, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: nome('selo') }));
      return; }
    case 'card':
      sl.addShape(pres.shapes.ROUNDED_RECTANGLE, Object.assign({}, box, { rectRadius: 0.12, fill: e.tint ? { color: e.cor, transparency: 90 } : { color: C.card }, line: { color: e.cor || C.borda, width: 1 }, objectName: nome('cartao') }));
      return;
    case 'seta': {
      const x = Math.min(e.x1, e.x2), y = Math.min(e.y1, e.y2), w = Math.abs(e.x2 - e.x1), h = Math.abs(e.y2 - e.y1);
      sl.addShape(pres.shapes.LINE, { x: I(x), y: I(y), w: I(w) || 0.001, h: I(h) || 0.001, flipV: e.y2 < e.y1, line: { color: C.marca, width: 2.5, endArrowType: 'triangle' }, objectName: nome('seta') });
      return;
    }
  }
  throw new Error('elemento ' + e.k);
}
spec.slides.forEach((s, i) => {
  const master = MASTER[s.tipo] || 'LADO';
  const sl = pres.addSlide({ masterName: master });
  const els = layout(s);
  // o título de cada slide de conteúdo vai no placeholder do layout
  if (master !== 'CAPA') { const t = els.find(e => e.k === 'text' && e.t === s.titulo); if (t) t.ehTitulo = true; sl.addText(s.titulo, { placeholder: 'title' }); }
  els.forEach(e => poe(sl, e, s));
  if (s.notas) sl.addNotes(s.notas);
});
(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log('PPTX', OUT, Math.round(fs.statSync(OUT).size / 1024) + ' KB');
})();
