import React, { useState } from 'react';
import { CommentaryEntry } from '../../types';
import { useCommentaryStore } from '../../store/commentaryStore';
import { Heart, Smile, AlertCircle, ArrowUp } from 'lucide-react';

interface CommentaryCardProps {
  entry: CommentaryEntry;
}

export const CommentaryCard: React.FC<CommentaryCardProps> = ({ entry }) => {
  const { likeCommentary } = useCommentaryStore();
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    likeCommentary(entry.id);
    setLiked(true);
    setTimeout(() => setLiked(false), 300);
  };

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === 'positive') return <Smile size={12} color="#10b981" />;
    if (sentiment === 'negative') return <AlertCircle size={12} color="#ef4444" />;
    return null;
  };

  return (
    <div
      className="glass-card animate-slide-in"
      style={{
        borderLeft: `4px solid ${entry.color}`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '24px' // Strict 24px padding rule
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>{entry.avatar}</span>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {entry.agentName}
            </h4>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>

        {/* NLP Sentiment Badge */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span
            className="badge"
            style={{
              background: entry.sentiment === 'positive' ? 'rgba(16,185,129,0.1)' : entry.sentiment === 'negative' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
              color: entry.sentiment === 'positive' ? '#10b981' : entry.sentiment === 'negative' ? '#ef4444' : 'var(--text-secondary)',
              fontSize: '9px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {getSentimentIcon(entry.sentiment)}
            {entry.sentiment}
          </span>
          
          {/* Excitement level */}
          <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '9px' }}>
            ⚡ {entry.excitement}/10
          </span>
        </div>
      </div>

      {/* Commentary text */}
      <p style={{ fontSize: 'var(--fs-medium)', color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
        {entry.text}
      </p>

      {/* Footer likes count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
        {/* Dynamic excitement bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Vibe Intensity:</span>
          <div style={{ width: '80px', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${entry.excitement * 10}%`, height: '100%', background: entry.color }} />
          </div>
        </div>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="btn-secondary"
          style={{
            minHeight: '32px',
            padding: '0 12px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: liked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.04)',
            borderColor: liked ? '#ef4444' : 'var(--border-color)',
            transform: liked ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
        >
          <Heart size={13} fill={liked || entry.likes > 2 ? '#ef4444' : 'transparent'} color={entry.likes > 2 ? '#ef4444' : 'currentColor'} />
          <span style={{ fontSize: '11px', fontWeight: 600 }}>{entry.likes}</span>
        </button>
      </div>
    </div>
  );
};
export default CommentaryCard;
