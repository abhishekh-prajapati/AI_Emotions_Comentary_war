import { create } from 'zustand';
import { MatchState, MatchEvent } from '../types';
import { getInitialMatchState, generateNextBall } from '../engine/matchEngine';

interface MatchStore {
  matchState: MatchState;
  recentEvents: MatchEvent[];
  isLive: boolean;
  playSpeed: number; // Milliseconds per ball
  startLive: () => void;
  pauseLive: () => void;
  resetMatch: () => void;
  setPlaySpeed: (speed: number) => void;
  triggerNextBall: () => MatchEvent | null;
}

export const useMatchStore = create<MatchStore>((set, get) => ({
  matchState: getInitialMatchState(),
  recentEvents: [],
  isLive: false,
  playSpeed: 6000, // 6 seconds per ball

  startLive: () => set({ isLive: true }),
  pauseLive: () => set({ isLive: false }),
  
  resetMatch: () => set({
    matchState: getInitialMatchState(),
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
        matchState: nextState,
        recentEvents: [event, ...recentEvents].slice(0, 50) // keep last 50 events
      });
      
      return event;
    } catch (e) {
      console.error('Error generating next ball:', e);
      return null;
    }
  }
}));
