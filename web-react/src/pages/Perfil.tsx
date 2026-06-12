
import { useParams, useNavigate } from 'react-router-dom';
import { mockPlayers } from '../data/mockData';
import RadarChartProfile from '../components/RadarChartProfile';
import { ChevronLeft, BrainCircuit, Play } from 'lucide-react';

const Perfil = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const player = mockPlayers.find(p => p.id === id);

  if (!player) return <div>Atleta não encontrado</div>;

  return (
    <div className="fade-in">
      <button className="btn btn-secondary mb-6" onClick={() => navigate(-1)} style={{ padding: '0.5rem 1rem' }}>
        <ChevronLeft size={18} /> Voltar
      </button>

      {/* Header Widget */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, var(--bg-surface), #151824)' }}>
        <img 
          src={player.photoUrl} 
          alt={player.name} 
          style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-primary)' }} 
        />
        <div style={{ flex: 1 }}>
          <div className="flex justify-between items-start">
            <div>
              <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{player.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <img src={player.clubLogoUrl} alt={player.club} style={{ width: '24px', height: '24px' }} />
                <span className="text-secondary" style={{ fontSize: '1.2rem' }}>{player.club} • {player.position}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Capixaba Score
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {player.capixabaScore.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        {/* Radar Chart Card */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Análise de Habilidades</h2>
          <RadarChartProfile skills={player.skills} capixabaScore={player.capixabaScore} />
        </div>

        {/* Estatisticas de Temporada */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Temporada Atual</h2>
          <div className="grid grid-cols-2 gap-4">
            <StatBox label="Gols Marcados" value={player.stats.goals} />
            <StatBox label="Assistências" value={player.stats.assists} />
            <StatBox label="Minutos em Campo" value={`${player.stats.minutesPlayed}'`} />
            <StatBox label="Passes Certos" value={player.stats.passesCompleted} />
            <StatBox label="Finalizações no Alvo" value={player.stats.shotsOnTarget} />
            <StatBox label="Desarmes" value={player.stats.tackles} />
          </div>
        </div>
      </div>

      {/* Visão Computacional POC Header */}
      <h2 style={{ fontSize: '1.8rem', marginTop: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BrainCircuit className="text-gradient" size={28} />
        Inteligência Artificial (POC)
      </h2>
      <p className="text-secondary mb-6">
        Estudo de Visão Computacional extraído via YOLOv8 (rodando assincronamente).
      </p>

      {/* POC Card */}
      <div className="card glass-panel" style={{ padding: '0', display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 2, position: 'relative', background: '#000', minHeight: '300px' }}>
          {/* Faking a heatmap video player frame */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '80%', height: '80%', 
              background: 'radial-gradient(circle at center, rgba(255, 0,0, 0.4) 0%, rgba(255,165,0,0.2) 30%, transparent 70%)',
              filter: 'blur(20px)'
            }}></div>
            <img 
              src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop" 
              alt="Soccer Pitch POC" 
              style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, zIndex: -1 }} 
            />
          </div>
          <button style={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: 'var(--accent-primary)', color: '#000',
            width: '60px', height: '60px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Play size={24} fill="#000" />
          </button>
          
          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
            Processado via Google Colab / YOLOv8 - Partida 24/03
          </div>
        </div>
        
        <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-secondary)' }}>Mapa de Calor e Tracking Automático</h3>
          <p className="text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
            A Prova de Conceito demonstra como algoritmos de *Deep Learning* são capazes de identificar e traçar
            a movimentação do atleta sem inserção manual de *scout*. O modelo gera *heatmaps* e calcula distância percorrida e posse de bola.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <div className="flex justify-between text-secondary mb-2" style={{ fontSize: '0.9rem' }}>
              <span>Raio de Ação (Ataque)</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>78%</span>
            </div>
            <div style={{ width: '100%', background: 'var(--bg-dark)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '78%', background: 'var(--accent-primary)', height: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value }: { label: string, value: string | number }) => (
  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
    <div className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>{label}</div>
    <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{value}</div>
  </div>
);

export default Perfil;
