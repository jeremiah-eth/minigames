import { type GameState } from '../hooks/useGameState';

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  bestScore: number;
  averageScore: number;
  lastPlayed: string;
}

export interface SavedGame {
  gameState: GameState;
  timestamp: number;
  gameId: string;
}

// Generate a unique game ID
export function generateGameId(): string {
  return `scrabble_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Save game state to localStorage
export function saveGameState(walletAddress: string, gameState: GameState): void {
  try {
    const savedGame: SavedGame = {
      gameState,
      timestamp: Date.now(),
      gameId: generateGameId()
    };

    const key = `scrabble_game_${walletAddress}`;
    localStorage.setItem(key, JSON.stringify(savedGame));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

// Load game state from localStorage
export function loadGameState(walletAddress: string): SavedGame | null {
  try {
    const key = `scrabble_game_${walletAddress}`;
    const saved = localStorage.getItem(key);
    
    if (!saved) return null;
    
    const savedGame: SavedGame = JSON.parse(saved);
    
    // Check if saved game is less than 24 hours old
    const isRecent = Date.now() - savedGame.timestamp < 24 * 60 * 60 * 1000;
    
    return isRecent ? savedGame : null;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

// Clear saved game state
export function clearGameState(walletAddress: string): void {
  try {
    const key = `scrabble_game_${walletAddress}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
}

// Update player statistics
export function updatePlayerStats(walletAddress: string, gameResult: {
  score: number;
  won: boolean;
}): GameStats {
  try {
    const key = `scrabble_stats_${walletAddress}`;
    const existing = localStorage.getItem(key);
    
    let stats: GameStats = existing ? JSON.parse(existing) : {
      gamesPlayed: 0,
      gamesWon: 0,
      totalScore: 0,
      bestScore: 0,
      averageScore: 0,
      lastPlayed: new Date().toISOString()
    };
    
    // Update stats
    stats.gamesPlayed += 1;
    stats.totalScore += gameResult.score;
    stats.bestScore = Math.max(stats.bestScore, gameResult.score);
    stats.averageScore = Math.round(stats.totalScore / stats.gamesPlayed);
    stats.lastPlayed = new Date().toISOString();
    
    if (gameResult.won) {
      stats.gamesWon += 1;
    }
    
    localStorage.setItem(key, JSON.stringify(stats));
    return stats;
  } catch (error) {
    console.error('Failed to update player stats:', error);
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      totalScore: 0,
      bestScore: 0,
      averageScore: 0,
      lastPlayed: new Date().toISOString()
    };
  }
}

// Load player statistics
export function loadPlayerStats(walletAddress: string): GameStats {
  try {
    const key = `scrabble_stats_${walletAddress}`;
    const existing = localStorage.getItem(key);
    
    if (!existing) {
      return {
        gamesPlayed: 0,
        gamesWon: 0,
        totalScore: 0,
        bestScore: 0,
        averageScore: 0,
        lastPlayed: new Date().toISOString()
      };
    }
    
    return JSON.parse(existing);
  } catch (error) {
    console.error('Failed to load player stats:', error);
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      totalScore: 0,
      bestScore: 0,
      averageScore: 0,
      lastPlayed: new Date().toISOString()
    };
  }
}

// Get win rate percentage
export function getWinRate(stats: GameStats): number {
  if (stats.gamesPlayed === 0) return 0;
  return Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
}
