import type { MatchState, MatchEvent, Player, Bowler, WicketType, Team } from '../types';

const INDIA_ROSTER = [
  'Rohit Sharma',
  'Virat Kohli',
  'Suryakumar Yadav',
  'Rishabh Pant',
  'Hardik Pandya',
  'Ravindra Jadeja',
  'Axar Patel',
  'Jasprit Bumrah',
  'Kuldeep Yadav',
  'Arshdeep Singh',
  'Mohammed Siraj'
];

const AUSTRALIA_ROSTER = [
  'Pat Cummins',
  'Mitchell Starc',
  'Josh Hazlewood',
  'Adam Zampa',
  'Glenn Maxwell',
  'Marcus Stoinis'
];

const MATCH_DESCRIPTIONS: { [key: string]: string[] } = {
  '0': [
    'Solid defensive stroke back to the bowler.',
    'Beaten by the pace! Whistles past the outside edge.',
    'Pushed gently to cover, no run possible.',
    ' Yorker length, well squeezed out by the batsman.',
    'Bouncer! Batsman ducked under that comfortably.'
  ],
  '1': [
    'Tucked off the hips to deep square leg for a single.',
    'Pushed down to long-on to rotate the strike.',
    'Slashed hard to third man, just a single.',
    'Inside edge onto the pad, they steal a quick run.',
    'Dropped with soft hands towards point for a risky single.'
  ],
  '2': [
    'Whipped away through midwicket. Great running between wickets for two.',
    'Steered through the gaps in cover, sweeper cuts it off. Two runs.',
    'Lofted over mid-on, doesn\'t carry. They turn back for a double.',
    'Flicked down to fine leg, quick running brings a brace.'
  ],
  '4': [
    'CRACK! Exquisite cover drive. The ball races to the boundary!',
    'Flicked off the pads elegantly through square leg. Four runs!',
    'Edged and flies between slip and keeper! Runs away for four.',
    'Pitched short, pulled away powerfully to the midwicket boundary!',
    'Lofted over the bowler\'s head. One bounce and over the ropes.'
  ],
  '6': [
    'BOOM! That is massive! Straight over the bowler\'s head for a huge SIX!',
    'Picked up over deep backward square leg. High, handsome, and into the crowd!',
    'Dance down the track, matches the pitch, and lofts it miles over long-on!',
    'Slog sweep! Connected beautifully, sails deep into the midwicket stand!'
  ],
  'W': [
    'OUT! Clean bowled! The stumps are shattered!',
    'OUT! Edged and caught! The wicketkeeper makes no mistake.',
    'OUT! Lofted straight into the hands of long-off. Simple catch.',
    'OUT! Loud shout for LBW... and the finger goes up!',
    'OUT! Direct hit! The batsman is caught well short of the crease. Run out!'
  ],
  'extra': [
    'Wide ball down the leg side. Wides help the score tick.',
    'No ball! High full toss, batsman catches it but it\'s a free hit next ball!',
    'Wide ball, trying to bowl too wide of the crease.'
  ]
};

// Generates the initial match state
export function getInitialMatchState(): MatchState {
  const batsmen: Player[] = [
    { name: INDIA_ROSTER[0], runs: 0, balls: 0, fours: 0, sixes: 0, isStriker: true },
    { name: INDIA_ROSTER[1], runs: 0, balls: 0, fours: 0, sixes: 0, isStriker: false }
  ];

  const bowlers: Bowler[] = AUSTRALIA_ROSTER.slice(0, 3).map(name => ({
    name,
    overs: 0,
    maidens: 0,
    runs: 0,
    wickets: 0
  }));

  const battingTeam: Team = {
    name: 'India',
    shortName: 'IND',
    score: 0,
    wickets: 0,
    overs: 0,
    batsmen,
    bowlers: [] // Not bowling in this innings
  };

  const bowlingTeam: Team = {
    name: 'Australia',
    shortName: 'AUS',
    score: 0,
    wickets: 0,
    overs: 0,
    batsmen: [], // Not batting
    bowlers
  };

  return {
    matchName: 'ICC Men\'s T20 World Cup - Final',
    battingTeam,
    bowlingTeam,
    target: 182, // Chasing 182
    oversLimit: 20,
    isFirstInnings: false,
    status: 'India needs 182 runs to win',
    winProbability: 50,
    recentBalls: []
  };
}

