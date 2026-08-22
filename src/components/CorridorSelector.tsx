import React from 'react';
import { BricsCorridor } from '../types';
import { Compass, Flame, AlertTriangle } from 'lucide-react';

interface CorridorSelectorProps {
  corridors: BricsCorridor[];
  activeCorridorId: string;
  onSelectCorridor: (corridor: BricsCorridor) => void;
}

export const CorridorSelector: React.FC<CorridorSelectorProps> = ({
  corridors,
  activeCorridorId,
  onSelectCorridor
}) => {
  return (
    <div className="glass-panel" style={{ padding: '16px', marginBottom: '20px' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Compass size={14} color="var(--primary-cyan)" /> BRICS TRANS-BOUNDARY ECONOMIC CORRIDORS
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
        {corridors.map((corridor) => {
          const isActive = corridor.id === activeCorridorId;
          const flag = corridor.nations.includes('India') ? '🇮🇳' : corridor.nations.includes('China') ? '🇨🇳' : corridor.nations.includes('Brazil') ? '🇧🇷' : corridor.nations.includes('South Africa') ? '🇿🇦' : '🇷🇺';

          return (
            <div
              key={corridor.id}
              onClick={() => onSelectCorridor(corridor)}
              style={{
                background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                border: '1px solid',
                borderColor: isActive ? 'var(--primary-cyan)' : 'var(--border-color)',
                borderRadius: '10px',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '1rem' }}>{flag}</span>
                <span className={`badge ${corridor.status === 'Critical' ? 'badge-critical' : corridor.status === 'Warning' ? 'badge-warning' : 'badge-success'}`}>
                  AQI {corridor.currentAvgAqi}
                </span>
              </div>

              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: isActive ? 'white' : 'var(--text-muted)', marginBottom: '4px' }}>
                {corridor.name}
              </div>

              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={10} color={corridor.crossBorderRisk === 'High' ? '#f43f5e' : '#f59e0b'} />
                Cross-Border Risk: {corridor.crossBorderRisk}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
