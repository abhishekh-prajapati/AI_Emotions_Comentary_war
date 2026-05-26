import { LiveMatchInfo, MatchState, MatchEvent, Team, Player, Bowler } from '../types';

const CORS_PROXY = 'https://api.allorigins.win/get?url=';

// Fetch the list of active live matches from Cricinfo RSS
export async function fetchLiveMatches(): Promise<LiveMatchInfo[]> {
  try {
    const rssUrl = 'https://static.cricinfo.com/rss/livescores.xml';
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(rssUrl)}`;
    
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch live matches: ${response.statusText}`);
    }
    
    const json = await response.json();
    const xmlText = json.contents;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    const items = doc.querySelectorAll('item');
    
    const matches: LiveMatchInfo[] = [];
    
    items.forEach((item, index) => {
      const title = item.querySelector('title')?.textContent || 'Unknown Match';
      const description = item.querySelector('description')?.textContent || 'No status available';
      const link = item.querySelector('link')?.textContent || '';
      
      // We only care about matches that are live/recent
      matches.push({
        id: `live_${index}_${Date.now()}`,
        title,
        description,
        link
      });
    });
    
    return matches;
  } catch (error) {
    console.error('Error fetching live matches list:', error);
    return [];
  }
}

// Helper to convert Cricbuzz desktop live URL to commentary url if needed
export function cleanCricbuzzUrl(url: string): string {
  let clean = url.trim();
  if (!clean) return '';
  
  // Ensure it points to cricbuzz
  if (!clean.includes('cricbuzz.com')) {
    // If just an ID was entered, construct Cricbuzz URL
    if (/^\d+$/.test(clean)) {
      return `https://www.cricbuzz.com/live-cricket-scores/${clean}/live-match`;
    }
    return '';
  }
  
  // If desktop URL, ensure it points to the main live score/commentary page
  if (clean.includes('cricket-scores') || clean.includes('live-cricket-scores')) {
    // Keep it as is or clean query params
    clean = clean.split('?')[0];
  }
  
  return clean;
}

