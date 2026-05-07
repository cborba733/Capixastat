
import StatWidget from '../components/StatWidget';
import { Users, Activity, Target, Shield } from 'lucide-react';
import { mockPlayers, mockMatches } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  // Get some calculated basic stats from mockData
  const totalPlayers = mockPlayers.length;
  const recentMatches = mockMatches.length;
  
  // A simplistic ranking mock logic for the dashboard
  const topPlayers = [...mockPlayers].sort((a, b) => b.capixabaScore - a.capixabaScore).slice(0, 3);

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Painel Geral</h1>
          <p className="text-secondary">Visão estrutural do ecossistema capixaba</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/scout')}>
          <Activity size={18} />
          Registrar Jogo
        </button>
      </div>

      <div className="grid grid-cols-4 mb-8">
        <StatWidget title="Atletas Base" value={totalPlayers} icon={Users} trend="12%" isPositive={true} />
        <StatWidget title="Rodadas Analisadas" value={recentMatches} icon={Activity} />
        <StatWidget title="Média de Gols/Jogo" value="2.5" icon={Target} trend="0.3" isPositive={true} />
        <StatWidget title="Patrocinadores Ativos" value="2" icon={Shield} />
      </div>

      <div className="grid grid-cols-2">
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Ranking Estadual (Top 3)</h2>
          <div className="flex flex-col gap-4">
            {topPlayers.map((player, idx) => (
              <div 
                key={player.id} 
                className="flex items-center justify-between" 
                style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', cursor: 'pointer' }}
                onClick={() => navigate(`/jogador/${player.id}`)}
              >
                <div className="flex items-center gap-4">
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                    #{idx + 1}
                  </span>
                  <img src={player.photoUrl} alt={player.name} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{player.name}</div>
                    <div className="text-secondary" style={{ fontSize: '0.85rem' }}>{player.club}</div>
                  </div>
                </div>
                <div className="badge badge-primary">
                  {player.capixabaScore.toFixed(1)} PTS
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary w-full mt-4" onClick={() => navigate('/jogadores')}>
            Ver Vitrine Completa
          </button>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Últimas Atividades</h2>
          <div className="flex flex-col gap-4">
            {mockMatches[0].events.map((event) => (
              <div key={event.id} className="flex items-start gap-4" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ 
                  background: 'var(--bg-dark)', 
                  padding: '0.5rem', 
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: 'var(--accent-primary)',
                  minWidth: '50px',
                  textAlign: 'center'
                }}>
                  {event.minute}'
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{event.type} - {event.playerInvolved}</div>
                  <div className="text-secondary" style={{ fontSize: '0.9rem' }}>{event.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
