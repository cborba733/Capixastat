export type Position = 'Goleiro' | 'Zagueiro' | 'Lateral' | 'Volante' | 'Meia' | 'Atacante';

export interface PlayerStats {
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  tackles: number;
  passesCompleted: number;
  shotsOnTarget: number;
}

export interface PlayerSkills {
  ritmo: number;
  finalizacao: number;
  passe: number;
  drible: number;
  defesa: number;
  fisico: number;
}

export interface Player {
  id: string;
  name: string;
  age: number;
  position: Position;
  club: string;
  photoUrl: string;
  clubLogoUrl: string;
  stats: PlayerStats;
  skills: PlayerSkills;
  capixabaScore: number; // A general rating calculated by the analytics
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: 'Goal' | 'Assist' | 'Yellow Card' | 'Red Card' | 'Substitution';
  playerInvolved: string;
  description: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  competition: string;
  events: MatchEvent[];
  videoUrl?: string; // For the POC CV representation
}

// ----------------------
// MOCK DATA
// ----------------------

export const clubs = [
  { name: 'Rio Branco AC', logoUrl: 'https://cdn.iconscout.com/icon/premium/png-512-thumb/shield-130-221081.png' },
  { name: 'Desportiva Ferroviária', logoUrl: 'https://cdn.iconscout.com/icon/premium/png-512-thumb/shield-130-221081.png' },
  { name: 'Serra FC', logoUrl: 'https://cdn.iconscout.com/icon/premium/png-512-thumb/shield-130-221081.png' },
  { name: 'Vitória FC', logoUrl: 'https://cdn.iconscout.com/icon/premium/png-512-thumb/shield-130-221081.png' },
  { name: 'Porto Vitória', logoUrl: 'https://cdn.iconscout.com/icon/premium/png-512-thumb/shield-130-221081.png' }
];

export const mockPlayers: Player[] = [
  {
    id: 'p1',
    name: 'Carlos ', // Adding some real sounding names
    age: 19,
    position: 'Atacante',
    club: 'Porto Vitória',
    photoUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=250&auto=format&fit=crop',
    clubLogoUrl: clubs[4].logoUrl,
    stats: { goals: 8, assists: 2, yellowCards: 1, redCards: 0, minutesPlayed: 650, tackles: 12, passesCompleted: 145, shotsOnTarget: 22 },
    skills: { ritmo: 85, finalizacao: 80, passe: 65, drible: 78, defesa: 30, fisico: 70 },
    capixabaScore: 82.5
  },
  {
    id: 'p2',
    name: 'João Silva',
    age: 21,
    position: 'Meia',
    club: 'Rio Branco AC',
    photoUrl: 'https://images.unsplash.com/photo-1506543730435-e2c1d4553a84?q=80&w=250&auto=format&fit=crop',
    clubLogoUrl: clubs[0].logoUrl,
    stats: { goals: 3, assists: 7, yellowCards: 2, redCards: 0, minutesPlayed: 810, tackles: 25, passesCompleted: 410, shotsOnTarget: 15 },
    skills: { ritmo: 72, finalizacao: 68, passe: 86, drible: 82, defesa: 55, fisico: 68 },
    capixabaScore: 78.0
  },
  {
    id: 'p3',
    name: 'Marcos Vinicius',
    age: 24,
    position: 'Zagueiro',
    club: 'Desportiva Ferroviária',
    photoUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=250&auto=format&fit=crop',
    clubLogoUrl: clubs[1].logoUrl,
    stats: { goals: 1, assists: 0, yellowCards: 4, redCards: 1, minutesPlayed: 900, tackles: 58, passesCompleted: 350, shotsOnTarget: 2 },
    skills: { ritmo: 65, finalizacao: 40, passe: 60, drible: 50, defesa: 88, fisico: 85 },
    capixabaScore: 76.5
  },
  {
    id: 'p4',
    name: 'Lucas Pereira',
    age: 18,
    position: 'Atacante',
    club: 'Serra FC',
    photoUrl: 'https://images.unsplash.com/photo-1616117325514-c10427b5f106?q=80&w=250&auto=format&fit=crop',
    clubLogoUrl: clubs[2].logoUrl,
    stats: { goals: 5, assists: 1, yellowCards: 0, redCards: 0, minutesPlayed: 450, tackles: 8, passesCompleted: 95, shotsOnTarget: 18 },
    skills: { ritmo: 88, finalizacao: 76, passe: 58, drible: 80, defesa: 25, fisico: 65 },
    capixabaScore: 74.0
  },
   {
    id: 'p5',
    name: 'Bruno Alves',
    age: 22,
    position: 'Volante',
    club: 'Vitória FC',
    photoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=250&auto=format&fit=crop',
    clubLogoUrl: clubs[3].logoUrl,
    stats: { goals: 0, assists: 4, yellowCards: 5, redCards: 0, minutesPlayed: 850, tackles: 65, passesCompleted: 580, shotsOnTarget: 5 },
    skills: { ritmo: 70, finalizacao: 55, passe: 80, drible: 72, defesa: 82, fisico: 80 },
    capixabaScore: 79.2
  }
];

export const mockMatches: Match[] = [
  {
    id: 'm1',
    homeTeam: 'Rio Branco AC',
    awayTeam: 'Desportiva Ferroviária',
    homeScore: 2,
    awayScore: 1,
    date: '2024-03-20',
    competition: 'Campeonato Capixaba - Rodada 7',
    events: [
      { id: 'e1', minute: 14, type: 'Yellow Card', playerInvolved: 'Marcos Vinicius', description: 'Falta dura no meio de campo' },
      { id: 'e2', minute: 32, type: 'Goal', playerInvolved: 'João Silva', description: 'Chute de fora da área' },
      { id: 'e3', minute: 65, type: 'Goal', playerInvolved: 'Desportiva Player', description: 'Gol de cabeça' },
      { id: 'e4', minute: 88, type: 'Goal', playerInvolved: 'Rio Branco Player', description: 'Gol de pênalti' }
    ],
    videoUrl: 'https://example.com/video1.mp4'
  },
  {
    id: 'm2',
    homeTeam: 'Porto Vitória',
    awayTeam: 'Serra FC',
    homeScore: 3,
    awayScore: 0,
    date: '2024-03-24',
    competition: 'Campeonato Capixaba - Rodada 8',
    events: [
      { id: 'e5', minute: 10, type: 'Goal', playerInvolved: 'Carlos', description: 'Gol após rápido contra-ataque' },
      { id: 'e6', minute: 42, type: 'Assist', playerInvolved: 'Carlos', description: 'Passe rasteiro na área' },
      { id: 'e7', minute: 75, type: 'Goal', playerInvolved: 'Porto Player', description: 'Chute no ângulo' }
    ]
  }
];
