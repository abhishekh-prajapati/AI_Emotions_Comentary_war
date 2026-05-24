import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { useCommentaryStore } from '../../store/commentaryStore';
import { agentManager } from '../../agents/AgentManager';
import { AgentId } from '../../types';
import { Star, Volume2, VolumeX, Heart, Search } from 'lucide-react';

export const AgentSelector: React.FC = () => {
  const {
    activeAgentIds,
    pinnedAgentIds,
    filters,
    toggleAgent,
    pinAgent,
    setSearchQuery,
    toggleFilterTone,
    toggleFilterExpertise,
    toggleFilterLanguage,
    clearFilters
  } = useUIStore();

  const { commentaries } = useCommentaryStore();
  const profiles = agentManager.getProfiles();

  // Aggregate likes from store
  const getAgentLikes = (id: AgentId) => {
    const staticLikes = profiles.find(p => p.id === id)?.likes || 0;
    const liveLikes = commentaries
      .filter(c => c.agentId === id)
      .reduce((sum, curr) => sum + curr.likes, 0);
    return staticLikes + liveLikes;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter profiles based on search & filter tags
  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(filters.searchQuery.toLowerCase());
    
    const matchesTone = filters.selectedTones.length === 0 || filters.selectedTones.includes(p.tone);
    const matchesExpertise = filters.selectedExpertise.length === 0 || filters.selectedExpertise.includes(p.expertise);
    const matchesLang = filters.selectedLanguages.length === 0 || filters.selectedLanguages.includes(p.language);

    return matchesSearch && matchesTone && matchesExpertise && matchesLang;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--grid-2)' }}>
      {/* Search and Filters */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--grid-1)' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="glass-input"
            placeholder="Search commentators..."
            value={filters.searchQuery}
            onChange={handleSearch}
            style={{ paddingLeft: '36px' }}
          />
        </div>

        {/* Filter Badges Grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
          {['Dramatic', 'Passionate', 'Analytical', 'Humorous', 'Pragmatic', 'Colloquial'].map(tone => {
            const isActive = filters.selectedTones.includes(tone);
            return (
              <button
                key={tone}
                onClick={() => toggleFilterTone(tone)}
                className="badge"
                style={{
                  background: isActive ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#052e16' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  fontSize: '10px'
                }}
              >
                {tone}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
        {filteredProfiles.map(p => {
          const isActive = activeAgentIds.includes(p.id);
          const isPinned = pinnedAgentIds.includes(p.id);
          const totalLikes = getAgentLikes(p.id);

          return (
            <div
              key={p.id}
              className="glass-card"
              style={{
                borderLeft: `4px solid ${p.color}`,
                padding: 'var(--grid-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--grid-2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <span style={{ fontSize: '24px' }}>{p.avatar}</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{p.name}</span>
                    {isPinned && <Star size={12} fill="currentColor" color="#eab308" />}
                  </div>
                  <span style={{ fontSize: 'var(--fs-small)', color: 'var(--text-muted)' }}>{p.role}</span>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '9px', color: 'var(--text-secondary)' }}>
                      {p.language}
                    </span>
                    <span className="badge" style={{ background: `${p.color}20`, color: p.color, fontSize: '9px' }}>
                      {p.expertise}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => pinAgent(p.id)}
                  style={{ background: 'transparent', border: 'none', color: isPinned ? '#eab308' : 'var(--text-muted)', cursor: 'pointer' }}
                  title="Pin Commentator"
                >
                  <Star size={16} fill={isPinned ? '#eab308' : 'transparent'} />
                </button>
                <button
                  className="btn-primary"
                  onClick={() => toggleAgent(p.id)}
                  style={{
                    background: isActive ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#052e16' : 'var(--text-secondary)',
                    minHeight: '32px',
                    padding: '0 8px',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  {isActive ? <Volume2 size={14} /> : <VolumeX size={14} />}
                  <span style={{ fontSize: '11px' }}>{isActive ? 'Listen' : 'Mute'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AgentSelector;
