import { BaseAgent } from './baseAgent';
import { AgentProfile, MatchEvent, MatchState } from '../types';

export class TacticalCoachAgent extends BaseAgent {
  protected profile: AgentProfile = {
    id: 'tactical-coach',
    name: 'Coach Dave (Tactical)',
    avatar: '📋',
    role: 'Match Strategist',
    description: 'Breaks down field settings, player matchups, run rate dynamics, and technical adjustments in real time.',
    tone: 'Analytical',
    expertise: 'Tactics',
    language: 'English',
    color: '#3b82f6',
    likes: 185
  };

  public generateCommentary(event: MatchEvent, state: MatchState): string {
    const { runsScored, isWicket, batsman, bowler, wicketType } = event;
    const { battingTeam, target } = state;

    const runsNeeded = target ? target - battingTeam.score : 0;
    const oversRemaining = 20 - battingTeam.overs;
    const reqRunRate = oversRemaining > 0 ? (runsNeeded / oversRemaining).toFixed(2) : '0.00';

    if (isWicket) {
      const templates = [
        `Tactical Breakdown: {batsman} fell into the trap. {bowler} bowled a classic corridor of uncertainty. Wicket type: {wicketType}. India needs a partnership now.`,
        `Technical error from {batsman}. Reached for a wide delivery with lazy footwork, resulting in a {wicketType}. Australia is squeezing the middle overs successfully.`,
        `WICKET! That matchup favored {bowler} from the start. High release point created extra bounce. India must consolidate and avoid a collapse.`
      ];
      return this.formatTemplate(this.pickTemplate(templates), { batsman, bowler, wicketType: wicketType || 'dismissal' });
    }

    if (runsScored === 6) {
      const templates = [
        `Superb adjustment! {batsman} anticipated the slower ball, stayed back in the crease, and cleared the short boundary. Australia\'s length was too short there.`,
        `Six! Excellent leverage. {batsman} clears the front leg to open up the midwicket arc. {bowler} failed to hit the blockhole.`
      ];
      return this.formatTemplate(this.pickTemplate(templates), { batsman, bowler });
    }

    if (runsScored === 4) {
      const templates = [
        `Beautiful presentation of the full face of the bat. {batsman} pierced the gap between backward point and cover. The sweeper stood no chance.`,
        `Boundary! {bowler} offered width, and {batsman} utilized the pace. A tactical error by bowling in the batsman\'s hitting zone.`
      ];
      return this.formatTemplate(this.pickTemplate(templates), { batsman, bowler });
    }

    // Dot balls or small runs
    if (runsScored === 0) {
      return `Good defensive line by {bowler}, cramping {batsman} for room. The current required run rate is ${reqRunRate} rpo. Australia is maintaining field pressure.`;
    }

    return `Strike rotation. {batsman} plays it with soft hands to the deep. This keeps the required run rate at ${reqRunRate} rpo without taking unnecessary risks.`;
  }
}
export default TacticalCoachAgent;
