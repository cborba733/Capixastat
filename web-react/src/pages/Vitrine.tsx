import { useState } from 'react';
import PlayerCard from '../components/PlayerCard';
import { mockPlayers } from '../data/mockData';
import type { Position } from '../data/mockData';
import { Search, Filter } from 'lucide-react';

const Vitrine = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('Todas');

  const positions: (Position | 'Todas')[] = ['Todas', 'Goleiro', 'Zagueiro', 'Lateral', 'Volante', 'Meia', 'Atacante'];

  const filteredPlayers = mockPlayers.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          player.club.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === 'Todas' || player.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Vitrine de Jogadores</h1>
          <p className="text-secondary">Estatísticas consolidadas e análise de talentos capixabas</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="input-group" style={{ marginBottom: 0, flexDirection: 'row', alignItems: 'center', background: 'var(--bg-surface)', padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid var(--border-color)' }}>
            <Search size={18} className="text-secondary" />
            <input 
              type="text" 
              placeholder="Buscar atleta ou clube..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', marginLeft: '0.5rem' }}
            />
          </div>
          <button className="btn btn-secondary" style={{ borderRadius: '50px' }}>
            <Filter size={18} /> Filtros Avançados
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {positions.map(pos => (
          <button 
            key={pos}
            onClick={() => setPositionFilter(pos)}
            style={{
              padding: '0.5rem 1.2rem',
              borderRadius: '50px',
              border: '1px solid var(--border-color)',
              background: positionFilter === pos ? 'var(--accent-primary)' : 'var(--bg-surface)',
              color: positionFilter === pos ? '#000' : 'var(--text-secondary)',
              fontWeight: positionFilter === pos ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {pos}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4">
        {filteredPlayers.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
        {filteredPlayers.length === 0 && (
          <div className="text-secondary" style={{ gridColumn: 'span 4', textAlign: 'center', padding: '3rem' }}>
            Nenhum atleta encontrado para os filtros selecionados.
          </div>
        )}
      </div>
    </div>
  );
};

export default Vitrine;
