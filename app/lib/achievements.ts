export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface AchievementProgress {
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  bestScore: number;
  winStreak: number;
  longestWord: number;
  highestScoringWord: number;
  perfectGames: number; // Games won with no losses
}

// Define all achievements
export const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  {
    id: 'first_game',
    title: 'First Steps',
    description: 'Play your first game of Scrabble',
    icon: '🎯',
    maxProgress: 1
  },
  {
    id: 'first_win',
    title: 'Victory!',
    description: 'Win your first game',
    icon: '🏆',
    maxProgress: 1
  },
  {
    id: 'games_10',
    title: 'Dedicated Player',
    description: 'Play 10 games',
    icon: '🎮',
    maxProgress: 10
  },
  {
    id: 'games_50',
    title: 'Scrabble Veteran',
    description: 'Play 50 games',
    icon: '🎲',
    maxProgress: 50
  },
  {
    id: 'games_100',
    title: 'Scrabble Master',
    description: 'Play 100 games',
    icon: '👑',
    maxProgress: 100
  },
  {
    id: 'wins_5',
    title: 'Winner',
    description: 'Win 5 games',
    icon: '⭐',
    maxProgress: 5
  },
  {
    id: 'wins_25',
    title: 'Champion',
    description: 'Win 25 games',
    icon: '🏅',
    maxProgress: 25
  },
  {
    id: 'wins_50',
    title: 'Legend',
    description: 'Win 50 games',
    icon: '💎',
    maxProgress: 50
  },
  {
    id: 'score_100',
    title: 'Century Club',
    description: 'Score 100+ points in a single game',
    icon: '💯',
    maxProgress: 1
  },
  {
    id: 'score_200',
    title: 'Double Century',
    description: 'Score 200+ points in a single game',
    icon: '🔥',
    maxProgress: 1
  },
  {
    id: 'score_300',
    title: 'Triple Century',
    description: 'Score 300+ points in a single game',
    icon: '⚡',
    maxProgress: 1
  },
  {
    id: 'win_streak_3',
    title: 'Hot Streak',
    description: 'Win 3 games in a row',
    icon: '🔥',
    maxProgress: 3
  },
  {
    id: 'win_streak_5',
    title: 'Unstoppable',
    description: 'Win 5 games in a row',
    icon: '🚀',
    maxProgress: 5
  },
  {
    id: 'win_streak_10',
    title: 'Invincible',
    description: 'Win 10 games in a row',
    icon: '👑',
    maxProgress: 10
  },
  {
    id: 'perfect_game',
    title: 'Perfect Game',
    description: 'Win a game without losing any tiles',
    icon: '✨',
    maxProgress: 1
  },
  {
    id: 'win_rate_50',
    title: 'Above Average',
    description: 'Achieve a 50% win rate (minimum 10 games)',
    icon: '📈',
    maxProgress: 1
  },
  {
    id: 'win_rate_75',
    title: 'Elite Player',
    description: 'Achieve a 75% win rate (minimum 20 games)',
    icon: '🎯',
    maxProgress: 1
  },
  {
    id: 'total_score_1000',
    title: 'Score Accumulator',
    description: 'Score a total of 1,000 points across all games',
    icon: '💰',
    maxProgress: 1000
  },
  {
    id: 'total_score_5000',
    title: 'Score Master',
    description: 'Score a total of 5,000 points across all games',
    icon: '🏦',
    maxProgress: 5000
  },
  {
    id: 'daily_player',
    title: 'Daily Player',
    description: 'Play games on 7 consecutive days',
    icon: '📅',
    maxProgress: 7
  }
];

