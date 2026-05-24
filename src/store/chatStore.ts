import { create } from 'zustand';
import { ChatMessage } from '../types';
import { analyzeSentiment, aggregateChatSentiment } from '../engine/nlpEngine';
import { moderateChatMessage } from '../engine/moderationEngine';

interface ChatStore {
  messages: ChatMessage[];
  sentimentScore: number; // -100 to 100
  sentimentLabel: 'Furious' | 'Tense' | 'Neutral' | 'Hyped' | 'Ecstatic';
  addMessage: (text: string, username?: string) => boolean;
  addReaction: (id: string, emoji: string) => void;
  simulateChatFromEvent: (runs: number, isWicket: boolean, batsman: string) => void;
  clearChat: () => void;
}

const FAN_USERNAMES = [
  'CricketBuff_99', 'Rohan_IND', 'AussieSlayer', 'DhoniFanForever', 'Virat_Is_King',
  'BoundaryHunter', 'Samosa_Lover', 'GullyCricketer', 'Sunny_Deol_Fan', 'StumpBreaker'
];

const MATCH_SITUATIONS_CHAT: { [key: string]: string[] } = {
  wicket: [
    'Are yaar! Out ho gaya! 😭',
    'Oh my god, why Virat why??',
    'Nooooo! Starc you monster...',
    'Is it over for India? Nervous vibes!',
    'Terrible shot selection, honestly. Under pressure again.'
  ],
  six: [
    'BOOOOOM! KYA SHOT HAI!',
    'India will win this easily now! Let\'s go!',
    'That six went straight into orbit! 🚀',
    'Rohit is absolutely smoking them!',
    'Unbelievable timing! King energy! 👑'
  ],
  four: [
    'Beautiful boundary! Classical stroke.',
    'Four more! Keep rotating strike now.',
    'Aussie bowlers look nervous haha!',
    'Sharma ji ka beta rocking, bowler shocking!'
  ],
  dot: [
    'Dot ball... come on, rotate strike.',
    'Good defense. No need to panic.',
    'Tension is building up big time!',
    'Dot ball increases required run rate, careful guys.'
  ]
};

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [
    {
      id: 'chat_init_1',
      username: 'CricketBuff_99',
      text: 'Final is here! Pitch looks solid, hoping for a classic IND chase!',
      timestamp: Date.now() - 30000,
      sentiment: 'positive',
      reactions: { '🔥': 5, '🙌': 2 } as Record<string, number>
    },
    {
      id: 'chat_init_2',
      username: 'AussieSlayer',
      text: 'If Kohli stands till 15 overs, India wins 100%. Bold prediction!',
      timestamp: Date.now() - 15000,
      sentiment: 'neutral',
      reactions: { '💯': 4 } as Record<string, number>
    }
  ],
  sentimentScore: 25,
  sentimentLabel: 'Hyped',

  addMessage: (text, username = 'You') => {
    const mod = moderateChatMessage(text);
    if (!mod.isApproved) {
      return false; // rejected (e.g. link spam)
    }

    const nlp = analyzeSentiment(mod.text);
    
    const newMsg: ChatMessage = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      username,
      text: mod.text,
      timestamp: Date.now(),
      sentiment: nlp.sentiment,
      reactions: {}
    };

    set((state) => {
      const updatedMessages = [...state.messages, newMsg].slice(-80); // cap to 80 messages
      const agg = aggregateChatSentiment(updatedMessages);
      return {
        messages: updatedMessages,
        sentimentScore: agg.sentimentScore,
        sentimentLabel: agg.label
      };
    });

    return true;
  },

  addReaction: (id, emoji) => set((state) => ({
    messages: state.messages.map((m) => {
      if (m.id !== id) return m;
      const count = m.reactions[emoji] || 0;
      return {
        ...m,
        reactions: { ...m.reactions, [emoji]: count + 1 }
      };
    })
  })),

  simulateChatFromEvent: (runs, isWicket, batsman) => {
    // Generate 1-2 random fan messages reacting to the live ball event
    const chatCount = Math.floor(Math.random() * 2) + 1;
    const { messages } = get();

    for (let i = 0; i < chatCount; i++) {
      const user = FAN_USERNAMES[Math.floor(Math.random() * FAN_USERNAMES.length)];
      let templatePool: string[] = [];

      if (isWicket) {
        templatePool = MATCH_SITUATIONS_CHAT['wicket'];
      } else if (runs === 6) {
        templatePool = MATCH_SITUATIONS_CHAT['six'];
      } else if (runs === 4) {
        templatePool = MATCH_SITUATIONS_CHAT['four'];
      } else {
        templatePool = MATCH_SITUATIONS_CHAT['dot'];
      }

      const rawText = templatePool[Math.floor(Math.random() * templatePool.length)]
        .replace('{batsman}', batsman);

      // Add with slight delay simulation
      setTimeout(() => {
        get().addMessage(rawText, user);
      }, Math.random() * 1200 + 400); // 400ms - 1600ms delays
    }
  },

  clearChat: () => set({
    messages: [],
    sentimentScore: 0,
    sentimentLabel: 'Neutral'
  })
}));
