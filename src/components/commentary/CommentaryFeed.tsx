import React from 'react';
import { useCommentaryStore } from '../../store/commentaryStore';
import { useUIStore } from '../../store/uiStore';
import { CommentaryCard } from './CommentaryCard';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { agentManager } from '../../agents/AgentManager';

export const CommentaryFeed: React.FC = () => {
  const { commentaries } = useCommentaryStore();
  const { activeAgentIds, filters } = useUIStore();
  const profiles = agentManager.getProfiles();

  // Filter commentaries by active commentators + tone + language + expertise + query
  const filteredCommentaries = commentaries.filter(c => {
    const isAgentActive = activeAgentIds.includes(c.agentId);
    if (!isAgentActive) return false;

    // Search query matches commentator name or text
    const matchesSearch = c.text.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      c.agentName.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const profile = profiles.find(p => p.id === c.agentId);
    if (!profile) return false;

    const matchesTone = filters.selectedTones.length === 0 || filters.selectedTones.includes(profile.tone);
    const matchesExpertise = filters.selectedExpertise.length === 0 || filters.selectedExpertise.includes(profile.expertise);
    const matchesLang = filters.selectedLanguages.length === 0 || filters.selectedLanguages.includes(profile.language);

    return matchesSearch && matchesTone && matchesExpertise && matchesLang;
  });

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--grid-2)',
        padding: 'var(--grid-3)', // Strict 24px padding
        height: '100%',
        minHeight: '450px',
        maxHeight: '620px',
        overflow: 'hidden'
      }}
    >
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--fs-large)', fontWeight: 700 }}>
          <MessageSquare size={18} color="var(--accent-primary)" />
          Crowdsourced Commentary Feed
        </h3>
        <span style={{ fontSize: 'var(--fs-small)', color: 'var(--text-muted)' }}>
          Showing {filteredCommentaries.length} of {commentaries.length} entries
        </span>
      </div>

      {/* Feed list */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px' }}>
        {activeAgentIds.length === 0 ? (
          /* Empty state 1 - No agents active */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '100%', textAlign: 'center', padding: 'var(--grid-4)' }}>
            <AlertCircle size={36} color="var(--text-muted)" />
            <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>All Commentators are muted!</p>
            <p style={{ fontSize: 'var(--fs-small)', color: 'var(--text-muted)', maxWidth: '240px' }}>
              Select and unmute commentators from the left panel to start hearing their voices!
            </p>
          </div>
        ) : filteredCommentaries.length === 0 ? (
          /* Empty state 2 - Filters matched nothing */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '100%', textAlign: 'center', padding: 'var(--grid-4)' }}>
            <MessageSquare size={36} color="var(--text-muted)" />
            <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No matches found</p>
            <p style={{ fontSize: 'var(--fs-small)', color: 'var(--text-muted)', maxWidth: '240px' }}>
              Try broadening your search query or removing tone/language filters.
            </p>
          </div>
        ) : (
          filteredCommentaries.map(entry => (
            <CommentaryCard key={entry.id} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
};
export default CommentaryFeed;
