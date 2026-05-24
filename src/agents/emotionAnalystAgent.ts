import { BaseAgent } from './baseAgent';
import { AgentProfile, MatchEvent, MatchState } from '../types';

export class EmotionAnalystAgent extends BaseAgent {
  protected profile: AgentProfile = {
    id: 'emotion-analyst',
    name: 'Aria (Emotion Analyst)',
    avatar: '💜',
    role: 'Psychology & Tension Reader',
    description: 'Reads the psychological vibes, pressure cooker moments, and emotional highs/lows of the players.',
    tone: 'Dramatic',
    expertise: 'Emotions',
    language: 'English',
    color: '#8b5cf6',
    likes: 142
  };

  public generateCommentary(event: MatchEvent, state: MatchState): string {
    const { runsScored, isWicket, isExtra, batsman, bowler } = event;
    const { winProbability } = state;

    if (isWicket) {
      const templates = [
        `HEARTBREAK! The absolute shock on {batsman}'s face tells you everything. You can feel the deafening silence in the stadium!`,
        `AGONY! {batsman} is walking back, completely crushed. The bowler {bowler} is roaring in sheer euphoria! What a psychological blow!`,
        `Oh, the pressure was building like a pressure cooker, and {batsman} just snapped! You can see the heavy burden of expectation in that walk.`
      ];
      return this.formatTemplate(this.pickTemplate(templates), { batsman, bowler });
    }

    if (runsScored === 6) {
      const templates = [
        `PURE ECSTASY! {batsman} has released all the pent-up tension with that majestic launch! Starc/Cummins looks completely shell-shocked!`,
        `UNBELIEVABLE CONFIDENCE! Look at that swagger. {batsman} didn't just hit a six, he conquered his fears with that stroke!`,
        `That is the swing of a man who has absolute, unshakable belief in his soul. Incredible release of pressure!`
      ];
      return this.formatTemplate(this.pickTemplate(templates), { batsman });
    }

    if (runsScored === 4) {
      const templates = [
        `Beautiful! The tension dissolves for a brief second as {batsman} finds the fence. Perfect timing under immense stress.`,
        `Classic release valve! {batsman} strokes it away and breathes a sigh of relief. You can see the shoulders drop in relaxation.`
      ];
      return this.formatTemplate(this.pickTemplate(templates), { batsman });
    }

    if (isExtra) {
      return `Oh, the nerves are getting to {bowler}! That wide/no-ball is a clear symptom of the crushing weight of this World Cup final!`;
    }

    // Dot balls
    const pressureTemplates = [
      `The suspense is killing! {bowler} is staring down {batsman}. Each dot ball is like a ticking time bomb!`,
      `You can hear a pin drop. {batsman} defends, but the psychological warfare out there is absolutely intense.`,
      `India's win probability sits at {winProb}%. The emotional tides are shifting with every single delivery!`
    ];
    return this.formatTemplate(this.pickTemplate(pressureTemplates), { batsman, bowler, winProb: winProbability });
  }
}
export default EmotionAnalystAgent;
