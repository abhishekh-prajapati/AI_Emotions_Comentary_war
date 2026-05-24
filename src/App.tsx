import React, { useEffect, useRef, useState } from 'react';
import { useMatchEngine } from './hooks/useMatchEngine';
import { useMatchStore } from './store/matchStore';
import { ScoreBoard } from './components/match/ScoreBoard';
import { BallTracker } from './components/match/BallTracker';
import { AgentSelector } from './components/agents/AgentSelector';
import { CommentaryFeed } from './components/commentary/CommentaryFeed';
import { LiveChat } from './components/chat/LiveChat';
import { SentimentGauge } from './components/dashboard/SentimentGauge';
import { AgentLeaderboard } from './components/dashboard/AgentLeaderboard';
import { Radio, Wifi } from 'lucide-react';

/* ─────────── Ambient background orbs ─────────── */
const AmbientOrbs: React.FC = () => (
  <div
    aria-hidden="true"
    style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}
  >
    <div style={{
      position: 'absolute', top: '-15%', left: '-10%',
      width: '50vw', height: '50vw',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)',
      animation: 'orb-drift-a 18s ease-in-out infinite alternate'
    }} />
    <div style={{
      position: 'absolute', bottom: '-20%', right: '-10%',
      width: '45vw', height: '45vw',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
      animation: 'orb-drift-b 22s ease-in-out infinite alternate'
    }} />
    <div style={{
      position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
      width: '30vw', height: '30vw',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)',
      animation: 'orb-drift-a 28s ease-in-out infinite alternate-reverse'
    }} />
  </div>
);

/* ─────────── Live broadcast ticker ─────────── */
const TICKER_MESSAGES = [
  '🏏 IND vs AUS • ICC T20 World Cup Final • Narendra Modi Stadium, Ahmedabad',
  '📡 6 AI Commentators broadcasting LIVE — Select your voices from the left panel',
  '🎙️ Crowdsourced Commentary™ — Real-time multi-agent cricket analysis',
  '🌐 40,000+ fans watching live in Stadium Chat — Join the conversation!',
  '⚡ Simulation speed: adjustable from 3s to 6s per ball',
];

const LiveTicker: React.FC = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % TICKER_MESSAGES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      background: 'rgba(16,185,129,0.06)',
      borderBottom: '1px solid rgba(16,185,129,0.15)',
      padding: '6px var(--grid-3)',
      fontSize: '11px',
      color: 'var(--text-secondary)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }}>
      <span style={{ color: 'var(--accent-primary)', fontWeight: 700, flexShrink: 0 }}>TICKER</span>
      <span
        key={idx}
        style={{ animation: 'slide-in-up 400ms ease forwards' }}
      >
        {TICKER_MESSAGES[idx]}
      </span>
    </div>
  );
};

/* ─────────── Header ─────────── */
const Header: React.FC = () => {
  const { isLive, matchState } = useMatchStore();
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!isLive) { setDots(''); return; }
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 600);
    return () => clearInterval(id);
  }, [isLive]);

  return (
    <header style={{
      position: 'relative',
      zIndex: 10,
      background: 'rgba(10,15,29,0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
    }}>
      <div style={{
        padding: '14px var(--grid-3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(16,185,129,0.08))',
            border: '1px solid rgba(16,185,129,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Radio size={18} color="var(--accent-primary)" className="animate-pulse-accent" />
          </div>
          <div>
            <h1 style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '0.08em', lineHeight: 1 }}>
              CRICKET<span style={{ color: 'var(--accent-primary)' }}>VERSE</span>
            </h1>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              Multi-Agent AI Commentary Platform
            </span>
          </div>
        </div>

        {/* Center — Match Identity */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
            🇮🇳 IND &nbsp;vs&nbsp; AUS 🇦🇺
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>T20 World Cup Final</span>
        </div>

        {/* Right — Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isLive && (
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              Generating{dots}
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wifi
              size={14}
              color={isLive ? 'var(--accent-primary)' : 'var(--text-muted)'}
              style={{ transition: 'color 0.3s ease' }}
            />
            <span style={{ fontSize: '11px', color: isLive ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 600 }}>
              {isLive ? 'LIVE' : 'PAUSED'}
            </span>
          </div>
          <span
            className="badge badge-live"
            style={{ fontSize: '10px', letterSpacing: '0.06em' }}
          >
            ● Broadcasting
          </span>
          <span style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '3px 10px',
            fontWeight: 500
          }}>
            Win: <strong style={{ color: 'var(--accent-primary)' }}>{matchState.winProbability}%</strong> IND
          </span>
        </div>
      </div>
      <LiveTicker />
    </header>
  );
};

/* ─────────── Root App ─────────── */
export const App: React.FC = () => {
  useMatchEngine();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AmbientOrbs />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Header />

        {/* 3-column dashboard */}
        <main style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '300px 1fr 320px',
          gap: '12px',
          padding: '12px',
          height: 'calc(100vh - 95px)',
          overflow: 'hidden'
        }}>
          {/* ── Left: Agent Selector + Sentiment + Leaderboard ── */}
          <section style={{
            display: 'flex', flexDirection: 'column', gap: '10px',
            overflowY: 'auto', paddingRight: '4px'
          }}>
            <AgentSelector />
            <SentimentGauge />
            <AgentLeaderboard />
          </section>

          {/* ── Center: Score + Ball Tracker + Commentary ── */}
          <section style={{
            display: 'flex', flexDirection: 'column', gap: '10px',
            overflow: 'hidden'
          }}>
            <ScoreBoard />
            <BallTracker />
            <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
              <CommentaryFeed />
            </div>
          </section>

          {/* ── Right: Live Fan Chat ── */}
          <section style={{ overflow: 'hidden' }}>
            <LiveChat />
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
