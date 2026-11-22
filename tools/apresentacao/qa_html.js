const puppeteer = require('puppeteer-core'), path = require('path'), fs = require('fs');
(async () => {
  const OUT = path.join(__dirname, 'qa'); fs.mkdirSync(OUT, { recursive: true });
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, defaultViewport: { width: 1280, height: 720 } });
  const p = await b.newPage(); const erros = []; p.on('pageerror', e => erros.push(e.message));
  await p.goto('file:///' + process.argv[2].replace(/\\/g, '/'), { waitUntil: 'load' });
  const n = await p.evaluate(() => document.querySelectorAll('.slide').length);
  const so = process.argv.slice(3).map(Number);
  for (let i = 1; i <= n; i++) { if (so.length && !so.includes(i)) continue;
    await p.evaluate(k => { location.hash = '#' + k; dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' })); for (let j = 1; j < k; j++) dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' })); }, i);
    await new Promise(r => setTimeout(r, 150));
    // estouro de texto: conteúdo maior que a caixa
    const est = await p.evaluate(() => [...document.querySelectorAll('.slide.on .tx, .slide.on .lst')].filter(e => e.scrollHeight > e.clientHeight + 2 || e.scrollWidth > e.clientWidth + 2).map(e => e.textContent.slice(0, 40)));
    if (est.length) console.log('ESTOURO slide', i, est);
    await p.screenshot({ path: path.join(OUT, 's' + String(i).padStart(2, '0') + '.jpg'), type: 'jpeg', quality: 80 });
  }
  console.log('slides', n, 'erros', erros);
  await b.close();
})();