// Calculate achievement progress
export function calculateAchievementProgress(
  progress: AchievementProgress,
  unlockedAchievements: string[] = []
): Achievement[] {
  return ACHIEVEMENTS.map(achievement => {
    const unlocked = unlockedAchievements.includes(achievement.id);
    let currentProgress = 0;
    let maxProgress = achievement.maxProgress || 1;

    switch (achievement.id) {
      case 'first_game':
        currentProgress = progress.gamesPlayed >= 1 ? 1 : 0;
        break;
      case 'first_win':
        currentProgress = progress.gamesWon >= 1 ? 1 : 0;
        break;
      case 'games_10':
        currentProgress = Math.min(progress.gamesPlayed, 10);
        break;
      case 'games_50':
        currentProgress = Math.min(progress.gamesPlayed, 50);
        break;
      case 'games_100':
        currentProgress = Math.min(progress.gamesPlayed, 100);
        break;
      case 'wins_5':
        currentProgress = Math.min(progress.gamesWon, 5);
        break;
      case 'wins_25':
        currentProgress = Math.min(progress.gamesWon, 25);
        break;
      case 'wins_50':
        currentProgress = Math.min(progress.gamesWon, 50);
        break;
      case 'score_100':
        currentProgress = progress.bestScore >= 100 ? 1 : 0;
        break;
      case 'score_200':
        currentProgress = progress.bestScore >= 200 ? 1 : 0;
        break;
      case 'score_300':
        currentProgress = progress.bestScore >= 300 ? 1 : 0;
        break;
      case 'win_streak_3':
        currentProgress = Math.min(progress.winStreak, 3);
        break;
      case 'win_streak_5':
        currentProgress = Math.min(progress.winStreak, 5);
        break;
      case 'win_streak_10':
        currentProgress = Math.min(progress.winStreak, 10);
        break;
      case 'perfect_game':
        currentProgress = progress.perfectGames >= 1 ? 1 : 0;
        break;
      case 'win_rate_50':
        if (progress.gamesPlayed >= 10) {
          const winRate = (progress.gamesWon / progress.gamesPlayed) * 100;
          currentProgress = winRate >= 50 ? 1 : 0;
        }
        break;
      case 'win_rate_75':
        if (progress.gamesPlayed >= 20) {
          const winRate = (progress.gamesWon / progress.gamesPlayed) * 100;
          currentProgress = winRate >= 75 ? 1 : 0;
        }
        break;
      case 'total_score_1000':
        currentProgress = Math.min(progress.totalScore, 1000);
        break;
      case 'total_score_5000':
        currentProgress = Math.min(progress.totalScore, 5000);
        break;
      case 'daily_player':
        // This would need to be tracked separately with daily play dates
        currentProgress = 0;
        break;
    }

    return {
      ...achievement,
      unlocked,
      progress: currentProgress,
      maxProgress,
      unlockedAt: unlocked ? new Date().toISOString() : undefined
    };
  });
}

// Check for newly unlocked achievements
export function checkNewAchievements(
  oldProgress: AchievementProgress,
  newProgress: AchievementProgress,
  unlockedAchievements: string[]
): string[] {
  const oldAchievements = calculateAchievementProgress(oldProgress, unlockedAchievements);
  const newAchievements = calculateAchievementProgress(newProgress, unlockedAchievements);
  
  const newlyUnlocked: string[] = [];
  
  newAchievements.forEach(achievement => {
    const oldAchievement = oldAchievements.find(a => a.id === achievement.id);
    if (achievement.unlocked && !oldAchievement?.unlocked) {
      newlyUnlocked.push(achievement.id);
    }
  });
  
  return newlyUnlocked;
}

// Get achievement by ID
export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

// Save unlocked achievements to localStorage
export function saveUnlockedAchievements(walletAddress: string, achievements: string[]): void {
  try {
    const key = `scrabble_achievements_${walletAddress}`;
    localStorage.setItem(key, JSON.stringify(achievements));
  } catch (error) {
    console.error('Failed to save achievements:', error);
  }
}

// Load unlocked achievements from localStorage
export function loadUnlockedAchievements(walletAddress: string): string[] {
  try {
    const key = `scrabble_achievements_${walletAddress}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load achievements:', error);
    return [];
  }
}
