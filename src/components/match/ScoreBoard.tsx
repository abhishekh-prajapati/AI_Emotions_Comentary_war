import React from 'react';
import { useMatchStore } from '../../store/matchStore';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

export const ScoreBoard: React.FC = () => {
  const { matchState, isLive, playSpeed, startLive, pauseLive, resetMatch, setPlaySpeed } = useMatchStore();
  const { battingTeam, bowlingTeam, target, status, winProbability } = matchState;

  const currentStriker = battingTeam.batsmen.find(b => b.isStriker);
  const nonStriker = battingTeam.batsmen.find(b => !b.isStriker);
  const activeBowler = bowlingTeam.bowlers[Math.floor(battingTeam.overs) % bowlingTeam.bowlers.length];

  const currentOverFloat = battingTeam.overs;
  const completedOvers = Math.floor(currentOverFloat);
  const currentOverBallCount = Math.round((currentOverFloat - completedOvers) * 10);

  return (
    <div className="glass-panel" style={{ padding: 'var(--grid-3)', display: 'flex', flexDirection: 'column', gap: 'var(--grid-2)' }}>
      {/* Ticker & Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="badge badge-live" style={{ verticalAlign: 'middle', marginRight: '8px' }}>LIVE</span>
          <span style={{ fontSize: 'var(--fs-small)', color: 'var(--text-secondary)' }}>{matchState.matchName}</span>
        </div>
        
        {/* Playback Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setPlaySpeed(playSpeed === 3000 ? 6000 : 3000)}
            className="btn-secondary"
            style={{ minHeight: '32px', padding: '0 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Toggle simulation speed"
          >
            <Zap size={12} color={playSpeed === 3000 ? 'var(--accent-primary)' : 'currentColor'} />
            {playSpeed === 3000 ? 'Fast' : 'Normal'}
          </button>
          
          <button
            onClick={isLive ? pauseLive : startLive}
            className="btn-primary"
            style={{ minHeight: '32px', padding: '0 12px', borderRadius: '4px' }}
          >
            {isLive ? <Pause size={14} /> : <Play size={14} />}
            <span style={{ fontSize: '12px' }}>{isLive ? 'Pause' : 'Simulate'}</span>
          </button>
          
          <button
            onClick={resetMatch}
            className="btn-secondary"
            style={{ minHeight: '32px', width: '32px', padding: 0 }}
            title="Reset Match"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Primary Score Board */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{battingTeam.name}</h2>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {battingTeam.score}/{battingTeam.wickets}
            </span>
            <span style={{ fontSize: 'var(--fs-large)', color: 'var(--text-secondary)' }}>
              ({battingTeam.overs} Overs)
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 'var(--fs-small)', color: 'var(--text-muted)' }}>Target: {target}</span>
          <p style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px', marginTop: '4px' }}>
            {status}
          </p>
        </div>
      </div>

      {/* Batter & Bowler stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--grid-2)', fontSize: 'var(--fs-small)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        {/* Batsmen */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span style={{ flex: 2 }}>Batsman</span>
            <span style={{ flex: 1, textAlign: 'right' }}>R(B)</span>
            <span style={{ flex: 1, textAlign: 'right' }}>4s/6s</span>
          </div>
          {battingTeam.batsmen.map(b => (
            <div key={b.name} style={{ display: 'flex', color: b.isStriker ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: b.isStriker ? 700 : 400 }}>
              <span style={{ flex: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {b.name}{b.isStriker ? '*' : ''}
              </span>
              <span style={{ flex: 1, textAlign: 'right' }}>{b.runs}({b.balls})</span>
              <span style={{ flex: 1, textAlign: 'right' }}>{b.fours}/{b.sixes}</span>
            </div>
          ))}
        </div>

        {/* Bowler */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
          <div style={{ display: 'flex', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span style={{ flex: 2 }}>Bowler</span>
            <span style={{ flex: 1, textAlign: 'right' }}>O-M-R-W</span>
          </div>
          {activeBowler && (
            <div style={{ display: 'flex', color: 'var(--text-primary)', fontWeight: 600 }}>
              <span style={{ flex: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeBowler.name}
              </span>
              <span style={{ flex: 1, textAlign: 'right' }}>
                {activeBowler.overs}-{activeBowler.maidens}-{activeBowler.runs}-{activeBowler.wickets}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Win Probability Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-small)', color: 'var(--text-secondary)' }}>
          <span>Win Probability: {battingTeam.name}</span>
          <span style={{ fontWeight: 600 }}>{winProbability}%</span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${winProbability}%`, background: 'var(--accent-primary)', transition: 'width 0.4s ease' }} />
          <div style={{ flex: 1, background: '#ef4444' }} />
        </div>
      </div>
    </div>
  );
};
export default ScoreBoard;
