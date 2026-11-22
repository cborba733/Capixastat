// Captura das telas do CapixaStat v5 para a apresentação (Chrome headless via puppeteer-core)
const puppeteer = require('puppeteer-core');
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, 'telas'); fs.mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:5510/CapixaStat_v5.html?v=apres';
const so = process.argv.slice(2); // nomes a capturar (vazio = todas)
const espera = ms => new Promise(r => setTimeout(r, ms));

const SHOTS = require('./shots.js');

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true,
    args: ['--hide-scrollbars', '--force-device-scale-factor=1'], defaultViewport: { width: 1600, height: 900, deviceScaleFactor: 1.25 } });
  const page = await browser.newPage();
  const erros = [];
  page.on('pageerror', e => erros.push(e.message));
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {});
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('capixastat_current', JSON.stringify({ nome: 'Caio Borba', clube: 'Rio Branco ES', funcao: 'Analista de Desempenho' }));
    localStorage.setItem('capixastat_v5_onboard_Caio Borba', 'apresentacao');
  });
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {});
  await espera(3500);
  await page.addStyleTag({ content: '.toast,#cs-toast,.cs-toast{display:none!important} *{animation-duration:0s!important;transition:none!important}' });
  for (const s of SHOTS) {
    if (so.length && !so.includes(s.nome)) continue;
    try {
      await page.evaluate(s.prep);
      await espera(s.espera || 1600);
      const arq = path.join(OUT, s.nome + '.jpg');
      if (s.seletor) {
        const el = await page.$(s.seletor);
        await el.screenshot({ path: arq, type: 'jpeg', quality: 88 });
      } else {
        await page.screenshot({ path: arq, type: 'jpeg', quality: 88, clip: s.clip || undefined });
      }
      console.log('ok', s.nome);
    } catch (e) { console.log('ERRO', s.nome, e.message); }
  }
  console.log('erros JS:', erros.length ? erros : 'nenhum');
  await browser.close();
})();
