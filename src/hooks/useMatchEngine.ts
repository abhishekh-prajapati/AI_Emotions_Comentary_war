import { useEffect, useRef } from 'react';
import { useMatchStore } from '../store/matchStore';
import { useCommentaryStore } from '../store/commentaryStore';
import { useChatStore } from '../store/chatStore';
import { useUIStore } from '../store/uiStore';
import { agentManager } from '../agents/AgentManager';
import { scrapeCricbuzzMatch } from '../engine/liveScraper';
import { speechManager } from '../engine/speechManager';

export function useMatchEngine() {
  const { isLive, playSpeed, triggerNextBall, matchState, mode, liveUrl, updateLiveMatchState } = useMatchStore();
  const { addCommentaries, commentaries } = useCommentaryStore();
  const { simulateChatFromEvent } = useChatStore();
  const { activeAgentIds } = useUIStore();

  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (!isLive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      speechManager.stop();
      return;
    }

    const runSimulationTick = () => {
      const event = triggerNextBall();
      if (event) {
        const freshState = useMatchStore.getState().matchState;
        const comms = agentManager.commentateOnEvent(
          event,
          freshState,
          useUIStore.getState().activeAgentIds,
          useCommentaryStore.getState().commentaries
        );
        addCommentaries(comms);
        comms.forEach(c => speechManager.speak(c.text, c.agentId));
        simulateChatFromEvent(event.runsScored, event.isWicket, event.batsman);
      }
    };

    const runLiveMatchTick = async () => {
      if (!liveUrl) return;
      const currentStoreState = useMatchStore.getState().matchState;
      const result = await scrapeCricbuzzMatch(liveUrl, currentStoreState);
      
      if (result) {
        updateLiveMatchState(result.state, result.newEvent || {
          ballId: `dummy_${Date.now()}`,
          over: result.state.battingTeam.overs,
          ballNumber: 0,
          runsScored: 0,
          isWicket: false,
          isExtra: false,
          batsman: result.state.battingTeam.batsmen[0]?.name || 'Batter',
          bowler: result.state.bowlingTeam.bowlers[0]?.name || 'Bowler',
          textDescription: result.state.status,
          timestamp: Date.now()
        });

        if (result.newEvent) {
          const freshState = useMatchStore.getState().matchState;
          const comms = agentManager.commentateOnEvent(
            result.newEvent,
            freshState,
            useUIStore.getState().activeAgentIds,
            useCommentaryStore.getState().commentaries
          );
          addCommentaries(comms);
          comms.forEach(c => speechManager.speak(c.text, c.agentId));
          simulateChatFromEvent(
            result.newEvent.runsScored,
            result.newEvent.isWicket,
            result.newEvent.batsman
          );
        }
      }
    };

    if (mode === 'simulation') {
      runSimulationTick();
    } else {
      runLiveMatchTick();
    }

    intervalRef.current = setInterval(() => {
      if (mode === 'simulation') {
        runSimulationTick();
      } else {
        runLiveMatchTick();
      }
    }, mode === 'simulation' ? playSpeed : Math.max(10000, playSpeed));

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive, playSpeed, mode, liveUrl, activeAgentIds, addCommentaries, triggerNextBall, simulateChatFromEvent, updateLiveMatchState]);

  return {
    isLive,
    playSpeed,
    matchState
  };
}

