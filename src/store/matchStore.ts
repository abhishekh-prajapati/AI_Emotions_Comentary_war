import { create } from 'zustand';
import { MatchState, MatchEvent, LiveMatchInfo } from '../types';
import { getInitialMatchState, generateNextBall } from '../engine/matchEngine';
import { fetchLiveMatches } from '../engine/liveScraper';

interface MatchStore {
  matchState: MatchState;
  recentEvents: MatchEvent[];
  isLive: boolean;
  playSpeed: number; // Milliseconds per ball
  mode: 'simulation' | 'live';
  liveUrl: string;
  liveMatchList: LiveMatchInfo[];
  isLoadingLiveMatches: boolean;
  
  startLive: () => void;
  pauseLive: () => void;
  resetMatch: () => void;
  setPlaySpeed: (speed: number) => void;
  triggerNextBall: () => MatchEvent | null;
  setMode: (mode: 'simulation' | 'live') => void;
  setLiveUrl: (url: string) => void;
  fetchLiveMatchesList: () => Promise<void>;
  updateLiveMatchState: (nextState: MatchState, event: MatchEvent) => void;
}

export const useMatchStore = create<MatchStore>((set, get) => ({
  matchState: { ...getInitialMatchState(), mode: 'simulation', liveUrl: '' },
  recentEvents: [],
  isLive: false,
  playSpeed: 6000, // 6 seconds per ball
  mode: 'simulation',
  liveUrl: '',
  liveMatchList: [],
  isLoadingLiveMatches: false,

  startLive: () => set({ isLive: true }),
  pauseLive: () => set({ isLive: false }),
  
  resetMatch: () => set({
    matchState: { ...getInitialMatchState(), mode: get().mode, liveUrl: get().liveUrl },
    recentEvents: [],
    isLive: false
  }),

  setPlaySpeed: (speed: number) => set({ playSpeed: speed }),

  triggerNextBall: () => {
    const { matchState, recentEvents } = get();
    
    // Do not generate if all out or match won
    if (matchState.status.includes('won') || matchState.status.includes('All out') || matchState.status.includes('Australia won')) {
      set({ isLive: false });
      return null;
    }

    try {
      const { event, nextState } = generateNextBall(matchState);
      
      set({
        matchState: { ...nextState, mode: 'simulation' },
        recentEvents: [event, ...recentEvents].slice(0, 50) // keep last 50 events
      });
      
      return event;
    } catch (e) {
      console.error('Error generating next ball:', e);
      return null;
    }
  },

  setMode: (mode) => set((state) => ({
    mode,
    matchState: { ...state.matchState, mode }
  })),

  setLiveUrl: (liveUrl) => set((state) => ({
    liveUrl,
    matchState: { ...state.matchState, liveUrl }
  })),

  fetchLiveMatchesList: async () => {
    set({ isLoadingLiveMatches: true });
    try {
      const list = await fetchLiveMatches();
      set({ liveMatchList: list });
    } catch (error) {
      console.error('Error fetching live matches in store:', error);
    } finally {
      set({ isLoadingLiveMatches: false });
    }
  },

  updateLiveMatchState: (nextState, event) => {
    const { recentEvents } = get();
    set({
      matchState: { ...nextState, mode: 'live' },
      recentEvents: [event, ...recentEvents].slice(0, 50)
    });
  }
}));

