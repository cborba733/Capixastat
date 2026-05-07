import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { PlayerSkills } from '../data/mockData';

interface RadarChartProfileProps {
  skills: PlayerSkills;
  capixabaScore: number;
}

const RadarChartProfile: React.FC<RadarChartProfileProps> = ({ skills }) => {
  const data = [
    { subject: 'Ritmo', A: skills.ritmo, fullMark: 100 },
    { subject: 'Finalização', A: skills.finalizacao, fullMark: 100 },
    { subject: 'Passe', A: skills.passe, fullMark: 100 },
    { subject: 'Drible', A: skills.drible, fullMark: 100 },
    { subject: 'Defesa', A: skills.defesa, fullMark: 100 },
    { subject: 'Físico', A: skills.fisico, fullMark: 100 },
  ];

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.2)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Skills"
            dataKey="A"
            stroke="var(--accent-primary)"
            fill="var(--accent-primary)"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartProfile;
