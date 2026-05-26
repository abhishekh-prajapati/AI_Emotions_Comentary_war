import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { Smile, Send, Flame, Award, Heart } from 'lucide-react';

export const LiveChat: React.FC = () => {
  const { messages, sentimentScore, sentimentLabel, addMessage, addReaction } = useChatStore();
  const [inputText, setInputText] = useState('');


  // Messages are stacked newest on top, so no scroll-to-bottom needed.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const wasSent = addMessage(inputText);
    if (wasSent) {
      setInputText('');
    }
  };

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'positive') return '#10b981';
    if (sentiment === 'negative') return '#ef4444';
    return 'var(--text-muted)';
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '620px',
        padding: 'var(--grid-3)', // Strict 24px padding
        gap: 'var(--grid-2)'
      }}
    >
      {/* Chat Header with Mood Meter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Stadium Chat</h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{messages.length} active fans</span>
        </div>

        {/* NLP Aggregated Vibe */}
        <div style={{ textAlign: 'right' }}>
          <span className="badge" style={{
            background: sentimentScore >= 15 ? 'rgba(16,185,129,0.1)' : sentimentScore <= -15 ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
            color: sentimentScore >= 15 ? '#10b981' : sentimentScore <= -15 ? '#ef4444' : 'var(--text-secondary)',
            fontSize: '10px'
          }}>
            Vibe: {sentimentLabel}
          </span>
        </div>
      </div>

      {/* Messages Scroll container */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
        {[...messages].reverse().map(msg => (
          <div
            key={msg.id}
            style={{
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px',
              border: '1px solid rgba(255,255,255,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 700, fontSize: '11px', color: 'var(--text-secondary)' }}>
                {msg.username}
              </span>
              <span style={{ fontSize: '9px', color: getSentimentColor(msg.sentiment) }}>
                ● {msg.sentiment}
              </span>
            </div>
            
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', wordBreak: 'break-word', lineHeight: 1.4 }}>
              {msg.text}
            </p>

            {/* Reactions list */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
              {['🔥', '🙌', '💯', '👏'].map(emoji => {
                const count = msg.reactions[emoji] || 0;
                return (
                  <button
                    key={emoji}
                    onClick={() => addReaction(msg.id, emoji)}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '2px 6px',
                      fontSize: '10px',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{emoji}</span>
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>


      {/* Input Form with validation */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
        <input
          type="text"
          className="glass-input"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          maxLength={120}
          style={{ flex: 1 }}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{ width: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          disabled={!inputText.trim()}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
export default LiveChat;
