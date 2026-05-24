import { BaseAgent } from './baseAgent';
import { AgentProfile, MatchEvent, MatchState } from '../types';

export class BettingRiskAgent extends BaseAgent {
  protected profile: AgentProfile = {
    id: 'betting-risk',
    name: 'Stat-Bot (Risk Analyst)',
    avatar: '📊',
    role: 'Risk & Probabilities Expert',
    description: 'Models live win probability shifts, implied odds, volatility metrics, and betting risk index variations.',
    tone: 'Pragmatic',
    expertise: 'Risk & Probabilities',
    language: 'English',
    color: '#f59e0b',
    likes: 120
  };

  public generateCommentary(event: MatchEvent, state: MatchState): string {
    const { runsScored, isWicket, batsman } = event;
    const { winProbability, battingTeam, target } = state;

    const runsNeeded = target ? target - battingTeam.score : 0;
    const oversRemaining = 20 - battingTeam.overs;
    const ballsRemaining = Math.round(oversRemaining * 6);
    
    // Implied odds
    const winProbFraction = winProbability / 100;
    const impliedOdds = winProbFraction > 0 ? (1 / winProbFraction).toFixed(2) : '100.00';

    if (isWicket) {
      const templates = [
        `Risk Alert! {batsman}\'s dismissal triggers a massive volatility spike. Win probability drops to {winProb}%. India\'s implied odds widen to {impliedOdds}.`,
        `High-risk event registered. Batsman out! India\'s risk matrix increases. Win probability has adjusted downwards to {winProb}%.`,
        `Probability update: Wicket falls. Modeling predicts an 8.5% drop in batting success rate. The risk coefficient is now critically high.`
      ];
      return this.formatTemplate(this.pickTemplate(templates), { batsman, winProb: winProbability, impliedOdds });
    }

    if (runsScored === 6) {
      const templates = [
        `Risk Mitigation! A six from {batsman} reduces the required run rate significantly. Win probability increases to {winProb}% (Implied return: {impliedOdds}x).`,
        `High-yield strike! Maximum runs scored. Win probability jumps to {winProb}%. Risk score decreased by 12 points.`
      ];
      return this.formatTemplate(this.pickTemplate(templates), { batsman, winProb: winProbability, impliedOdds });
    }

    if (runsScored === 4) {
      const templates = [
        `Optimal outcome. Four runs scored, shifting India\'s probability curve upwards to {winProb}%. Required runs down to {runsNeeded} of {ballsRemaining} balls.`,
        `Boundary recorded. Odds adjust to {impliedOdds} for an India victory. Steady capital appreciation for backers.`
      ];
      return this.formatTemplate(this.pickTemplate(templates), { winProb: winProbability, impliedOdds, runsNeeded, ballsRemaining });
    }

    // Small or no runs
    if (runsScored === 0) {
      return `Dot ball. Time decay is active. Decay penalty of -0.8% win probability per ball. Win probability now stands at {winProb}%.`;
    }

    return `Single. Minimal variance. Keep rate of accumulation steady. Implied win probability holding stable at {winProb}%.`;
  }
}
export default BettingRiskAgent;
