import React from 'react';
import { useChatStore } from '../../store/chatStore';
import { Smile, Frown, TrendingUp } from 'lucide-react';

export const SentimentGauge: React.FC = () => {
  const { sentimentScore, sentimentLabel } = useChatStore();

  // Map -100 to 100 range to 0% to 100% progress width
  const scorePercent = ((sentimentScore + 100) / 200) * 100;

  const getGaugeColor = () => {
    if (sentimentScore >= 40) return '#10b981'; // Green
    if (sentimentScore <= -40) return '#ef4444'; // Red
    return '#f59e0b'; // Gold
  };

  return (
    <div className="glass-panel" style={{ padding: 'var(--grid-3)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>Live Crowd Sentiment</h4>
        <span style={{ fontSize: 'var(--fs-small)', fontWeight: 600, color: getGaugeColor() }}>
          {sentimentLabel} ({sentimentScore > 0 ? `+${sentimentScore}` : sentimentScore})
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Frown size={16} color="#ef4444" />
        
        {/* Progress Slider */}
        <div style={{ flex: 1, height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', overflow: 'hidden', position: 'relative' }}>
          {/* Middle marker */}
          <div style={{ position: 'absolute', left: '50%', width: '2px', height: '100%', background: 'rgba(255,255,255,0.2)' }} />
          
          <div
            style={{
              position: 'absolute',
              left: `${Math.min(50, scorePercent)}%`,
              width: `${Math.abs(scorePercent - 50)}%`,
              height: '100%',
              background: getGaugeColor(),
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </div>

        <Smile size={16} color="#10b981" />
      </div>

      <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
        Analyzing live fan chat and commentator signals using keyword sentiment weights.
      </p>
    </div>
  );
};
export default SentimentGauge;