// Scrape live match scorecard and commentary from a Cricbuzz match URL
export async function scrapeCricbuzzMatch(
  url: string,
  prevMatchState?: MatchState
): Promise<{ state: MatchState; newEvent: MatchEvent | null } | null> {
  try {
    const cleanUrl = cleanCricbuzzUrl(url);
    if (!cleanUrl) throw new Error('Invalid Cricbuzz URL');
    
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(cleanUrl)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch Cricbuzz data: ${response.statusText}`);
    }
    
    const json = await response.json();
    const htmlText = json.contents;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    
    // 1. Match Name
    let matchName = doc.querySelector('h1.cb-nav-hdr')?.textContent?.replace(', Commentary', '').replace(', Live Score', '').trim() || '';
    if (!matchName) {
      matchName = doc.title.replace('Live Score, Commentary', '').trim();
    }
    
    // 2. Status
    let statusText = doc.querySelector('.cb-min-stts')?.textContent?.trim() || 
                     doc.querySelector('.cb-text-complete')?.textContent?.trim() || 
                     doc.querySelector('.cb-text-stump')?.textContent?.trim() ||
                     doc.querySelector('.cb-text-live')?.textContent?.trim() ||
                     doc.querySelector('.cb-status')?.textContent?.trim() ||
                     'Match in progress';
                     
    // 3. Extract Score Card Details (Batting, Bowling teams, scores, overs)
    // On Cricbuzz, current score is often in .cb-min-bat-ot
    const scoreContainer = doc.querySelector('.cb-min-bat-ot');
    const scoreText = scoreContainer?.textContent?.trim() || '';
    
    // Let's parse team scores using Regex
    // Typical format: "IND 182/4 (19.4)" or "AUS 120-3 (15.2)"
    const scoreRegex = /([A-Z]{2,4})\s+(\d+)(?:\/|-)(\d+)\s*\((\d+(?:\.\d+)?)\)/g;
    const scores: Array<{ teamCode: string; runs: number; wickets: number; overs: number }> = [];
    
    let match;
    while ((match = scoreRegex.exec(scoreText)) !== null) {
      scores.push({
        teamCode: match[1],
        runs: parseInt(match[2], 10),
        wickets: parseInt(match[3], 10),
        overs: parseFloat(match[4])
      });
    }
    
    // If we couldn't parse using standard regex on cb-min-bat-ot, try general page text scan
    if (scores.length === 0) {
      const pageText = doc.body.textContent || '';
      const fallbackMatches = pageText.match(/([A-Z]{2,4})\s+(\d+)\/(\d+)\s*\((\d+\.\d+)\s*ov\)/gi);
      if (fallbackMatches) {
        fallbackMatches.forEach(m => {
          const parts = m.match(/([A-Z]{2,4})\s+(\d+)\/(\d+)\s*\((\d+\.\d+)/i);
          if (parts) {
            scores.push({
              teamCode: parts[1].toUpperCase(),
              runs: parseInt(parts[2], 10),
              wickets: parseInt(parts[3], 10),
              overs: parseFloat(parts[4])
            });
          }
        });
      }
    }
    
    // Parse team names from header or details
    const teamTitle = matchName.split(' vs ');
    const team1Name = teamTitle[0]?.trim() || 'Team 1';
    const team2Name = teamTitle[1]?.split(',')[0]?.trim() || 'Team 2';
    
    const team1Short = team1Name.substring(0, 3).toUpperCase();
    const team2Short = team2Name.substring(0, 3).toUpperCase();
    
    // Determine who is batting based on parsed scores
    // Usually, the first score in the list is the batting team
    let battingTeamCode = scores[0]?.teamCode || team1Short;
    let bowlingTeamCode = scores.length > 1 ? scores[1].teamCode : (battingTeamCode === team1Short ? team2Short : team1Short);
    
    const activeScore = scores[0] || { runs: 0, wickets: 0, overs: 0 };
    const inactiveScore = scores[1] || { runs: 0, wickets: 0, overs: 0 };
    
    const battingTeamName = battingTeamCode === team1Short ? team1Name : team2Name;
    const bowlingTeamName = bowlingTeamCode === team1Short ? team1Name : team2Name;
    
    // 4. Parse Batsmen and Bowlers
    // Cricbuzz live commentary page contains mini tables with class cb-min-ltst
    const batsmen: Player[] = [];
    const bowlers: Bowler[] = [];
    
    const tables = doc.querySelectorAll('table');
    tables.forEach(table => {
      const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim().toLowerCase());
      const rows = table.querySelectorAll('tr');
      
      // If table is Batsman table
      if (headers.includes('batsman') || headers.includes('batter')) {
        rows.forEach(row => {
          const cols = row.querySelectorAll('td');
          if (cols.length >= 4) {
            const name = cols[0].textContent?.trim() || '';
            const runs = parseInt(cols[1].textContent?.trim() || '0', 10);
            const balls = parseInt(cols[2].textContent?.trim() || '0', 10);
            const fours = parseInt(cols[3].textContent?.trim() || '0', 10);
            const sixes = parseInt(cols[4]?.textContent?.trim() || '0', 10);
            const isStriker = cols[0].querySelector('span')?.textContent?.includes('*') || cols[0].textContent?.includes('*');
            
            if (name && !name.toLowerCase().includes('batsman') && !name.toLowerCase().includes('batter')) {
              batsmen.push({
                name: name.replace('*', '').trim(),
                runs,
                balls,
                fours,
                sixes,
                isStriker: !!isStriker
              });
            }
          }
        });
      }
      
      // If table is Bowler table
      if (headers.includes('bowler')) {
        rows.forEach(row => {
          const cols = row.querySelectorAll('td');
          if (cols.length >= 4) {
            const name = cols[0].textContent?.trim() || '';
            const overs = parseFloat(cols[1].textContent?.trim() || '0');
            const maidens = parseInt(cols[2].textContent?.trim() || '0', 10);
            const runs = parseInt(cols[3].textContent?.trim() || '0', 10);
            const wickets = parseInt(cols[4].textContent?.trim() || '0', 10);
            
            if (name && !name.toLowerCase().includes('bowler')) {
              bowlers.push({
                name: name.trim(),
                overs,
                maidens,
                runs,
                wickets
              });
            }
          }
        });
      }
    });
    
    // Ensure we have at least striker/non-striker placeholders if table parsing failed
    if (batsmen.length === 0) {
      batsmen.push({ name: 'Active Batter 1', runs: 0, balls: 0, fours: 0, sixes: 0, isStriker: true });
      batsmen.push({ name: 'Active Batter 2', runs: 0, balls: 0, fours: 0, sixes: 0, isStriker: false });
    } else if (batsmen.length === 1) {
      batsmen.push({ name: 'Batter 2', runs: 0, balls: 0, fours: 0, sixes: 0, isStriker: false });
    }
    
    // Ensure we have active bowler placeholder
    if (bowlers.length === 0) {
      bowlers.push({ name: 'Active Bowler', overs: 0, maidens: 0, runs: 0, wickets: 0 });
    }
    
    // Target calculation from status
    let target: number | undefined = undefined;
    const targetMatch = statusText.match(/(?:need|require)\s+(\d+)\s+runs/i) || statusText.match(/target\s+is\s+(\d+)/i);
    if (targetMatch) {
      const runsNeeded = parseInt(targetMatch[1], 10);
      target = activeScore.runs + runsNeeded;
    } else if (inactiveScore.runs > 0) {
      target = inactiveScore.runs + 1;
    }
    
    // Win probability
    let winProbability = 50;
    if (target) {
      const runsNeeded = target - activeScore.runs;
      const oversLeft = 20 - activeScore.overs;
      const ballsRemaining = Math.round(oversLeft * 6);
      if (ballsRemaining > 0) {
        const rrr = (runsNeeded / ballsRemaining) * 6;
        if (rrr > 15) winProbability = Math.max(2, 50 - (rrr - 10) * 8 - activeScore.wickets * 5);
        else if (rrr < 6) winProbability = Math.min(98, 85 - activeScore.wickets * 4);
        else winProbability = Math.max(5, Math.min(95, 60 - (rrr - 8) * 7 - activeScore.wickets * 6));
      } else {
        winProbability = activeScore.runs >= target ? 100 : 0;
      }
    }
    
    winProbability = Math.round(winProbability);
    
    const battingTeam: Team = {
      name: battingTeamName,
      shortName: battingTeamCode,
      score: activeScore.runs,
      wickets: activeScore.wickets,
      overs: activeScore.overs,
      batsmen,
      bowlers: []
    };
    
    const bowlingTeam: Team = {
      name: bowlingTeamName,
      shortName: bowlingTeamCode,
      score: inactiveScore.runs,
      wickets: inactiveScore.wickets,
      overs: inactiveScore.overs,
      batsmen: [],
      bowlers
    };
    
    // 5. Parse Commentary and detect new Event
    // Find all commentary lines
    let newEvent: MatchEvent | null = null;
    
    // On Cricbuzz, a commentary item block can be found by scanning divs containing text matching "18.4" or class containing cb-col-10 / cb-col-8
    const divs = Array.from(doc.querySelectorAll('div'));
    const commRows: Array<{ ballStr: string; text: string }> = [];
    
    divs.forEach((div, index) => {
      const text = div.textContent?.trim() || '';
      // Look for ball strings like "18.4" or "0.1" at the start of a div, or in small classes
      const ballMatch = text.match(/^(\d+\.\d+)$/);
      if (ballMatch) {
        // Find text block nearby - usually the sibling or child in parent
        // Let's get the parent's next element or adjacent element
        const parent = div.parentElement;
        const textDiv = parent?.querySelector('.cb-col-90') || parent?.querySelector('.cb-col-92') || div.nextElementSibling;
        const commText = textDiv?.textContent?.trim() || '';
        
        if (commText) {
          commRows.push({
            ballStr: ballMatch[1],
            text: commText
          });
        }
      }
    });
    
    // Fallback: search for list of paragraphs or list items containing "18.4 Starc to Rohit"
    if (commRows.length === 0) {
      const pElements = doc.querySelectorAll('p');
      pElements.forEach(p => {
        const text = p.textContent?.trim() || '';
        const match = text.match(/^(\d+\.\d+)\s+(.+)$/);
        if (match) {
          commRows.push({
            ballStr: match[1],
            text: match[2]
          });
        }
      });
    }
    
    const latestComm = commRows[0]; // First one is the latest ball
    
    // Parse recent balls array (last 6 balls) from latest commentary or standard strip
    const recentBalls: string[] = [];
    commRows.slice(0, 6).reverse().forEach(row => {
      const lowerText = row.text.toLowerCase();
      let outcome = '0';
      if (lowerText.includes('six')) outcome = '6';
      else if (lowerText.includes('four')) outcome = '4';
      else if (lowerText.includes('out') || lowerText.includes('caught') || lowerText.includes('bowled') || lowerText.includes('lbw')) outcome = 'W';
      else if (lowerText.includes('wide')) outcome = 'Wd';
      else if (lowerText.includes('no ball')) outcome = 'Nb';
      else if (lowerText.includes('1 run') || lowerText.includes('single')) outcome = '1';
      else if (lowerText.includes('2 runs') || lowerText.includes('double')) outcome = '2';
      else if (lowerText.includes('3 runs')) outcome = '3';
      
      recentBalls.push(outcome);
    });
    
    const state: MatchState = {
      matchName,
      battingTeam,
      bowlingTeam,
      target,
      oversLimit: 20, // default
      isFirstInnings: inactiveScore.runs === 0,
      status: statusText,
      winProbability,
      recentBalls: recentBalls.length > 0 ? recentBalls : (prevMatchState?.recentBalls || []),
      mode: 'live',
      liveUrl: url
    };
    
    // Detect if this is a new ball event compared to previous state
    if (latestComm) {
      const ballId = `live_ball_${latestComm.ballStr}`;
      const isNewBall = !prevMatchState || 
                        prevMatchState.battingTeam.overs !== activeScore.overs || 
                        prevMatchState.recentBalls[prevMatchState.recentBalls.length - 1] !== recentBalls[recentBalls.length - 1];
                        
      if (isNewBall) {
        // Parse ball details
        const ballParts = latestComm.ballStr.split('.');
        const over = parseInt(ballParts[0], 10);
        const ballNumber = parseInt(ballParts[1], 10);
        
        // Extract batsman/bowler from "Starc to Rohit, SIX..."
        let batsmanName = batsmen[0]?.name || 'Batter';
        let bowlerName = bowlers[0]?.name || 'Bowler';
        
        const matchupParts = latestComm.text.split(',')[0]?.split(' to ');
        if (matchupParts && matchupParts.length === 2) {
          bowlerName = matchupParts[0].trim();
          batsmanName = matchupParts[1].trim();
        }
        
        // Determine runs / wicket / extra from description text
        const lowerText = latestComm.text.toLowerCase();
        let runsScored = 0;
        let isWicket = false;
        let isExtra = false;
        let extraType: 'wide' | 'no_ball' | undefined = undefined;
        
        if (lowerText.includes('six')) runsScored = 6;
        else if (lowerText.includes('four')) runsScored = 4;
        else if (lowerText.includes('2 runs')) runsScored = 2;
        else if (lowerText.includes('3 runs')) runsScored = 3;
        else if (lowerText.includes('1 run')) runsScored = 1;
        
        if (lowerText.includes('out') || lowerText.includes('caught') || lowerText.includes('bowled') || lowerText.includes('lbw') || lowerText.includes('run out')) {
          isWicket = true;
        }
        
        if (lowerText.includes('wide')) {
          isExtra = true;
          extraType = 'wide';
        } else if (lowerText.includes('no ball')) {
          isExtra = true;
          extraType = 'no_ball';
        }
        
        newEvent = {
          ballId,
          over,
          ballNumber,
          runsScored,
          isWicket,
          isExtra,
          extraType,
          batsman: batsmanName,
          bowler: bowlerName,
          textDescription: `${latestComm.ballStr} ${latestComm.text}`,
          timestamp: Date.now()
        };
      }
    }
    
    return {
      state,
      newEvent
    };
  } catch (error) {
    console.error('Error scraping Cricbuzz match:', error);
    return null;
  }
}
