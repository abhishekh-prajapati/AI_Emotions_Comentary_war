<![CDATA[<div align="center">

# 🏏 CRICKET**VERSE**

### Multi-Agent AI Commentary Platform

**6 AI Commentators · Real-Time Match Simulation · Live Crowd Chat · Sentiment Analysis**

*Experience an ICC T20 World Cup Final (🇮🇳 IND vs 🇦🇺 AUS) narrated simultaneously by six distinct AI personalities — from a Desi uncle speaking Hinglish to a cold-blooded risk analyst quoting implied odds.*

---

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5.0-orange)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-FF0055)

</div>

---

## 📖 Table of Contents

- [What Is This?](#-what-is-this)
- [Key Features](#-key-features)
- [Architecture Overview](#-architecture-overview)
- [The 6 AI Agents](#-the-6-ai-agents)
- [Engine Layer](#-engine-layer)
- [UI Components](#-ui-components)
- [State Management](#-state-management)
- [Design System](#-design-system)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [How It Works](#-how-it-works)

---

## 🧠 What Is This?

**CricketVerse** is a fully client-side, real-time cricket match simulation platform where **six AI commentator agents** simultaneously react to every ball of an **ICC Men's T20 World Cup Final** between India and Australia.

Each agent has its own:
- **Personality & tone** (dramatic, humorous, analytical, Hinglish, etc.)
- **Area of expertise** (emotions, tactics, memes, risk analytics, local desi vibes)
- **Unique template pool** (dozens of pre-authored commentary variations per event type)

The platform runs entirely in the browser — no backend, no API calls, no LLM dependency. Every ball is procedurally generated, every commentary is template-driven with contextual variable injection, and every message passes through a moderation + NLP sentiment pipeline before reaching the feed.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **6 AI Commentators** | Each with unique personality, tone, language, and expertise |
| **Real-Time Match Simulation** | Ball-by-ball T20 simulation with realistic cricket probability engine |
| **Live Commentary Feed** | Animated, color-coded, filterable commentary stream from all active agents |
| **Sentiment Analysis (NLP)** | Keyword + heuristic sentiment scoring on every commentary & chat message |
| **Moderation Engine** | Jaccard-similarity duplicate detection + profanity filter on all content |
| **Live Fan Chat** | Simulated crowd chat with auto-generated fan messages & emoji reactions |
| **Sentiment Gauge** | Real-time crowd mood meter (Furious → Tense → Neutral → Hyped → Ecstatic) |
| **Agent Leaderboard** | Ranks agents by total likes received across the match |
| **Win Probability Tracker** | Dynamic win % that shifts based on required run rate, wickets, and balls left |
| **Agent Selector Panel** | Toggle individual agents on/off, pin favorites, filter by tone/expertise/language |
| **Ball-by-Ball Tracker** | Visual display of the last 6 deliveries (dots, runs, wickets, extras) |
| **Full Scorecard** | Batsman stats (runs, balls, 4s, 6s, SR), bowler figures, team score & overs |
| **Broadcast Ticker** | Rotating news-style ticker with match context |
| **Glassmorphism UI** | Dark-mode, blur-backed cards, ambient gradient orbs, micro-animations |

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.tsx (Root)                          │
│  ┌──────────┐  ┌────────────────────┐  ┌───────────────────┐   │
│  │  Left     │  │   Center           │  │  Right            │   │
│  │  Column   │  │   Column           │  │  Column           │   │
│  │           │  │                    │  │                   │   │
│  │ AgentSel  │  │ ScoreBoard         │  │ LiveChat          │   │
│  │ Sentiment │  │ BallTracker        │  │ (simulated fans)  │   │
│  │ Leaderbd  │  │ CommentaryFeed     │  │                   │   │
│  └──────────┘  └────────────────────┘  └───────────────────┘   │
└─────────────────┬───────────────────────────────────────────────┘
                  │
    ┌─────────────▼──────────────┐
    │      useMatchEngine()      │   ← Custom hook (game loop)
    │  interval → triggerBall()  │
    └─────────────┬──────────────┘
                  │
    ┌─────────────▼──────────────┐
    │       matchEngine.ts       │   ← Procedural ball generation
    │   generateNextBall(state)  │
    └─────────────┬──────────────┘
                  │
    ┌─────────────▼──────────────┐
    │       AgentManager.ts      │   ← Orchestrates 6 agents
    │  commentateOnEvent(event)  │
    └──┬──────────┬──────────┬───┘
       │          │          │
  ┌────▼───┐ ┌───▼────┐ ┌───▼────┐
  │moderate │ │  NLP   │ │ agents │   ← Per-commentary pipeline
  │Engine   │ │Engine  │ │(x6)   │
  └────────┘ └────────┘ └────────┘
```

---

## 🤖 The 6 AI Agents

Every agent extends the abstract `BaseAgent` class and implements `generateCommentary(event, state)`. Each has a curated template pool with contextual token replacement (`{batsman}`, `{bowler}`, `{winProb}`, etc.).

| # | Agent | Avatar | Tone | Expertise | Language | Personality |
|---|---|---|---|---|---|---|
| 1 | **Aria** (Emotion Analyst) | 💜 | Dramatic | Emotions | English | Reads psychological pressure, tension, body language, and emotional highs/lows |
| 2 | **Kabir** (Die-Hard Fan) | 🔥 | Passionate | Sentiment | English & Hindi | Unapologetically biased, loud, full of blind faith in India |
| 3 | **Coach Dave** (Tactical) | 📋 | Analytical | Tactics | English | Field settings, matchups, required run rates, technical shot breakdowns |
| 4 | **MemeLord** (Humorous) | 🤪 | Humorous | Memes & Culture | English | Internet meme templates, pop culture references, savage one-liners |
| 5 | **Stat-Bot** (Risk Analyst) | 📊 | Pragmatic | Risk & Probabilities | English | Win probability shifts, implied odds, volatility metrics, decay penalties |
| 6 | **Sharma Ji** (Local Desi) | 👨‍🦰 | Colloquial | Local Desi Vibe | Hinglish | Gully cricket memories, samosa references, "Sharma ji ka beta" energy |

### Agent Class Hierarchy

```
BaseAgent (abstract)
├── EmotionAnalystAgent   → "HEARTBREAK! The absolute shock on Kohli's face..."
├── FanAgent              → "BOOOOOM! IND-IND-IND! 🇮🇳🔥"
├── TacticalCoachAgent    → "Required run rate is 8.50 rpo. Australia squeezing..."
├── MemeAgent             → "Bowler *exists*. Batsman: 'And I took that personally.'"
├── BettingRiskAgent      → "Win probability drops to 38%. Implied odds widen to 2.63."
└── LocalFanAgent         → "OYE HOYE! Ball ko chai ki tapri par bhej diya! ☕🔥"
```

---

## ⚙️ Engine Layer

### 1. Match Engine (`matchEngine.ts`)

The core simulation engine. Generates ball-by-ball outcomes with weighted probability:

| Outcome | Probability | Description |
|---|---|---|
| Dot ball (0) | 40% | Defensive stroke, beaten outside edge, yorker squeezed out |
| Single (1) | 35% | Tucked to leg, pushed to long-on, risky single |
| Double (2) | 8% | Whipped through midwicket, steered through cover |
| Boundary (4) | 7% | Cover drive, pull shot, edge through slips |
| Six (6) | 4% | Over bowler's head, slog sweep into the stands |
| Wicket | 3% | Bowled, caught, LBW, run out, stumped |
| Extra | 3% | Wide, no-ball |

**Features:**
- Full India batting roster (Rohit, Kohli, SKY, Pant, Pandya, Jadeja, Axar, Bumrah, Kuldeep, Arshdeep, Siraj)
- Australia bowling rotation (Cummins, Starc, Hazlewood, Zampa, Maxwell, Stoinis)
- Batsman stats tracking (runs, balls, 4s, 6s, strike rate)
- Bowler figures (overs, maidens, runs, wickets, economy)
- Over completion, strike rotation on odd runs, end-of-over swap
- New batsman entry on wicket (walks through the full roster)
- Dynamic win probability based on required run rate + wickets lost
- Match end detection (target achieved, all out, overs exhausted, tie)
- 50+ unique ball-by-ball text descriptions

### 2. NLP Engine (`nlpEngine.ts`)

Keyword-based sentiment analysis + excitement scoring:

- **Sentiment Classification**: Scores text as `positive`, `negative`, or `neutral` using curated keyword lists (23 positive words, 23 negative words)
- **Excitement Scoring** (1–10 scale): Based on exclamation marks, uppercase density, content markers (`six`, `boom`, `out!`)
- **Crowd Mood Aggregation**: Aggregates chat messages into a 5-tier mood scale:
  - `Furious` (≤ -60) → `Tense` (≤ -15) → `Neutral` → `Hyped` (≥ 15) → `Ecstatic` (≥ 60)

### 3. Moderation Engine (`moderationEngine.ts`)

Content quality pipeline for both commentary and chat:

- **Profanity Filter**: 9-word forbidden list with auto-masking (`***`) — content still published but sanitized
- **Duplicate Detection**: Jaccard similarity coefficient between new text and last 5 messages; blocks if similarity > 70%
- **Quality Gate**: Rejects commentary shorter than 15 characters
- **Chat Moderation**: Replaces forbidden words with 🍉 emoji, blocks external URLs

---

## 🎨 UI Components

### Match Components
| Component | File | Purpose |
|---|---|---|
| **ScoreBoard** | `components/match/ScoreBoard.tsx` | Full scorecard — team score, overs, batsman stats, bowler figures, required rate, play/pause/reset controls |
| **BallTracker** | `components/match/BallTracker.tsx` | Visual strip of last 6 deliveries with color-coded badges (green=runs, red=wicket, yellow=extra) |

### Commentary Components
| Component | File | Purpose |
|---|---|---|
| **CommentaryFeed** | `components/commentary/CommentaryFeed.tsx` | Scrollable, animated feed of all commentary entries with agent avatars and sentiment indicators |
| **CommentaryCard** | `components/commentary/CommentaryCard.tsx` | Individual commentary bubble — agent color border, like button, excitement meter, sentiment badge |

### Dashboard Components
| Component | File | Purpose |
|---|---|---|
| **SentimentGauge** | `components/dashboard/SentimentGauge.tsx` | Visual crowd mood meter showing aggregate chat sentiment |
| **AgentLeaderboard** | `components/dashboard/AgentLeaderboard.tsx` | Ranked list of agents by total likes received |

### Agent Components
| Component | File | Purpose |
|---|---|---|
| **AgentSelector** | `components/agents/AgentSelector.tsx` | Toggle agents on/off, pin favorites, filter by tone/expertise/language, search agents |

### Chat Components
| Component | File | Purpose |
|---|---|---|
| **LiveChat** | `components/chat/LiveChat.tsx` | Simulated fan chat with auto-generated messages, emoji reactions, and user input |

---

## 📦 State Management

Four Zustand stores power the entire application:

### `matchStore.ts` — Match Simulation State
```
matchState        → Full MatchState (teams, scores, overs, batsmen, bowlers, status, win%)
recentEvents      → Last 50 MatchEvent objects
isLive            → Whether auto-play is running
playSpeed         → Milliseconds between balls (default: 6000ms)
triggerNextBall() → Generates next ball and updates all state
```

### `uiStore.ts` — UI Preferences & Filters
```
activeAgentIds    → Which agents are currently broadcasting
pinnedAgentIds    → Pinned/favorite agents
filters           → Tone, expertise, language, search query filters
activePanel       → Current sidebar tab
isAudioOn         → Audio toggle
```

### `commentaryStore.ts` — Commentary Feed
```
entries           → All CommentaryEntry objects displayed in the feed
addEntries()      → Append new commentaries
clearEntries()    → Reset feed
```

### `chatStore.ts` — Live Fan Chat
```
messages          → All ChatMessage objects
addMessage()      → Append message (with moderation)
addReaction()     → Add emoji reaction to a message
```

---

## 🎨 Design System

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0a0f1d` | Deep navy page background |
| `--bg-surface` | `rgba(18, 26, 47, 0.65)` | Glassmorphic card backgrounds |
| `--accent-primary` | `#10b981` | Cricket emerald — primary accent |
| `--color-emotion` | `#8b5cf6` | Aria (violet) |
| `--color-fan` | `#f97316` | Kabir (orange) |
| `--color-coach` | `#3b82f6` | Coach Dave (blue) |
| `--color-meme` | `#ec4899` | MemeLord (pink) |
| `--color-risk` | `#f59e0b` | Stat-Bot (amber) |
| `--color-local` | `#ef4444` | Sharma Ji (red) |

### Typography
- **Font**: Inter (Google Fonts) with system-ui fallback
- **3 sizes only**: `12px` (metadata), `14px` (body), `20px` (headings)

### Spacing
- **8px grid system** with tokens from `8px` to `48px`
- **Minimum card padding**: 24px
- **Minimum touch targets**: 44px

### Motion
- **Micro transitions**: 150ms (hover, focus, toggle)
- **Panel transitions**: 300ms (modal, slide, expand)
- **Ambient orbs**: 18s–28s floating radial gradients
- **Slide-in animations**: Commentary cards enter with slide-up + fade

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | React | 19.2 |
| **Language** | TypeScript (strict) | 6.0 |
| **Build Tool** | Vite | 8.0 |
| **State Management** | Zustand | 5.0 |
| **Animation** | Framer Motion | 12.x |
| **Icons** | Lucide React | 1.16 |
| **Styling** | Vanilla CSS (design tokens + custom properties) | — |
| **Linting** | ESLint + typescript-eslint | 10.x |

---

## 📁 Project Structure

```
AI_Emotions_Comentary_war/
├── index.html                          # Entry HTML (Google Fonts, meta tags)
├── package.json                        # Dependencies & scripts
├── vite.config.ts                      # Vite configuration
├── tsconfig.json                       # TypeScript config (references)
├── tsconfig.app.json                   # App-level TS config (strict mode)
├── eslint.config.js                    # Linting rules
│
├── src/
│   ├── main.tsx                        # React DOM entry point
│   ├── App.tsx                         # Root layout (3-column grid + header + ticker)
│   ├── App.css                         # Minimal app-level overrides
│   ├── index.css                       # Global CSS imports
│   │
│   ├── types/
│   │   └── index.ts                    # All TypeScript interfaces & types
│   │
│   ├── engine/
│   │   ├── matchEngine.ts              # Ball-by-ball match simulation (352 lines)
│   │   ├── nlpEngine.ts                # Sentiment analysis & crowd mood aggregation
│   │   └── moderationEngine.ts         # Duplicate detection, profanity filter, quality gate
│   │
│   ├── agents/
│   │   ├── baseAgent.ts                # Abstract base class (template picking + formatting)
│   │   ├── AgentManager.ts             # Orchestrator — routes events to agents, pipes through moderation + NLP
│   │   ├── emotionAnalystAgent.ts      # 💜 Aria — dramatic psychological reads
│   │   ├── fanAgent.ts                 # 🔥 Kabir — passionate, biased supporter
│   │   ├── tacticalCoachAgent.ts       # 📋 Coach Dave — analytical match strategy
│   │   ├── memeAgent.ts                # 🤪 MemeLord — internet culture & humor
│   │   ├── bettingRiskAgent.ts         # 📊 Stat-Bot — probabilities & implied odds
│   │   └── localFanAgent.ts            # 👨‍🦰 Sharma Ji — Hinglish gully cricket vibes
│   │
│   ├── store/
│   │   ├── matchStore.ts               # Zustand: match state, events, play controls
│   │   ├── commentaryStore.ts          # Zustand: commentary feed entries
│   │   ├── chatStore.ts                # Zustand: fan chat messages & reactions
│   │   └── uiStore.ts                  # Zustand: active agents, filters, preferences
│   │
│   ├── hooks/
│   │   └── useMatchEngine.ts           # Custom hook: game loop (setInterval → triggerBall → commentate)
│   │
│   ├── components/
│   │   ├── match/
│   │   │   ├── ScoreBoard.tsx          # Full scorecard + play/pause/reset
│   │   │   └── BallTracker.tsx         # Last 6 balls visual strip
│   │   ├── commentary/
│   │   │   ├── CommentaryFeed.tsx      # Scrollable animated feed
│   │   │   └── CommentaryCard.tsx      # Individual commentary bubble
│   │   ├── dashboard/
│   │   │   ├── SentimentGauge.tsx      # Crowd mood meter
│   │   │   └── AgentLeaderboard.tsx    # Agent ranking by likes
│   │   ├── agents/
│   │   │   └── AgentSelector.tsx       # Agent toggle/pin/filter panel
│   │   └── chat/
│   │       └── LiveChat.tsx            # Simulated fan chat
│   │
│   ├── styles/
│   │   ├── tokens.css                  # Design tokens (colors, spacing, typography, motion)
│   │   ├── components.css              # Shared component styles (cards, badges, buttons)
│   │   └── animations.css              # Keyframe animations (slide, fade, pulse, orb drift)
│   │
│   └── assets/                         # Static assets
│
├── public/                             # Public static files
└── dist/                               # Production build output
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Install & Run

```bash
# Clone the repository
git clone https://github.com/abhishekh-prajapati/AI_Emotions_Comentary_war.git
cd AI_Emotions_Comentary_war

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔄 How It Works

### Game Loop (per ball)

```
1. useMatchEngine hook fires setInterval at `playSpeed` ms
                    ↓
2. matchStore.triggerNextBall()
   → matchEngine.generateNextBall(state)
   → Weighted random outcome (0/1/2/4/6/W/extra)
   → Update batsman stats, bowler figures, team score
   → Recalculate win probability
   → Check match end conditions
   → Return MatchEvent + next MatchState
                    ↓
3. AgentManager.commentateOnEvent(event, state, activeAgentIds)
   → For each active agent (shuffled order):
     a. agent.generateCommentary(event, state)
        → Pick random template from pool
        → Inject context variables ({batsman}, {bowler}, {winProb}, etc.)
     b. moderationEngine.moderateCommentary(text, recentEntries)
        → Profanity scan → Jaccard duplicate check → Quality gate
     c. nlpEngine.analyzeSentiment(text)
        → Keyword scoring → Excitement calculation
     d. Build CommentaryEntry → push to results
                    ↓
4. commentaryStore.addEntries(results)
   → Feed re-renders with animated slide-in
                    ↓
5. chatStore generates simulated fan messages
   → Moderated through moderateChatMessage()
   → Sentiment analyzed for crowd gauge
                    ↓
6. UI updates: ScoreBoard, BallTracker, SentimentGauge, Leaderboard
```

---

## 📊 Type System

All core types are defined in [`src/types/index.ts`](src/types/index.ts):

- `MatchState` — Full match context (teams, scores, overs, target, win probability)
- `MatchEvent` — Single ball outcome (runs, wicket, extra, descriptions)
- `Team`, `Player`, `Bowler` — Cricket entities
- `AgentProfile` — Agent identity (id, name, avatar, tone, expertise, language, color)
- `CommentaryEntry` — Published commentary (agent, text, sentiment, excitement, likes)
- `ChatMessage` — Fan chat message (username, text, sentiment, reactions)
- `UIFilters` — Filter state (tones, expertise, languages, search query)
- `AgentId` — Union type of all 6 agent identifiers

---

<div align="center">

**Built with ❤️ and 🏏 by Abhishekh Prajapati**

*"Cricket is not just a game. It's an emotion." — Every Indian, ever.*

</div>
]]>
