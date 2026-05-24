import { useEffect, useRef } from 'react';
import { useMatchStore } from '../store/matchStore';
import { useCommentaryStore } from '../store/commentaryStore';
import { useChatStore } from '../store/chatStore';
import { useUIStore } from '../store/uiStore';
import { agentManager } from '../agents/AgentManager';

export function useMatchEngine() {
  const { isLive, playSpeed, triggerNextBall, matchState } = useMatchStore();
  const { addCommentaries, commentaries } = useCommentaryStore();
  const { simulateChatFromEvent } = useChatStore();
  const { activeAgentIds } = useUIStore();

  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isLive) {
      // Trigger a ball immediately when user hits "play"
      const initialEvent = triggerNextBall();
      if (initialEvent) {
        const comms = agentManager.commentateOnEvent(
          initialEvent,
          useMatchStore.getState().matchState,
          activeAgentIds,
          commentaries
        );
        addCommentaries(comms);
        simulateChatFromEvent(
          initialEvent.runsScored,
          initialEvent.isWicket,
          initialEvent.batsman
        );
      }

      intervalRef.current = setInterval(() => {
        const event = triggerNextBall();
        if (event) {
          const freshState = useMatchStore.getState().matchState;
          
          // Generate moderated, NLP-analyzed commentary
          const comms = agentManager.commentateOnEvent(
            event,
            freshState,
            useUIStore.getState().activeAgentIds,
            useCommentaryStore.getState().commentaries
          );
          
          addCommentaries(comms);
          
          // Generate automated live fan chat reactions
          simulateChatFromEvent(
            event.runsScored,
            event.isWicket,
            event.batsman
          );
        }
      }, playSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive, playSpeed, activeAgentIds, addCommentaries, triggerNextBall, simulateChatFromEvent]);

  return {
    isLive,
    playSpeed,
    matchState
  };
}
