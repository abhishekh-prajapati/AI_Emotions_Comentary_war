export interface LiveMatchInfo {
  id: string;
  title: string;
  description: string;
  link: string;
}

export type WicketType = 'bowled' | 'caught' | 'lbw' | 'run_out' | 'stumped' | 'hit_wicket';

export interface Player {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isStriker?: boolean;
}

export interface Bowler {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
}

export interface Team {
  name: string;
  shortName: string;
  score: number;
  wickets: number;
  overs: number;
  batsmen: Player[];
  bowlers: Bowler[];
}

export interface MatchState {
  matchName: string;
  battingTeam: Team;
  bowlingTeam: Team;
  target?: number;
  oversLimit: number;
  isFirstInnings: boolean;
  status: string;
  winProbability: number; // calculated percentage for batting team
  recentBalls: string[];  // e.g., ['1', '4', 'W', 'Wd', '6', '0']
  mode?: 'simulation' | 'live';
  liveUrl?: string;
}

export interface MatchEvent {
  ballId: string;
  over: number;
  ballNumber: number; // 1-6
  runsScored: number;
  isWicket: boolean;
  wicketType?: WicketType;
  wicketPlayer?: string;
  isExtra: boolean;
  extraType?: 'wide' | 'no_ball' | 'bye' | 'leg_bye';
  extraRuns?: number;
  batsman: string;
  bowler: string;
  textDescription: string;
  timestamp: number;
}

export type AgentId = 'emotion-analyst' | 'fan-agent' | 'tactical-coach' | 'meme-agent' | 'betting-risk' | 'local-fan';

export interface AgentProfile {
  id: AgentId;
  name: string;
  avatar: string;
  role: string;
  description: string;
  tone: 'Dramatic' | 'Passionate' | 'Analytical' | 'Humorous' | 'Pragmatic' | 'Colloquial';
  expertise: 'Emotions' | 'Sentiment' | 'Tactics' | 'Memes & Culture' | 'Risk & Probabilities' | 'Local Desi Vibe';
  language: 'English' | 'English & Hindi' | 'Hinglish';
  color: string;
  likes: number;
}

export interface CommentaryEntry {
  id: string;
  ballId: string;
  agentId: AgentId;
  agentName: string;
  avatar: string;
  color: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  excitement: number; // 1-10
  likes: number;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  username: string;
  text: string;
  timestamp: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  reactions: { [emoji: string]: number };
}

export interface UIFilters {
  selectedTones: string[];
  selectedExpertise: string[];
  selectedLanguages: string[];
  searchQuery: string;
}

