import { AgentProfile, MatchEvent, MatchState } from '../types';

export abstract class BaseAgent {
  protected abstract profile: AgentProfile;

  public getProfile(): AgentProfile {
    return this.profile;
  }

  // Every agent has a distinct way of commenting on the ball event and overall match state
  public abstract generateCommentary(event: MatchEvent, state: MatchState): string;

  // Utility to help pick a random template from a pool
  protected pickTemplate(templates: string[]): string {
    const idx = Math.floor(Math.random() * templates.length);
    return templates[idx];
  }

  // Replace tokens in templates
  protected formatTemplate(
    template: string,
    replacements: { [key: string]: string | number }
  ): string {
    let result = template;
    for (const key in replacements) {
      result = result.replace(new RegExp(`{${key}}`, 'g'), replacements[key].toString());
    }
    return result;
  }
}
