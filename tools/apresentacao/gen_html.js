// Gera a apresentação HTML (arquivo único, imagens embutidas)
const fs = require('fs'), path = require('path');
const { layout, C } = require('./layout.js');
const spec = JSON.parse(fs.readFileSync(path.join(__dirname, 'slides.json'), 'utf8'));
const OUT = process.argv[2];
const img64 = {}; const b64 = f => img64[f] || (img64[f] = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, 'telas', f)).toString('base64'));
const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const hexA = (h, a) => 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4, 6), 16) + ',' + a + ')';
const pos = e => `left:${e.x}px;top:${e.y}px;width:${e.w}px;height:${e.h}px`;

function el(e) {
  switch (e.k) {
    case 'glow': return '<div class="glow"></div>';
    case 'chip': return `<div class="chip" style="left:${e.x}px;top:${e.y}px;height:${e.h}px">${esc(e.t)}</div>`;
    case 'logo': return `<div class="logo" style="${pos(e)}">Capixa<span>Stat</span></div>`;
    case 'text': return `<div class="tx" style="${pos(e)};font-size:${e.size}px;color:#${e.color};font-weight:${e.bold ? 700 : 400};line-height:${e.lh || 1.3};justify-content:${e.valign === 'middle' ? 'center' : 'flex-start'};text-align:${e.align || 'left'}">${esc(e.t)}</div>`;
    case 'list': return `<ul class="lst" style="${pos(e)};font-size:${e.size}px;color:#${e.color}">${e.itens.map(i => '<li>' + esc(i) + '</li>').join('')}</ul>`;
    case 'img': return `<img class="shot${e.sombra ? ' sombra' : ''}" style="${pos(e)}${e.borda ? ';border:2px solid #' + e.borda : ''}" src="${b64(e.f)}" alt="">`;
    case 'badge': return `<div class="badge" style="${pos(e)};color:#${e.cor};background:${hexA(e.cor, .14)};border-color:${hexA(e.cor, .6)};font-size:${e.grande ? 14 : 13}px">${esc(e.t)}</div>`;
    case 'card': return `<div class="card" style="${pos(e)};border-color:#${e.cor || C.borda};background:${e.tint ? hexA(e.cor, .10) : '#' + C.card}"></div>`;
    case 'seta': return `<svg class="seta" style="left:0;top:0;width:1280px;height:720px"><defs><marker id="m" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#${C.marca}"/></marker></defs><line x1="${e.x1}" y1="${e.y1}" x2="${e.x2}" y2="${e.y2}" stroke="#${C.marca}" stroke-width="3" marker-end="url(#m)"/></svg>`;
  }
  throw new Error('elemento ' + e.k);
}
const slides = spec.slides.map((s, i) => `<section class="slide${i ? '' : ' on'}" data-notas="${esc(s.notas || '')}" aria-label="Slide ${i + 1}: ${esc(s.titulo)}">${layout(s).map(el).join('')}<div class="num">${i + 1} / ${spec.slides.length}</div></section>`).join('\n');

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>CapixaStat — Apresentação v5</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:#050810}
body{overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:#${C.texto}}
#palco{position:absolute;top:50%;left:50%;width:1280px;height:720px;transform-origin:center center;background:#${C.bg};overflow:hidden}
.slide{position:absolute;inset:0;display:none}
.slide.on{display:block}
.slide>*{position:absolute}
.glow{width:760px;height:760px;right:-200px;top:-260px;background:radial-gradient(circle,rgba(91,149,255,.16),transparent 65%)}
.chip{display:flex;align-items:center;padding:0 16px;border:1px solid rgba(91,149,255,.55);border-radius:999px;color:#${C.marca};font-size:14px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;white-space:nowrap}
.logo{font-size:88px;font-weight:800;font-style:italic;letter-spacing:-2px;line-height:1}
.logo span{color:#${C.marca}}
.tx{display:flex;flex-direction:column}
.lst{list-style:none;display:flex;flex-direction:column;gap:18px;line-height:1.38}
.lst li{position:relative;padding-left:22px}
.lst li::before{content:'';position:absolute;left:0;top:.5em;width:9px;height:9px;border-radius:3px;background:#${C.marca}}
.shot{object-fit:contain;border-radius:12px;border:1px solid #${C.borda};background:#0b111d}
.shot.sombra{box-shadow:0 18px 44px rgba(0,0,0,.55)}
.badge{display:flex;align-items:center;justify-content:center;border:1px solid;border-radius:999px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;white-space:nowrap}
.card{border:1px solid;border-radius:16px}
.seta{pointer-events:none}
.num{right:28px;bottom:18px;font-size:13px;color:#${C.muted}}
#notas{position:fixed;left:0;right:0;bottom:0;max-height:34vh;overflow:auto;background:rgba(5,8,16,.96);border-top:1px solid #${C.borda};color:#d7e2f2;font:16px/1.5 Arial,sans-serif;padding:14px 22px;display:none}
#notas.on{display:block}
#ajuda{position:fixed;right:14px;top:10px;font:12px Arial,sans-serif;color:#566377}
@media print{#ajuda,#notas{display:none}}
</style></head><body>
<div id="palco">
${slides}
</div>
<div id="notas"></div>
<div id="ajuda" style="transition:opacity 1s">← → avançar · F tela cheia · N notas</div>
<script>
(function(){
  var s=[].slice.call(document.querySelectorAll('.slide')),i=0,p=document.getElementById('palco'),n=document.getElementById('notas');
  function ajusta(){var k=Math.min(innerWidth/1280,innerHeight/720);p.style.transform='translate(-50%,-50%) scale('+k+')';}
  function vai(j){i=Math.max(0,Math.min(s.length-1,j));s.forEach(function(e,k){e.classList.toggle('on',k===i);});n.textContent=s[i].getAttribute('data-notas');try{history.replaceState(null,'','#'+(i+1));}catch(e){}}
  addEventListener('resize',ajusta);ajusta();
  addEventListener('keydown',function(e){
    if(['ArrowRight','PageDown',' ','Enter'].indexOf(e.key)>=0){e.preventDefault();vai(i+1);}
    else if(['ArrowLeft','PageUp','Backspace'].indexOf(e.key)>=0){e.preventDefault();vai(i-1);}
    else if(e.key==='Home')vai(0);else if(e.key==='End')vai(s.length-1);
    else if(e.key==='f'||e.key==='F'){if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen();}
    else if(e.key==='n'||e.key==='N')n.classList.toggle('on');
  });
  document.getElementById('palco').addEventListener('click',function(e){vai(e.clientX>innerWidth/2?i+1:i-1);});
  setTimeout(function(){document.getElementById('ajuda').style.opacity=0;},4000);vai((parseInt((location.hash||'#1').slice(1),10)||1)-1);
})();
</script>
</body></html>`;
fs.writeFileSync(OUT, html);
console.log('HTML', OUT, Math.round(html.length / 1024) + ' KB', spec.slides.length + ' slides');
