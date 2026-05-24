import { MatchEvent, MatchState, CommentaryEntry, AgentProfile, AgentId } from '../types';
import { BaseAgent } from './baseAgent';
import { EmotionAnalystAgent } from './emotionAnalystAgent';
import { FanAgent } from './fanAgent';
import { TacticalCoachAgent } from './tacticalCoachAgent';
import { MemeAgent } from './memeAgent';
import { BettingRiskAgent } from './bettingRiskAgent';
import { LocalFanAgent } from './localFanAgent';
import { moderateCommentary } from '../engine/moderationEngine';
import { analyzeSentiment } from '../engine/nlpEngine';

export class AgentManager {
  private agents: Map<AgentId, BaseAgent> = new Map();

  constructor() {
    this.agents.set('emotion-analyst', new EmotionAnalystAgent());
    this.agents.set('fan-agent', new FanAgent());
    this.agents.set('tactical-coach', new TacticalCoachAgent());
    this.agents.set('meme-agent', new MemeAgent());
    this.agents.set('betting-risk', new BettingRiskAgent());
    this.agents.set('local-fan', new LocalFanAgent());
  }

  // Retrieve details for all agents to render selectors
  public getProfiles(): AgentProfile[] {
    return Array.from(this.agents.values()).map(agent => agent.getProfile());
  }

  // Generates unique commentary for an event across active commentators
  public commentateOnEvent(
    event: MatchEvent,
    state: MatchState,
    activeAgentIds: AgentId[],
    recentCommentaries: CommentaryEntry[]
  ): CommentaryEntry[] {
    const results: CommentaryEntry[] = [];

    // Order active agent ids randomly so we don't always give priority to one agent in moderation de-duplication
    const shuffledAgentIds = [...activeAgentIds].sort(() => Math.random() - 0.5);

    for (const agentId of shuffledAgentIds) {
      const agent = this.agents.get(agentId);
      if (!agent) continue;

      try {
        const rawText = agent.generateCommentary(event, state);
        
        // Pipe through moderation engine (near-duplicate detection & filter)
        // Pass both generated text and currently gathered commentaries (including newly approved ones in this step)
        const currentContext = [...results, ...recentCommentaries];
        const modResult = moderateCommentary(rawText, currentContext);

        if (modResult.isApproved) {
          // Perform sentiment analysis
          const nlpResult = analyzeSentiment(modResult.moderatedText);
          const profile = agent.getProfile();

          results.push({
            id: `comm_${event.ballId}_${agentId}`,
            ballId: event.ballId,
            agentId,
            agentName: profile.name,
            avatar: profile.avatar,
            color: profile.color,
            text: modResult.moderatedText,
            sentiment: nlpResult.sentiment,
            excitement: nlpResult.excitement,
            likes: Math.floor(Math.random() * 5), // Base likes count
            timestamp: Date.now()
          });
        } else {
          console.warn(`[Moderation Filtered] Agent: ${agentId}, Reason: ${modResult.reason}`);
        }
      } catch (err) {
        console.error(`Error in commentary generation for ${agentId}:`, err);
      }
    }

    // Sort by chronological sequence if needed, but return list
    return results;
  }
}

export const agentManager = new AgentManager();
