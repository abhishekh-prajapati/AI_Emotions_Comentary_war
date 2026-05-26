import React, { useEffect, useState } from 'react';
import { useMatchStore } from '../../store/matchStore';
import { Play, Pause, RotateCcw, Zap, RefreshCw, Link2, Radio } from 'lucide-react';

export const ScoreBoard: React.FC = () => {
  const {
    matchState,
    isLive,
    playSpeed,
    mode,
    liveUrl,
    liveMatchList,
    isLoadingLiveMatches,
    startLive,
    pauseLive,
    resetMatch,
    setPlaySpeed,
    setMode,
    setLiveUrl,
    fetchLiveMatchesList
  } = useMatchStore();

  const { battingTeam, bowlingTeam, target, status, winProbability } = matchState;
  const [customUrl, setCustomUrl] = useState(liveUrl || '');
  const [selectedMatchLink, setSelectedMatchLink] = useState('');

  useEffect(() => {
    if (mode === 'live') {
      fetchLiveMatchesList();
    }
  }, [mode, fetchLiveMatchesList]);

  // Sync customUrl state with liveUrl from store
  useEffect(() => {
    if (liveUrl) {
      setCustomUrl(liveUrl);
    }
  }, [liveUrl]);

  const currentStriker = battingTeam.batsmen.find(b => b.isStriker);
  const nonStriker = battingTeam.batsmen.find(b => !b.isStriker);
  
  // Calculate active bowler based on overs bowled
  const activeBowler = bowlingTeam.bowlers.length > 0
    ? bowlingTeam.bowlers[Math.floor(battingTeam.overs) % bowlingTeam.bowlers.length]
    : null;

  const handleConnectLive = () => {
    const urlToUse = selectedMatchLink || customUrl;
    if (!urlToUse) return;
    
    // Check if it's a cricinfo link, if so we try to convert it or use it.
    // In our liveScraper, cleanCricbuzzUrl can handle numeric IDs or full Cricbuzz URLs.
    // If Cricinfo link is selected, let's extract the team names and ID to direct to Cricbuzz if possible,
    // or just pass it in (we'll try to support both, or guide to Cricbuzz).
    let targetUrl = urlToUse;
    if (urlToUse.includes('espncricinfo.com')) {
      // E.g. https://www.espncricinfo.com/series/sri-lanka-vs-afghanistan-1412534/sri-lanka-vs-afghanistan-3rd-t20i-1412547/live-cricket-score
      // We can notify the user or extract ID. Actually, we can just fetch cricinfo XML.
      // Let's assume we clean and point to the link.
    }
    
    setLiveUrl(targetUrl);
    startLive();
  };

  const handleSelectFromList = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedMatchLink(val);
    if (val) {
      setCustomUrl(val);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: 'var(--grid-3)', display: 'flex', flexDirection: 'column', gap: 'var(--grid-2)' }}>
      {/* Tabs for Mode Selection */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '6px',
        padding: '2px',
        border: '1px solid var(--border-color)'
      }}>
        <button
          onClick={() => { pauseLive(); setMode('simulation'); }}
          style={{
            background: mode === 'simulation' ? 'rgba(16,185,129,0.15)' : 'transparent',
            color: mode === 'simulation' ? 'var(--text-primary)' : 'var(--text-muted)',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 0',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            minHeight: '32px',
            transition: 'all 0.2s ease'
          }}
        >
          🎮 Simulation (IND vs AUS)
        </button>
        <button
          onClick={() => { pauseLive(); setMode('live'); }}
          style={{
            background: mode === 'live' ? 'rgba(16,185,129,0.15)' : 'transparent',
            color: mode === 'live' ? 'var(--text-primary)' : 'var(--text-muted)',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 0',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            minHeight: '32px',
            transition: 'all 0.2s ease'
          }}
        >
          📡 Real Live Match
        </button>
      </div>

      {/* Mode Controls */}
      {mode === 'simulation' ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="badge badge-live" style={{ verticalAlign: 'middle', marginRight: '8px' }}>SIM</span>
            <span style={{ fontSize: 'var(--fs-small)', color: 'var(--text-secondary)' }}>T20 World Cup Final</span>
          </div>
          
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
      ) : (
        /* Real Live Match Configuration Controls */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {/* Dropdown of active matches from RSS */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <select
                value={selectedMatchLink}
                onChange={handleSelectFromList}
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  minHeight: '36px',
                  outline: 'none'
                }}
              >
                <option value="">-- Choose Ongoing Live Match --</option>
                {liveMatchList.map(m => (
                  <option key={m.id} value={m.link}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => fetchLiveMatchesList()}
              className="btn-secondary"
              style={{ minHeight: '36px', width: '36px', padding: 0 }}
              title="Refresh active matches"
              disabled={isLoadingLiveMatches}
            >
              <RefreshCw size={14} className={isLoadingLiveMatches ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Cricbuzz Custom URL Input */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0 8px' }}>
              <Link2 size={12} color="var(--text-muted)" style={{ marginRight: '6px' }} />
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Enter Cricbuzz Match URL or ID"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '11px',
                  outline: 'none',
                  minHeight: '34px'
                }}
              />
            </div>
            
            <button
              onClick={isLive ? pauseLive : handleConnectLive}
              className="btn-primary"
              style={{ minHeight: '36px', padding: '0 12px' }}
              disabled={!customUrl && !selectedMatchLink}
            >
              {isLive ? <Pause size={14} /> : <Radio size={14} className="animate-pulse" />}
              <span style={{ fontSize: '11px' }}>{isLive ? 'Pause' : 'Stream'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Primary Score Board */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {battingTeam.name || 'No Match Loaded'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {battingTeam.score}/{battingTeam.wickets}
            </span>
            <span style={{ fontSize: 'var(--fs-large)', color: 'var(--text-secondary)' }}>
              ({battingTeam.overs} Overs)
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: 'var(--fs-small)', color: 'var(--text-muted)' }}>
            {target ? `Target: ${target}` : 'First Innings'}
          </span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Req. Rate: {target ? ((target - battingTeam.score) / Math.max(0.1, (20 - battingTeam.overs))).toFixed(2) : 'N/A'}
          </span>
        </div>
      </div>

      {/* Broadcast Status Banner */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.15)',
        borderRadius: '6px',
        padding: '8px 12px',
        fontSize: '12px',
        color: 'var(--accent-primary)',
        fontWeight: 600,
        textAlign: 'center',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
      }}>
        {status || 'Connect a live match stream to begin.'}
      </div>

      {/* Batter & Bowler stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 'var(--grid-3)',
        fontSize: 'var(--fs-small)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        paddingTop: '16px',
        paddingBottom: '16px'
      }}>
        {/* Batsmen */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span>Batsman</span>
            <span style={{ textAlign: 'right' }}>R (B)</span>
            <span style={{ textAlign: 'right' }}>4s / 6s</span>
          </div>
          {battingTeam.batsmen.map(b => (
            <div key={b.name} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr', color: b.isStriker ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: b.isStriker ? 700 : 400 }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {b.name}{b.isStriker ? '*' : ''}
              </span>
              <span style={{ textAlign: 'right' }}>{b.runs} ({b.balls})</span>
              <span style={{ textAlign: 'right' }}>{b.fours} / {b.sixes}</span>
            </div>
          ))}
        </div>

        {/* Bowler */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '1px solid var(--border-color)', paddingLeft: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span>Bowler</span>
            <span style={{ textAlign: 'right' }}>O-M-R-W</span>
          </div>
          {activeBowler && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', color: 'var(--text-primary)', fontWeight: 600 }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeBowler.name}
              </span>
              <span style={{ textAlign: 'right' }}>
                {activeBowler.overs}-{activeBowler.maidens}-{activeBowler.runs}-{activeBowler.wickets}
              </span>
            </div>
          )}
        </div>
      </div>


      {/* Win Probability Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-small)', color: 'var(--text-secondary)' }}>
          <span>Win Probability: {battingTeam.name || 'Batting Team'}</span>
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