export function generateNextBall(state: MatchState): { event: MatchEvent; nextState: MatchState } {
  // Deep clone state to prevent mutation
  const nextState = JSON.parse(JSON.stringify(state)) as MatchState;
  const batting = nextState.battingTeam;
  const bowling = nextState.bowlingTeam;

  const striker = batting.batsmen.find(b => b.isStriker);
  const nonStriker = batting.batsmen.find(b => !b.isStriker);

  if (!striker || !nonStriker) {
    throw new Error('Striker or non-striker not found!');
  }

  // Get current bowler
  const bowlerIndex = Math.floor(batting.overs) % bowling.bowlers.length;
  const activeBowler = bowling.bowlers[bowlerIndex];

  // Current ball numbers
  const currentOverFloat = batting.overs;
  const completedOvers = Math.floor(currentOverFloat);
  const currentOverBallCount = Math.round((currentOverFloat - completedOvers) * 10);
  const nextBallCount = currentOverBallCount + 1;

  // Decide probability of outcomes based on batsman skill/excitement
  // 0: 40%, 1: 35%, 2: 8%, 4: 10%, 6: 4%, Wicket: 3%
  const rand = Math.random() * 100;
  let runsScored = 0;
  let isWicket = false;
  let isExtra = false;
  let extraType: 'wide' | 'no_ball' | undefined;
  let wicketType: WicketType | undefined;
  let textDescription = '';

  if (rand < 3) {
    // Wicket
    isWicket = true;
    const wicketTypes: WicketType[] = ['bowled', 'caught', 'lbw', 'run_out', 'stumped'];
    wicketType = wicketTypes[Math.floor(Math.random() * wicketTypes.length)];
    const descArr = MATCH_DESCRIPTIONS['W'];
    textDescription = `${striker.name} ${descArr[Math.floor(Math.random() * descArr.length)]}`;
  } else if (rand < 6) {
    // Extra
    isExtra = true;
    extraType = Math.random() > 0.7 ? 'no_ball' : 'wide';
    runsScored = extraType === 'wide' ? 1 : 1; // 1 run added to team score
    const descArr = MATCH_DESCRIPTIONS['extra'];
    textDescription = `Extra! ${descArr[Math.floor(Math.random() * descArr.length)]}`;
  } else if (rand < 46) {
    // 0 runs
    runsScored = 0;
    const descArr = MATCH_DESCRIPTIONS['0'];
    textDescription = descArr[Math.floor(Math.random() * descArr.length)];
  } else if (rand < 81) {
    // 1 run
    runsScored = 1;
    const descArr = MATCH_DESCRIPTIONS['1'];
    textDescription = descArr[Math.floor(Math.random() * descArr.length)];
  } else if (rand < 89) {
    // 2 runs
    runsScored = 2;
    const descArr = MATCH_DESCRIPTIONS['2'];
    textDescription = descArr[Math.floor(Math.random() * descArr.length)];
  } else if (rand < 96) {
    // 4 runs
    runsScored = 4;
    const descArr = MATCH_DESCRIPTIONS['4'];
    textDescription = descArr[Math.floor(Math.random() * descArr.length)];
  } else {
    // 6 runs
    runsScored = 6;
    const descArr = MATCH_DESCRIPTIONS['6'];
    textDescription = descArr[Math.floor(Math.random() * descArr.length)];
  }

  // Update Batsman Stats
  if (!isExtra) {
    striker.balls += 1;
    if (isWicket) {
      // Batsman is out
    } else {
      striker.runs += runsScored;
      if (runsScored === 4) striker.fours += 1;
      if (runsScored === 6) striker.sixes += 1;
    }
  }

  // Update Bowler Stats (only if not an extra, or no-ball/wide adds runs to bowler)
  if (!isExtra) {
    // Over math
    activeBowler.runs += runsScored;
    if (isWicket && wicketType !== 'run_out') {
      activeBowler.wickets += 1;
    }
  } else {
    activeBowler.runs += runsScored; // extras conceded
  }

  // Update Team Scores
  if (isWicket) {
    batting.wickets += 1;
  } else {
    batting.score += runsScored;
  }

  // Recent Balls display
  let ballDisplay = runsScored.toString();
  if (isWicket) ballDisplay = 'W';
  else if (isExtra) ballDisplay = extraType === 'wide' ? 'Wd' : 'Nb';
  nextState.recentBalls.push(ballDisplay);
  if (nextState.recentBalls.length > 6) {
    nextState.recentBalls.shift();
  }

  // Over Calculation
  if (isExtra) {
    // Wide/No-ball doesn't count as legal ball
    // Overs remain same
  } else {
    if (nextBallCount === 6) {
      batting.overs = completedOvers + 1;
      // Over completed, change bowler overs
      activeBowler.overs = Math.floor(activeBowler.overs) + 1;
      // Swap strikers at end of over
      striker.isStriker = false;
      nonStriker.isStriker = true;
    } else {
      batting.overs = completedOvers + (nextBallCount / 10);
    }
  }

  // Strike Rotation on odd runs (1 or 3)
  if (!isWicket && !isExtra && (runsScored === 1 || runsScored === 3)) {
    striker.isStriker = false;
    nonStriker.isStriker = true;
  }

  let wicketPlayerOut = undefined;
  // Handle Wicket Replacement
  if (isWicket) {
    wicketPlayerOut = striker.name;
    // Find next available batsman
    const totalOut = batting.wickets;
    const nextBatsmanIndex = totalOut + 1; // index in IND_ROSTER

    if (nextBatsmanIndex < INDIA_ROSTER.length) {
      // Replace striker with new player
      const nextPlayerName = INDIA_ROSTER[nextBatsmanIndex];
      const newStriker: Player = {
        name: nextPlayerName,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isStriker: true
      };
      
      // Update roster list
      batting.batsmen = batting.batsmen.map(b => b.name === striker.name ? newStriker : b);
    } else {
      nextState.status = 'All out! Match over.';
    }
  }

  // Update Bowler over count fractionally
  if (!isExtra && nextBallCount < 6) {
    const bOvers = Math.floor(activeBowler.overs);
    const bBalls = Math.round((activeBowler.overs - bOvers) * 10) + 1;
    activeBowler.overs = bOvers + (bBalls / 10);
  }

  // Check Match Status
  const runsNeeded = nextState.target ? nextState.target - batting.score : 0;
  const currentOvers = batting.overs;
  const maxOvers = nextState.oversLimit;
  const currentBallsPlayed = Math.floor(currentOvers) * 6 + Math.round((currentOvers - Math.floor(currentOvers)) * 10);
  const totalBalls = maxOvers * 6;
  const ballsRemaining = totalBalls - currentBallsPlayed;

  if (nextState.target) {
    if (batting.score >= nextState.target) {
      nextState.status = `India won by ${10 - batting.wickets} wickets!`;
      nextState.winProbability = 100;
    } else if (batting.wickets >= 10 || ballsRemaining <= 0) {
      if (batting.score === nextState.target - 1) {
        nextState.status = 'Match tied!';
        nextState.winProbability = 50;
      } else {
        nextState.status = `Australia won by ${nextState.target - 1 - batting.score} runs!`;
        nextState.winProbability = 0;
      }
    } else {
      nextState.status = `India needs ${runsNeeded} runs in ${ballsRemaining} balls`;
      // Recalculate win probability dynamically
      const rrr = (runsNeeded / ballsRemaining) * 6; // Required run rate per over
      let prob = 50;
      if (rrr > 18) {
        prob = Math.max(1, 50 - (rrr - 12) * 5 - (batting.wickets * 8));
      } else if (rrr < 6) {
        prob = Math.min(99, 85 - (batting.wickets * 4));
      } else {
        prob = Math.max(5, Math.min(95, 60 - (rrr - 8) * 6 - (batting.wickets * 5)));
      }
      nextState.winProbability = Math.round(prob);
    }
  }

  const ballId = `ball_${completedOvers}_${isExtra ? 'ex_' + Math.random().toString(36).substr(2, 4) : nextBallCount}`;

  const event: MatchEvent = {
    ballId,
    over: completedOvers,
    ballNumber: isExtra ? 0 : nextBallCount,
    runsScored: isExtra ? 0 : runsScored,
    isWicket,
    wicketType,
    wicketPlayer: wicketPlayerOut,
    isExtra,
    extraType: extraType as any,
    extraRuns: isExtra ? 1 : 0,
    batsman: striker.name,
    bowler: activeBowler.name,
    textDescription: `${activeBowler.name} to ${striker.name}: ${textDescription}`,
    timestamp: Date.now()
  };

  return {
    event,
    nextState
  };
}
