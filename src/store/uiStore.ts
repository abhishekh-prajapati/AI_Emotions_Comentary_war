import { create } from 'zustand';
import { AgentId, UIFilters } from '../types';
import { speechManager } from '../engine/speechManager';

interface UIStore {
  activeAgentIds: AgentId[];
  filters: UIFilters;
  pinnedAgentIds: AgentId[];
  activePanel: 'match' | 'agents' | 'leaderboard';
  isAudioOn: boolean;
  activeSpeakingAgentId: AgentId | null;
  
  toggleAgent: (id: AgentId) => void;
  pinAgent: (id: AgentId) => void;
  setSearchQuery: (query: string) => void;
  toggleFilterTone: (tone: string) => void;
  toggleFilterExpertise: (expertise: string) => void;
  toggleFilterLanguage: (lang: string) => void;
  clearFilters: () => void;
  setActivePanel: (panel: 'match' | 'agents' | 'leaderboard') => void;
  toggleAudio: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeAgentIds: ['emotion-analyst', 'fan-agent', 'tactical-coach', 'meme-agent', 'betting-risk', 'local-fan'], // Select all by default for crowdsourced volume!
  pinnedAgentIds: [],
  activePanel: 'match',
  isAudioOn: false,
  activeSpeakingAgentId: null,
  filters: {
    selectedTones: [],
    selectedExpertise: [],
    selectedLanguages: [],
    searchQuery: ''
  },

  toggleAgent: (id) => set((state) => {
    const isSelected = state.activeAgentIds.includes(id);
    const activeAgentIds = isSelected
      ? state.activeAgentIds.filter(aid => aid !== id)
      : [...state.activeAgentIds, id];
    return { activeAgentIds };
  }),

  pinAgent: (id) => set((state) => {
    const isPinned = state.pinnedAgentIds.includes(id);
    const pinnedAgentIds = isPinned
      ? state.pinnedAgentIds.filter(aid => aid !== id)
      : [...state.pinnedAgentIds, id];
    return { pinnedAgentIds };
  }),

  setSearchQuery: (query) => set((state) => ({
    filters: { ...state.filters, searchQuery: query }
  })),

  toggleFilterTone: (tone) => set((state) => {
    const { selectedTones } = state.filters;
    const next = selectedTones.includes(tone)
      ? selectedTones.filter(t => t !== tone)
      : [...selectedTones, tone];
    return { filters: { ...state.filters, selectedTones: next } };
  }),

  toggleFilterExpertise: (expertise) => set((state) => {
    const { selectedExpertise } = state.filters;
    const next = selectedExpertise.includes(expertise)
      ? selectedExpertise.filter(e => e !== expertise)
      : [...selectedExpertise, expertise];
    return { filters: { ...state.filters, selectedExpertise: next } };
  }),

  toggleFilterLanguage: (lang) => set((state) => {
    const { selectedLanguages } = state.filters;
    const next = selectedLanguages.includes(lang)
      ? selectedLanguages.filter(l => l !== lang)
      : [...selectedLanguages, lang];
    return { filters: { ...state.filters, selectedLanguages: next } };
  }),

  clearFilters: () => set({
    filters: {
      selectedTones: [],
      selectedExpertise: [],
      selectedLanguages: [],
      searchQuery: ''
    }
  }),

  setActivePanel: (activePanel) => set({ activePanel }),
  toggleAudio: () => set((state) => {
    const nextAudio = !state.isAudioOn;
    if (!nextAudio) {
      speechManager.stop();
    }
    return { isAudioOn: nextAudio };
  })
}));

export default useUIStore;
