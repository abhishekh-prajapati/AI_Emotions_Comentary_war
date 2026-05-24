import { BaseAgent } from './baseAgent';
import { AgentProfile, MatchEvent, MatchState } from '../types';

export class MemeAgent extends BaseAgent {
  protected profile: AgentProfile = {
    id: 'meme-agent',
    name: 'MemeLord (Humorous)',
    avatar: '🤪',
    role: 'Meme & Culture Watcher',
    description: 'Reacts with trending internet culture templates, funny descriptions, and pop culture references.',
    tone: 'Humorous',
    expertise: 'Memes & Culture',
    language: 'English',
    color: '#ec4899',
    likes: 295
  };

  public generateCommentary(event: MatchEvent, state: MatchState): string {
    const { runsScored, isWicket, batsman, bowler, isExtra } = event;

    if (isWicket) {
      const templates = [
        `{batsman}: "I got this." \nAlso {batsman}: *walks back to the pavilion after 2 balls* 💀 Clown hours are officially open!`,
        `F in the chat for {batsman}. Starc literally sent his stumps to another dimension. RIP! 🪦`,
        `Australia celebrating like they just found out the exam got cancelled. {batsman} is crying in the corner.`
      ];
      return this.formatTemplate(this.pickTemplate(templates), { batsman });
    }

    if (runsScored === 6) {
      const templates = [
        `Stop it {batsman}! They have families! That ball is currently orbiting Mars! 🚀🪐`,
        `Bowler {bowler}: *exists* \n{batsman}: "And I took that personally." HUGE SIX! 💥`,
        `That six was cleaner than my search history. Absolute absolute monster hit!`
      ];
      return this.formatTemplate(this.pickTemplate(templates), { batsman, bowler });
    }

    if (runsScored === 4) {
      const templates = [
        `Aussie fielders sliding like they are on a water slide at a water park. Ball still goes for four! 😂`,
        `{batsman} out here playing real-life EA Sports Cricket 07 on easy mode! Flick and boundary!`
      ];
      return this.formatTemplate(this.pickTemplate(templates), { batsman });
    }

    if (isExtra) {
      return `{bowler} bowling like my drunk uncle on a Sunday afternoon. Wide ball! 🍺`;
    }

    // Dot balls
    const dotTemplates = [
      `A dot ball. *inserts nervous sweating puppet meme* 😰`,
      `{batsman} defending like he is trying to protect his last slice of pizza from his siblings.`,
      `State of India fans right now: 📈 Win probability: {winProb}%, Heart Rate: 180bpm!`
    ];
    return this.formatTemplate(this.pickTemplate(dotTemplates), { batsman, winProb: state.winProbability });
  }
}
export default MemeAgent;
