import React from 'react';

interface StatWidgetProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  isPositive?: boolean;
}

const StatWidget: React.FC<StatWidgetProps> = ({ title, value, icon: Icon, trend, isPositive }) => {
  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-secondary" style={{ fontSize: '1rem', fontWeight: 500 }}>{title}</h3>
        <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <Icon size={20} className="text-secondary" />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <h2 style={{ fontSize: '2rem', margin: 0 }}>{value}</h2>
        {trend && (
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: isPositive ? 'var(--accent-primary)' : 'var(--accent-danger)',
            background: isPositive ? 'rgba(0, 255, 136, 0.1)' : 'rgba(239, 35, 60, 0.1)',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            {isPositive ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatWidget;
