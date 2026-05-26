<div align="center">

# 🏏 CRICKETVERSE

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

# 📖 Table of Contents

- [What Is This?](#-what-is-this)
- [Key Features](#-key-features)
- [Architecture Overview](#-architecture-overview)
- [The 6 AI Agents](#-the-6-ai-agents)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [How It Works](#-how-it-works)

---

# 🧠 What Is This?

**CricketVerse** is a real-time AI-powered cricket commentary simulation platform where six unique AI agents react live to every ball of an ICC Men's T20 World Cup Final between India and Australia.

Each AI commentator has its own:

- Personality
- Tone
- Language style
- Match understanding
- Commentary behavior

The platform runs entirely on the client side using React, TypeScript, Zustand, and Framer Motion without requiring external APIs or LLM calls.

---

# ✨ Key Features

| Feature | Description |
|---|---|
| 6 AI Commentators | Every AI agent has a unique personality and commentary style |
| Real-Time Match Engine | Ball-by-ball cricket simulation |
| Sentiment Analysis | NLP-based excitement and mood detection |
| Live Fan Chat | Simulated crowd reactions and discussions |
| Win Probability Tracker | Dynamic live win prediction |
| Agent Leaderboard | Tracks most-liked commentator |
| Moderation Engine | Duplicate filtering and profanity control |
| Commentary Feed | Animated real-time commentary stream |
| Ball Tracker | Displays last six deliveries visually |
| Glassmorphism UI | Modern animated cricket dashboard |

---

# 🤖 The 6 AI Agents

| Agent | Personality | Expertise |
|---|---|---|
| 💜 Aria | Emotional & dramatic | Psychology & emotions |
| 🔥 Kabir | Passionate cricket fan | Fan energy |
| 📋 Coach Dave | Tactical analyst | Match strategy |
| 🤪 MemeLord | Funny & chaotic | Memes & internet humor |
| 📊 Stat-Bot | Cold analytical AI | Risk & probability |
| 👨‍🦰 Sharma Ji | Desi Hinglish commentator | Local cricket vibes |

---

# 🏗 Architecture Overview

```text
App.tsx
   ↓
useMatchEngine()
   ↓
matchEngine.ts
   ↓
AgentManager.ts
   ↓
AI Agents
   ↓
Moderation Engine
   ↓
NLP Engine
   ↓
Commentary Feed + UI
```

---

# ⚙️ Core Systems

## Match Engine
- Simulates realistic cricket outcomes
- Generates runs, wickets, extras, overs
- Tracks scorecards and player stats
- Calculates win probability dynamically

## NLP Engine
- Detects sentiment:
  - Positive
  - Neutral
  - Negative
- Calculates excitement score
- Tracks overall crowd mood

## Moderation Engine
- Removes duplicate commentary
- Filters profanity
- Prevents spam-like responses

---

# 🎨 UI Components

| Component | Purpose |
|---|---|
| ScoreBoard | Match score and statistics |
| CommentaryFeed | Real-time AI commentary |
| BallTracker | Last 6 ball outcomes |
| LiveChat | Simulated fan discussion |
| SentimentGauge | Crowd emotion meter |
| AgentLeaderboard | Most popular commentator |
| AgentSelector | Enable/disable agents |

---

# 📦 State Management

Powered using **Zustand**:

- Match State
- Commentary State
- Chat State
- UI Preferences
- Active Agents
- Filters & Controls

---

# 🎨 Design System

## UI Style
- Dark theme
- Glassmorphism cards
- Ambient animated backgrounds
- Smooth transitions
- Responsive layout

## Typography
- Inter Font
- Minimal modern spacing system
- Motion-based UI feedback

---

# 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| State Management | Zustand |
| Animation | Framer Motion |
| Styling | Vanilla CSS |
| Icons | Lucide React |

---

# 📁 Project Structure

```bash
AI_Emotions_Comentary_war/
│
├── src/
│   ├── agents/
│   ├── engine/
│   ├── store/
│   ├── hooks/
│   ├── components/
│   ├── styles/
│   └── types/
│
├── public/
├── package.json
├── vite.config.ts
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/abhishekh-prajapati/AI_Emotions_Comentary_war.git
```

## Navigate into Folder

```bash
cd AI_Emotions_Comentary_war
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

---

# 🔄 How It Works

1. Match engine generates next ball
2. AI agents react to the event
3. Commentary passes through moderation
4. NLP engine analyzes sentiment
5. Commentary appears in live feed
6. Crowd sentiment updates dynamically

---

# 📊 Features Breakdown

## Commentary System
- Template-based AI commentary
- Context-aware reactions
- Emotional variation
- Humor & tactical analysis

## Match Simulation
- Overs
- Strike rotation
- Wickets
- Player statistics
- Required run rate
- Match result detection

## Fan Interaction
- Auto-generated fan chat
- Emoji reactions
- Crowd mood system

---

# 📌 Future Improvements

- Real live-score API integration
- Voice commentary generation
- Multiplayer live rooms
- AI voice avatars
- Match replay system
- Advanced analytics dashboard

---

# 👨‍💻 Author

## Abhishekh Prajapati

GitHub:  
https://github.com/abhishekh-prajapati

---

# 📜 License

This project is open-source and available under the MIT License.

---

<div align="center">

### 🏏 Built with passion for cricket, AI, and real-time interactive experiences.

</div>
