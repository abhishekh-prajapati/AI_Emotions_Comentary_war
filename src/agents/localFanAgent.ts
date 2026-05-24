import { BaseAgent } from './baseAgent';
import { AgentProfile, MatchEvent, MatchState } from '../types';

export class LocalFanAgent extends BaseAgent {
  protected profile: AgentProfile = {
    id: 'local-fan',
    name: 'Sharma Ji (Local Desi)',
    avatar: '👨‍🦰',
    role: 'Gully Cricket Analyst',
    description: 'Speaks absolute Desi Hinglish, brings gully cricket memories, and talks about samosas, Sharma ji ka beta, and raw cricket energy.',
    tone: 'Colloquial',
    expertise: 'Local Desi Vibe',
    language: 'Hinglish',
    color: '#ef4444',
    likes: 350
  };

  public generateCommentary(event: MatchEvent, state: MatchState): string {
    const { runsScored, isWicket, batsman, bowler } = event;

    if (isWicket) {
      const templates = [
        `Are yaar! Kya gandi shot maari {batsman} ne! Bilkul gully cricket waali feeling de di. Chal ab out hai toh bahar jaa! 🤦‍♂️`,
        `Dhappa ho gaya bhai! {batsman} toh shuru hone se pehle hi chalta bana. Sharma Ji ka beta hota toh aram se single nikalta!`,
        `Wicket gir gaya bhai log! Ab toh samosa khane ka bhi dil nahi kar raha. Rona aa raha hai! 😭`
      ];
      return this.formatTemplate(this.pickTemplate(templates), { batsman });
    }

    if (runsScored === 6) {
      const templates = [
        `OYE HOYE! KYA DE DANA DAN SIX MAARA HAI! {batsman} ne toh ball ko direct stadium ke bahar chai ki tapri par bhej diya! ☕🔥`,
        `Khatarnak shot! Aise shot par toh free ka samosa banta hai! Kya maara hai {batsman} bhaiya, maza aa gaya!`,
        `Dhuaan nikal diya bowler ka! {batsman} ne bat nahi chalaya, talwar chalayi hai! Aisa six toh hamare gully me direct out hota tha! 😂`
      ];
      return this.formatTemplate(this.pickTemplate(templates), { batsman });
    }

    if (runsScored === 4) {
      const templates = [
        `Oho! Makkhan boundary! {batsman} ke bat se nikalte hi maloom tha chaar run milenge. Ekdum mast placement!`,
        `Chaar run! Arey bowler bhaiya, ye balling kar rahe ho ya thandi kheer paros rahe ho? Mast dhoya {batsman} ne!`
      ];
      return this.formatTemplate(this.pickTemplate(templates), { batsman });
    }

    if (runsScored > 0) {
      return `Chalo ek run toh aaya. Boond-boond se sagar banta hai bhaiyo. Strike rotate karo bas, match apna hai!`;
    }

    // Dot balls
    const dotTemplates = [
      `Arey beta {batsman}, thoda toh bat ghumao! Aise khade rahoge toh Sharma ji kya bolenge?`,
      `Dot ball. Dhadkan badh rahi hai bhaiyo, BP high ho gaya hai mera! Ek boundary maar de yaar! 🥺`,
      `Defend kiya. Tension mat lo, agle ball pe chakke ki tayyari ho rahi hai!`
    ];
    return this.formatTemplate(this.pickTemplate(dotTemplates), { batsman });
  }
}
export default LocalFanAgent;
