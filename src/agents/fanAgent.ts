import { BaseAgent } from './baseAgent';
import { AgentProfile, MatchEvent, MatchState } from '../types';

export class FanAgent extends BaseAgent {
  protected profile: AgentProfile = {
    id: 'fan-agent',
    name: 'Kabir (Die-Hard Fan)',
    avatar: '🔥',
    role: 'Passionate Supporter',
    description: 'Brings the electric, unfiltered energy of the stands. Unapologetically biased, loud, and full of faith!',
    tone: 'Passionate',
    expertise: 'Sentiment',
    language: 'English & Hindi',
    color: '#f97316',
    likes: 210
  };

  public generateCommentary(event: MatchEvent, state: MatchState): string {
    const { runsScored, isWicket, batsman, bowler } = event;

    if (isWicket) {
      const templates = [
        `NOOOO! This can't be happening! {batsman} is out... I can't look at the screen! Come on India, wake up! 😭😭`,
        `Absolute disaster! Why would you play that shot now?! My heart just broke into a million pieces.`,
        `Oh God, the Aussie luck strikes again. We need a miracle now. Stay strong, boys!`
      ];
      return this.formatTemplate(this.pickTemplate(templates), { batsman });
    }

    if (runsScored === 6) {
      const templates = [
        `BOOOOOOOM! WHAT A SIX! THAT WENT OUT OF THE STADIUM! {batsman} YOU BEAUTY! IND-IND-IND! 🇮🇳🔥`,
        `OH MY GOODNESS! That is the biggest hit of the tournament! {batsman} is an absolute king! Aussie bowlers are crying!`,
        `YESSSSSS! Hit them where it hurts! Keep going, {batsman}! We are winning this tonight!`
      ];
      return this.formatTemplate(this.pickTemplate(templates), { batsman });
    }

    if (runsScored === 4) {
      const templates = [
        `SHOT! Elegance at its best. That boundary was so satisfying to watch! 😍🏏`,
        `FOUR MORE! {batsman} is putting on a absolute masterclass here! Let's goooo!`,
        `Beautiful boundary! The crowd is going absolutely wild! IND is marching ahead!`
      ];
      return this.formatTemplate(this.pickTemplate(templates), { batsman });
    }

    if (runsScored > 0) {
      return `Good single there. Rotate the strike, keep the scoreboard moving. We can easily do this!`;
    }

    // Dot balls
    const dotTemplates = [
      `No run. Come on {batsman}, hit a boundary on the next ball! The pressure is building.`,
      `Safe defense. Good ball from {bowler}, but we believe in you {batsman}!`,
      `Dot ball. My nails are officially fully chewed. The tension is too much!`
    ];
    return this.formatTemplate(this.pickTemplate(dotTemplates), { batsman, bowler });
  }
}
export default FanAgent;
