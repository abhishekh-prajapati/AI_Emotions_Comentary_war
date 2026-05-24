import { ChatMessage, CommentaryEntry } from '../types';

const POSITIVE_KEYWORDS = [
  'excellent', 'beautiful', 'six', 'four', 'wonderful', 'amazing', 'win', 'great', 
  'yes', 'boom', 'superb', 'shot', 'classy', 'unstoppable', 'champion', 'incredible',
  'mubarak', 'congrats', 'brilliant', 'perfect', 'love', 'fire', 'epic'
];

const NEGATIVE_KEYWORDS = [
  'out', 'wicket', 'lost', 'bad', 'terrible', 'poor', 'slow', 'nooo', 'risk', 
  'hazard', 'drop', 'dropped', 'clean bowled', 'choke', 'sad', 'hate', 'disaster',
  'danger', 'worrying', 'gone', 'misery', 'collapse'
];

export interface SentimentAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  excitement: number; // 1-10 scale
}

export function analyzeSentiment(text: string): SentimentAnalysisResult {
  const lower = text.toLowerCase();
  
  // Calculate raw scores
  let positiveScore = 0;
  let negativeScore = 0;
  
  POSITIVE_KEYWORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches) {
      positiveScore += matches.length;
    }
  });

  NEGATIVE_KEYWORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches) {
      negativeScore += matches.length;
    }
  });

  // Decide overall sentiment
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (positiveScore > negativeScore) {
    sentiment = 'positive';
  } else if (negativeScore > positiveScore) {
    sentiment = 'negative';
  }

  // Calculate excitement levels on 1-10 scale
  let excitement = 3; // base excitement
  
  // Adjust based on punctuation (exclamation points and capitalizations)
  const exclamationCount = (text.match(/!/g) || []).length;
  excitement += Math.min(exclamationCount * 1.5, 3);
  
  const questionCount = (text.match(/\?/g) || []).length;
  excitement += Math.min(questionCount * 0.5, 1);

  // High percentage of uppercase letters increases excitement
  const letters = text.replace(/[^a-zA-Z]/g, '');
  if (letters.length > 5) {
    const uppercaseCount = (text.match(/[A-Z]/g) || []).length;
    if (uppercaseCount / letters.length > 0.4) {
      excitement += 2.5;
    }
  }

  // Dynamic content markers
  if (lower.includes('six') || lower.includes('boom') || lower.includes('out!') || lower.includes('bowled!')) {
    excitement += 2;
  }

  // Cap excitement to 1-10 integer
  excitement = Math.max(1, Math.min(10, Math.round(excitement)));

  return {
    sentiment,
    excitement
  };
}

// Aggregates general chat sentiment to find the crowd mood
export function aggregateChatSentiment(messages: ChatMessage[]): {
  sentimentScore: number; // -100 (very negative) to +100 (very positive)
  label: 'Furious' | 'Tense' | 'Neutral' | 'Hyped' | 'Ecstatic';
} {
  if (messages.length === 0) {
    return { sentimentScore: 0, label: 'Neutral' };
  }

  let totalScore = 0;
  messages.forEach(msg => {
    if (msg.sentiment === 'positive') totalScore += 1;
    if (msg.sentiment === 'negative') totalScore -= 1;
  });

  const ratio = totalScore / messages.length;
  const sentimentScore = Math.round(ratio * 100);

  let label: 'Furious' | 'Tense' | 'Neutral' | 'Hyped' | 'Ecstatic' = 'Neutral';
  if (sentimentScore >= 60) label = 'Ecstatic';
  else if (sentimentScore >= 15) label = 'Hyped';
  else if (sentimentScore <= -60) label = 'Furious';
  else if (sentimentScore <= -15) label = 'Tense';

  return {
    sentimentScore,
    label
  };
}
