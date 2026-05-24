import { CommentaryEntry } from '../types';

// Simple Jaccard similarity coefficient to check for duplicate/near-duplicate messages
export function calculateJaccardSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2));
  const words2 = new Set(str2.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2));

  if (words1.size === 0 && words2.size === 0) return 1;
  if (words1.size === 0 || words2.size === 0) return 0;

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

// In-app moderation system for commentary quality & uniqueness
export interface ModerationResult {
  isApproved: boolean;
  reason?: string;
  moderatedText: string;
}

const FORBIDDEN_WORDS = [
  'spam', 'abuse', 'cheat', 'rigged', 'idiot', 'moron', 'crap', 'garbage', 'worst match'
];

export function moderateCommentary(
  text: string,
  recentCommentaries: CommentaryEntry[]
): ModerationResult {
  let moderatedText = text;
  
  // 1. Profanity / Spam Filter
  const lower = text.toLowerCase();
  let hasForbidden = false;
  
  FORBIDDEN_WORDS.forEach(word => {
    if (lower.includes(word)) {
      hasForbidden = true;
      // Mask the forbidden word
      const regex = new RegExp(word, 'gi');
      moderatedText = moderatedText.replace(regex, '***');
    }
  });

  if (hasForbidden) {
    return {
      isApproved: true, // We approve it but masked, or we can choose to reject
      reason: 'Contains flagged terminology (auto-masked)',
      moderatedText
    };
  }

  // 2. Duplicate Detection
  // Check against the last 5 messages in the feed to prevent duplicate observations
  for (const entry of recentCommentaries.slice(0, 5)) {
    const similarity = calculateJaccardSimilarity(text, entry.text);
    if (similarity > 0.7) {
      return {
        isApproved: false,
        reason: `Duplicate commentary. Near-identical content already broadcast by ${entry.agentName} (Jaccard Sim: ${Math.round(similarity * 100)}%)`,
        moderatedText
      };
    }
  }

  // 3. Minimum Length & Quality
  if (text.trim().length < 15) {
    return {
      isApproved: false,
      reason: 'Content below quality length threshold',
      moderatedText
    };
  }

  return {
    isApproved: true,
    moderatedText
  };
}

// Moderates Fan chat messages
export function moderateChatMessage(text: string): { isApproved: boolean; text: string } {
  let filtered = text;
  let isApproved = true;

  FORBIDDEN_WORDS.forEach(word => {
    if (text.toLowerCase().includes(word)) {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, '🍉'); // Replace with fun fruits!
    }
  });

  // Basic link/spam filter
  if (text.includes('http://') || text.includes('https://') || text.includes('www.')) {
    isApproved = false; // Block external links
  }

  return {
    isApproved,
    text: filtered
  };
}
