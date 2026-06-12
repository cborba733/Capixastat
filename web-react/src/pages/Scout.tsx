import { useState } from 'react';
import { clubs } from '../data/mockData';
import { Save, UserPlus, Clock } from 'lucide-react';

const Scout = () => {
  const [homeTeam, setHomeTeam] = useState(clubs[0].name);
  const [awayTeam, setAwayTeam] = useState(clubs[1].name);

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Análise de Jogo e Scout</h1>
        <p className="text-secondary">Registro manual colaborativo de eventos da partida</p>
      </div>

      <div className="grid grid-cols-3">
        {/* Painel de Configuração da Partida */}
        <div className="card" style={{ padding: '1.5rem', gridColumn: 'span 1', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Dados da Partida</h2>
          
          <div className="input-group">
            <label>Competição (Opcional)</label>
            <input type="text" className="input-field" placeholder="Ex: Capixabão Série B" />
          </div>

          <div className="input-group">
            <label>Time Mandante</label>
            <select className="input-field" value={homeTeam} onChange={e => setHomeTeam(e.target.value)}>
              {clubs.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label>Time Visitante</label>
            <select className="input-field" value={awayTeam} onChange={e => setAwayTeam(e.target.value)}>
              {clubs.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          <button className="btn btn-primary w-full mt-4">
            <Save size={18} /> Iniciar Scout
          </button>
        </div>

        {/* Console Módulo Analítico */}
        <div className="card" style={{ padding: '0', gridColumn: 'span 2', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem' }}>Eventos no Jogo (Tempo Real)</h2>
            <div className="badge badge-warning flex items-center gap-2">
              <Clock size={14} /> 45:00
            </div>
          </div>

          <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                <span className="text-secondary">{homeTeam}</span> <span className="text-gradient">2 - 0</span> <span className="text-secondary">{awayTeam}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
               <button className="btn" style={{ background: 'var(--accent-primary)', color: '#000', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <UserPlus size={24} />
                  <span>Ação + {homeTeam}</span>
               </button>
               <button className="btn" style={{ background: 'var(--accent-secondary)', color: '#000', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <UserPlus size={24} />
                  <span>Ação + {awayTeam}</span>
               </button>
            </div>
            
            <p className="text-secondary text-center" style={{ fontSize: '0.9rem', maxWidth: '400px' }}>
              Este é o módulo interativo de captação de dados (MVP). Num ambiente real, os toques e passes seriam adicionados a um log e vinculados à nossa estrutura de KPIs (Nota Capixaba).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scout;
