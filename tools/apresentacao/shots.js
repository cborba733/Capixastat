// Capturas para a apresentação. Telas com "demo" usam dados de DEMONSTRAÇÃO (o slide avisa).
module.exports = [
  { nome: 'dashboard', prep: () => { goTo('dashboard'); document.querySelector('.main').scrollTo(0, 0); } },
  { nome: 'time', prep: () => { goTo('time'); document.querySelector('.main').scrollTo(0, 0); } },
  { nome: 'time-elo', prep: () => { goTo('time'); }, seletor: '#time-elo', espera: 2200 },
  { nome: 'time-timing', prep: () => { goTo('time'); }, seletor: '#time-timing', espera: 2200 },
  { nome: 'vitrine', prep: () => { goTo('jogadores'); document.querySelector('.main').scrollTo(0, 0); } },
  { nome: 'perfil', prep: () => { var p = Object.values(PLAYERS).find(x => x.nome === 'Breninho'); showPlayer(p.id); document.querySelector('.main').scrollTo(0, 0); }, espera: 2200 },
  { nome: 'campo-x',  prep: () => { var p = Object.values(PLAYERS).find(x => x.nome === 'Breninho'); showPlayer(p.id); }, seletor: '#p-per90', espera: 2200 },
  { nome: 'comparativo', prep: () => { goTo('comparativo'); setTimeout(() => { var s1 = document.getElementById('cmp-p1'), ops = [...s1.options].map(o => o.value).filter(v => PLAYERS[v] && PLAYERS[v].pos === 'Atacante' && playerAgg(PLAYERS[v]).minutos > 300);
      s1.value = ops[0]; s1.dispatchEvent(new Event('change')); setTimeout(() => { var s2 = document.getElementById('cmp-p2'); s2.value = ops[1]; s2.dispatchEvent(new Event('change')); }, 500); }, 700); }, seletor: '#cmp-tabela', espera: 3000 },
  { nome: 'scout-demo', prep: () => {
      goTo('scout');
      var k = document.getElementById('sc-partida').value, ats = [...document.getElementById('sc-atleta').options].map(o => o.value).filter(Boolean);
      var ev = [[4, 'passe_chave', 'certo', 70, 40], [9, 'finalizacao', 'fora', 80, 62], [13, 'desarme', 'certo', 35, 30], [18, 'drible', 'certo', 72, 20], [21, 'finalizacao', 'no_alvo', 88, 46], [27, 'interceptacao', 'certo', 40, 55],
        [31, 'finalizacao', 'gol', 92, 52], [36, 'falta', 'certo', 50, 50], [44, 'passe_chave', 'errado', 66, 70], [52, 'finalizacao', 'bloqueado', 84, 35], [58, 'drible', 'errado', 60, 80], [63, 'cartao', 'amarelo', 45, 45],
        [67, 'finalizacao', 'no_alvo', 79, 58], [71, 'passe_chave', 'certo', 74, 30], [77, 'finalizacao', 'gol', 95, 44], [83, 'desarme', 'certo', 30, 60], [88, 'finalizacao', 'fora', 76, 25]];
      ev.forEach(function (e, i) { CSStore.add('eventos', { partida: k, clube: 'Rio Branco ES', atletaId: ats[(i * 3) % ats.length], tipo: e[1], resultado: e[2], minuto: e[0], x: e[3], y: e[4] }); });
      scRender(); document.querySelector('.main').scrollTo(0, 0); }, espera: 2200 },
  { nome: 'scout-xg', prep: () => { goTo('scout'); }, seletor: '#sc-shotmap', espera: 1500 },
  { nome: 'scout-momentum', prep: () => { goTo('scout'); }, seletor: '#sc-momentum', espera: 1800 },
  { nome: 'lance-demo', prep: () => {
      goTo('simulador'); simNew(); SIM.frames[0].caption = 'Meu time em 4-3-3 contra o 4-4-2 do adversário';
      document.getElementById('sim-comp').checked = true; document.getElementById('sim-comp-lado').value = 'both'; simRender(); }, seletor: '.sim-stage', espera: 1500 },
  { nome: 'lance-comp', prep: () => { }, seletor: '#sim-comp-out', espera: 300 },
  { nome: 'dossie', prep: () => {
      goTo('taticas'); setTimeout(() => { document.getElementById('dossie-fab').click(); setTimeout(() => { var s = document.getElementById('dossie-select'); s.value = 'Vitória ES'; _dossieGenerate(); }, 300); }, 600); }, seletor: '#dossie-report .dossie-resumo', espera: 2600 },
  { nome: 'dossie-timing', prep: () => { }, seletor: '#dossie-report .dossie-tm', espera: 400 },
  { nome: 'campo', prep: () => { var o = document.getElementById('dossie-overlay'); if (o) o.classList.remove('open'); goTo('taticas'); document.querySelector('.main').scrollTo(0, 0); }, espera: 2000 },
  { nome: 'antropometria-demo', prep: () => {
      goTo('formacao'); switchFormTab('antropometria', document.querySelectorAll('.form-tab')[5]);
      var id = document.getElementById('antro-player-sel').value, all = matAll();
      all[id] = { nasc: '', sexo: 'M', registros: [], antropo: [
        { data: '2026-09-01', massa: 74.0, estatura: 178, per_torax: 96.0, per_cintura: 80.5, per_coxa_d: 55.2, per_coxa_e: 53.1, per_pant_d: 37.8, per_pant_e: 37.2, dc_peitoral: 8, dc_abdominal: 14, dc_coxa: 10, dc_triceps: 7, dc_subescapular: 9 },
        { data: '2026-11-20', massa: 75.5, estatura: 178, per_torax: 97.1, per_cintura: 80.0, per_coxa_d: 55.8, per_coxa_e: 54.9, per_pant_d: 38.1, per_pant_e: 37.6, dc_peitoral: 7, dc_abdominal: 12, dc_coxa: 9, dc_triceps: 6.5, dc_subescapular: 8.5 }] };
      matSaveAll(all); ANTRO.regiao = 'coxa_d'; updateAntropometria(); document.querySelector('.main').scrollTo(0, 0); }, espera: 1500 },
  { nome: 'registro', prep: () => { goTo('formacao'); switchFormTab('registro', document.querySelectorAll('.form-tab')[3]); document.querySelector('.main').scrollTo(0, 0); }, espera: 1500 },
  { nome: 'video-demo', prep: () => {
      goTo('video'); var L = ['quadro,tempo_s,id,classe,time,x_px,y_px,x_m,y_m'];
      for (var q = 1; q <= 150; q++) { for (var i = 0; i < 10; i++) { L.push([q, (q / 25).toFixed(2), i + 1, 'pessoa', 'A', 0, 0, (22 + (i % 4) * 9 + q * 0.08 + Math.sin(q / 9 + i) * 2).toFixed(2), (9 + i * 5.2 + Math.cos(q / 11 + i) * 2).toFixed(2)].join(','));
        L.push([q, (q / 25).toFixed(2), i + 20, 'pessoa', 'B', 0, 0, (72 - (i % 4) * 7 + q * 0.04 + Math.cos(q / 8 + i) * 2).toFixed(2), (8 + i * 5.5 + Math.sin(q / 10 + i) * 2).toFixed(2)].join(',')); }
        L.push([q, (q / 25).toFixed(2), 500, 'bola', '', 0, 0, (35 + q * 0.25).toFixed(2), (30 + Math.sin(q / 6) * 8).toFixed(2)].join(',')); }
      vaCarregar(vaParseCsv(L.join('\n')), 'posicoes_demo.csv'); vaIrQuadro(70); }, seletor: '#va-analise .va-an', espera: 2200 },
  { nome: 'assistente', prep: () => { goTo('dashboard'); obStart(); OB.clube = 'Rio Branco ES'; OB.passo = 1; OB.funcao = 'Analista de Desempenho'; obRender(); }, espera: 900 },
  { nome: 'atleta-demo', prep: () => { document.getElementById('ob-overlay').hidden = true;
      var p = Object.values(PLAYERS).find(x => x.clube === 'Rio Branco ES' && x.pos === 'Atacante');
      setCurrentUser({ nome: p.nome, clube: 'Rio Branco ES', funcao: 'Atleta', atleta_id: p.id }); goTo('atleta'); renderAtleta(); atSet('sono', 2); atSet('fadiga', 3); atSet('estresse', 2); atSet('dor', 4); atSet('rpe', 6); }, seletor: '#at-body .at-card', espera: 1200 },
];
