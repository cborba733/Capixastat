import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Player } from '../data/mockData';

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const navigate = useNavigate();

  return (
    <div className="card fade-in" style={{ cursor: 'pointer' }} onClick={() => navigate(`/jogador/${player.id}`)}>
      <div style={{ position: 'relative', height: '250px' }}>
        <img 
          src={player.photoUrl} 
          alt={player.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(15, 17, 26, 1), transparent)',
          height: '100px'
        }} />
        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          <img src={player.clubLogoUrl} alt={player.club} style={{ width: '40px', height: '40px' }} />
        </div>
        
        {/* Score Badge */}
        <div style={{ 
          position: 'absolute', 
          bottom: '1rem', 
          right: '1rem',
          background: 'var(--accent-primary)',
          color: '#000',
          padding: '0.5rem',
          borderRadius: '8px',
          fontWeight: 800,
          fontSize: '1.2rem',
          boxShadow: 'var(--shadow-glow)'
        }}>
          {player.capixabaScore.toFixed(1)}
        </div>
      </div>
      
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{player.name}</h3>
        <p className="text-secondary mb-4">{player.position} • {player.age} anos</p>
        
        <div className="grid grid-cols-3 gap-2" style={{ textAlign: 'center' }}>
          <div>
            <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Gols</div>
            <div style={{ fontWeight: 700 }}>{player.stats.goals}</div>
          </div>
          <div>
            <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Assists</div>
            <div style={{ fontWeight: 700 }}>{player.stats.assists}</div>
          </div>
          <div>
            <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Minutos</div>
            <div style={{ fontWeight: 700 }}>{player.stats.minutesPlayed}'</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
