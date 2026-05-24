import React from 'react';
import { useMatchStore } from '../../store/matchStore';

export const BallTracker: React.FC = () => {
  const { matchState } = useMatchStore();
  const { recentBalls } = matchState;

  const getBallColor = (ball: string) => {
    if (ball === 'W') return '#ef4444'; // Red
    if (ball === '6' || ball === '4') return '#10b981'; // Green
    if (ball === 'Nb' || ball === 'Wd') return '#f59e0b'; // Yellow/Orange
    return 'rgba(255, 255, 255, 0.15)'; // Slate Gray
  };

  return (
    <div className="glass-panel" style={{ padding: '16px var(--grid-3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--grid-2)' }}>
      <span style={{ fontSize: 'var(--fs-small)', color: 'var(--text-secondary)', fontWeight: 600 }}>This Over:</span>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {recentBalls.length === 0 ? (
          <span style={{ fontSize: 'var(--fs-small)', color: 'var(--text-muted)', fontStyle: 'italic' }}>Waiting for the first ball...</span>
        ) : (
          recentBalls.map((ball, idx) => (
            <div
              key={idx}
              className="animate-ball"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: getBallColor(ball),
                color: ball === 'W' || ball === '6' || ball === '4' ? '#ffffff' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '11px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              {ball}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default BallTracker;
