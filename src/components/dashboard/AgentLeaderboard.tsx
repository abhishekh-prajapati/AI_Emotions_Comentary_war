import React from 'react';
import { useCommentaryStore } from '../../store/commentaryStore';
import { agentManager } from '../../agents/AgentManager';
import { AgentId } from '../../types';
import { Trophy, Star, ThumbsUp } from 'lucide-react';

export const AgentLeaderboard: React.FC = () => {
  const { commentaries } = useCommentaryStore();
  const profiles = agentManager.getProfiles();

  // Aggregate static likes + live commentary upvotes
  const getAgentTotalLikes = (id: AgentId) => {
    const profile = profiles.find(p => p.id === id);
    const baseLikes = profile?.likes || 0;
    const liveLikes = commentaries
      .filter(c => c.agentId === id)
      .reduce((sum, curr) => sum + curr.likes, 0);
    return baseLikes + liveLikes;
  };

  const rankedAgents = [...profiles]
    .map(p => ({
      ...p,
      totalLikes: getAgentTotalLikes(p.id)
    }))
    .sort((a, b) => b.totalLikes - a.totalLikes);

  return (
    <div className="glass-panel" style={{ padding: 'var(--grid-3)', display: 'flex', flexDirection: 'column', gap: 'var(--grid-2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        <Trophy size={16} color="#eab308" />
        <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>Commentator Popularity</h4>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {rankedAgents.map((agent, index) => {
          const isTop = index === 0;
          return (
            <div
              key={agent.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: isTop ? 'rgba(234, 179, 8, 0.06)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isTop ? 'rgba(234,179,8,0.2)' : 'var(--border-color)'}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, width: '16px', color: isTop ? '#eab308' : 'var(--text-muted)' }}>
                  #{index + 1}
                </span>
                <span style={{ fontSize: '16px' }}>{agent.avatar}</span>
                <span style={{ fontSize: 'var(--fs-medium)', fontWeight: 600 }}>{agent.name.split(' ')[0]}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isTop ? '#eab308' : 'var(--text-secondary)' }}>
                <ThumbsUp size={11} fill={isTop ? '#eab308' : 'transparent'} />
                <span style={{ fontSize: 'var(--fs-small)', fontWeight: 600 }}>{agent.totalLikes}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AgentLeaderboard;
