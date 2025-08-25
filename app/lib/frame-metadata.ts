import { type GameState } from '../hooks/useGameState';
import { type GameStats } from './game-persistence';

export interface FrameMetadata {
  title: string;
  description: string;
  image: string;
  buttons: Array<{
    label: string;
    action: string;
  }>;
  postUrl?: string;
}

// Generate Frame metadata for current game state
export function generateGameFrameMetadata(
  gameState: GameState,
  playerStats?: GameStats
): FrameMetadata {
  const isGameOver = gameState.gameStatus === 'finished';
  const playerWon = gameState.playerScore > gameState.aiScore;
  const isPlayerTurn = gameState.currentTurn === 'player';
  
  let title: string;
  let description: string;
  let image: string;
  
  if (isGameOver) {
    if (playerWon) {
      title = "🏆 I Won at Scrabble!";
      description = `Final Score: ${gameState.playerScore} - ${gameState.aiScore}`;
      image = `https://api.dicebear.com/7.x/shapes/svg?seed=winner&backgroundColor=4f46e5&shape1Color=ffffff&shape2Color=fbbf24&shape3Color=10b981`;
    } else {
      title = "🎯 Great Game of Scrabble!";
      description = `Final Score: ${gameState.aiScore} - ${gameState.playerScore}`;
      image = `https://api.dicebear.com/7.x/shapes/svg?seed=game&backgroundColor=6b7280&shape1Color=ffffff&shape2Color=f59e0b&shape3Color=ef4444`;
    }
  } else {
    title = "🎲 Playing Scrabble on Base";
    description = isPlayerTurn 
      ? `My turn! Score: ${gameState.playerScore} - ${gameState.aiScore}`
      : `AI thinking... Score: ${gameState.playerScore} - ${gameState.aiScore}`;
    image = `https://api.dicebear.com/7.x/shapes/svg?seed=playing&backgroundColor=3b82f6&shape1Color=ffffff&shape2Color=8b5cf6&shape3Color=06b6d4`;
  }
  
  // Add stats if available
  if (playerStats && playerStats.gamesPlayed > 0) {
    const winRate = Math.round((playerStats.gamesWon / playerStats.gamesPlayed) * 100);
    description += ` | ${winRate}% win rate`;
  }
  
  const buttons = [
    {
      label: "Play Scrabble",
      action: "post"
    },
    {
      label: isGameOver ? "New Game" : "Continue Game",
      action: "post"
    }
  ];
  
  if (playerStats && playerStats.gamesPlayed > 0) {
    buttons.push({
      label: "View Stats",
      action: "post"
    });
  }
  
  return {
    title,
    description,
    image,
    buttons,
    postUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?game=${encodeURIComponent(JSON.stringify({
      playerScore: gameState.playerScore,
      aiScore: gameState.aiScore,
      gameStatus: gameState.gameStatus,
      timestamp: Date.now()
    }))}`
  };
}

// Generate Frame metadata for game statistics
export function generateStatsFrameMetadata(
  playerStats: GameStats,
  walletAddress: string
): FrameMetadata {
  const winRate = Math.round((playerStats.gamesWon / playerStats.gamesPlayed) * 100);
  
  const title = "📊 My Scrabble Stats";
  const description = `${playerStats.gamesPlayed} games | ${winRate}% win rate | Best: ${playerStats.bestScore}`;
  const image = `https://api.dicebear.com/7.x/shapes/svg?seed=stats&backgroundColor=10b981&shape1Color=ffffff&shape2Color=059669&shape3Color=34d399`;
  
  const buttons = [
    {
      label: "Play Scrabble",
      action: "post"
    },
    {
      label: "Share Stats",
      action: "post"
    }
  ];
  
  return {
    title,
    description,
    image,
    buttons,
    postUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?stats=${encodeURIComponent(JSON.stringify({
      gamesPlayed: playerStats.gamesPlayed,
      winRate,
      bestScore: playerStats.bestScore,
      walletAddress: walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4)
    }))}`
  };
}

// Generate Frame metadata for game invitation
export function generateInviteFrameMetadata(
  playerStats?: GameStats
): FrameMetadata {
  const title = "🎲 Challenge Me to Scrabble!";
  const description = playerStats && playerStats.gamesPlayed > 0
    ? `I've played ${playerStats.gamesPlayed} games with ${Math.round((playerStats.gamesWon / playerStats.gamesPlayed) * 100)}% win rate`
    : "Let's play Scrabble on Base!";
  const image = `https://api.dicebear.com/7.x/shapes/svg?seed=invite&backgroundColor=8b5cf6&shape1Color=ffffff&shape2Color=a855f7&shape3Color=c084fc`;
  
  const buttons = [
    {
      label: "Accept Challenge",
      action: "post"
    },
    {
      label: "Play Scrabble",
      action: "post"
    }
  ];
  
  return {
    title,
    description,
    image,
    buttons,
    postUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?invite=true`
  };
}

// Parse game data from URL parameters
export function parseGameDataFromUrl(url: string): {
  gameData?: any;
  statsData?: any;
  isInvite?: boolean;
} {
  try {
    const urlObj = new URL(url);
    const gameParam = urlObj.searchParams.get('game');
    const statsParam = urlObj.searchParams.get('stats');
    const inviteParam = urlObj.searchParams.get('invite');
    
    return {
      gameData: gameParam ? JSON.parse(decodeURIComponent(gameParam)) : undefined,
      statsData: statsParam ? JSON.parse(decodeURIComponent(statsParam)) : undefined,
      isInvite: inviteParam === 'true'
    };
  } catch (error) {
    console.error('Failed to parse game data from URL:', error);
    return {};
  }
}
