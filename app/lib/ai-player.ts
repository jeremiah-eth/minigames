import { LETTER_VALUES, BONUS_SQUARES, type PlacedTile } from './scrabble-utils';

export interface AIMove {
  tiles: PlacedTile[];
  words: string[];
  score: number;
  message: string;
}

export type AIDifficulty = 'easy' | 'medium' | 'hard';

interface BoardTile {
  letter: string | null;
  value: number;
  bonusType: 'none' | 'double-letter' | 'triple-letter' | 'double-word' | 'triple-word';
  isPlaced: boolean;
}

// Common English words for AI to use
const COMMON_WORDS = new Set([
  'CAT', 'DOG', 'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL',
  'CAN', 'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'DAY', 'GET', 'HAS', 'HIM',
  'HIS', 'HOW', 'MAN', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WAY', 'WHO',
  'BOY', 'DID', 'ITS', 'LET', 'PUT', 'SAY', 'SHE', 'TOO', 'USE', 'EAT',
  'FUN', 'GOT', 'HAD', 'HAS', 'HOT', 'JOB', 'KEY', 'LOT', 'MAP', 'NET',
  'PEN', 'RUN', 'SIT', 'TOP', 'WIN', 'YES', 'ZOO', 'BIG', 'CAR', 'FAR',
  'FEW', 'FIT', 'FIX', 'GAS', 'HIT', 'ICE', 'JAM', 'LAW', 'LOW', 'MAD',
  'MIX', 'NOD', 'PAD', 'PAL', 'PIT', 'RAT', 'RED', 'RIP', 'SAD', 'SAP',
  'SAW', 'SEA', 'SIN', 'SIP', 'SUN', 'TAP', 'TIP', 'WAR', 'WET', 'WOW'
]);

// Generate all possible words from given tiles
function generateWords(tiles: string[]): string[] {
  const words: string[] = [];
  
  // Generate all permutations of different lengths
  for (let length = 1; length <= Math.min(tiles.length, 7); length++) {
    const permutations = getPermutations(tiles, length);
    for (const perm of permutations) {
      const word = perm.join('');
      if (COMMON_WORDS.has(word) || word.length === 1) {
        words.push(word);
      }
    }
  }
  
  return [...new Set(words)]; // Remove duplicates
}

// Get all permutations of array elements
function getPermutations(arr: string[], length: number): string[][] {
  if (length === 1) return arr.map(item => [item]);
  
  const permutations: string[][] = [];
  
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const subPermutations = getPermutations(remaining, length - 1);
    
    for (const subPerm of subPermutations) {
      permutations.push([current, ...subPerm]);
    }
  }
  
  return permutations;
}

// Find all valid placement positions for a word
function findValidPositions(board: BoardTile[][], word: string): Array<{
  row: number;
  col: number;
  direction: 'horizontal' | 'vertical';
  tiles: PlacedTile[];
  score: number;
}> {
  const positions: Array<{
    row: number;
    col: number;
    direction: 'horizontal' | 'vertical';
    tiles: PlacedTile[];
    score: number;
  }> = [];
  
  // Check horizontal placements
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col <= 15 - word.length; col++) {
      const result = canPlaceWord(board, word, row, col, 'horizontal');
      if (result.canPlace) {
        positions.push({
          row,
          col,
          direction: 'horizontal',
          tiles: result.tiles,
          score: result.score
        });
      }
    }
  }
  
  // Check vertical placements
  for (let row = 0; row <= 15 - word.length; row++) {
    for (let col = 0; col < 15; col++) {
      const result = canPlaceWord(board, word, row, col, 'vertical');
      if (result.canPlace) {
        positions.push({
          row,
          col,
          direction: 'vertical',
          tiles: result.tiles,
          score: result.score
        });
      }
    }
  }
  
  return positions;
}

// Check if a word can be placed at a specific position
function canPlaceWord(
  board: BoardTile[][], 
  word: string, 
  startRow: number, 
  startCol: number, 
  direction: 'horizontal' | 'vertical'
): {
  canPlace: boolean;
  tiles: PlacedTile[];
  score: number;
} {
  const tiles: PlacedTile[] = [];
  let score = 0;
  let wordMultiplier = 1;
  
  for (let i = 0; i < word.length; i++) {
    const row = direction === 'horizontal' ? startRow : startRow + i;
    const col = direction === 'horizontal' ? startCol + i : startCol;
    const letter = word[i];
    
    // Check if position is within bounds
    if (row < 0 || row >= 15 || col < 0 || col >= 15) {
      return { canPlace: false, tiles: [], score: 0 };
    }
    
    const tile = board[row][col];
    
    // If square is occupied, it must match our letter
    if (tile.letter) {
      if (tile.letter !== letter) {
        return { canPlace: false, tiles: [], score: 0 };
      }
      // Use existing tile, no score calculation needed
      continue;
    }
    
    // Check if we can place a new tile here
    if (!canPlaceTileAt(board, row, col)) {
      return { canPlace: false, tiles: [], score: 0 };
    }
    
    // Calculate score for this tile
    let letterScore = LETTER_VALUES[letter] || 0;
    let letterMultiplier = 1;
    
    switch (tile.bonusType) {
      case 'double-letter':
        letterMultiplier = 2;
        break;
      case 'triple-letter':
        letterMultiplier = 3;
        break;
      case 'double-word':
        wordMultiplier *= 2;
        break;
      case 'triple-word':
        wordMultiplier *= 3;
        break;
    }
    
    score += letterScore * letterMultiplier;
    
    tiles.push({ row, col, letter });
  }
  
  // Apply word multiplier
  score *= wordMultiplier;
  
  return { canPlace: true, tiles, score };
}

// Check if a tile can be placed at a specific position
function canPlaceTileAt(board: BoardTile[][], row: number, col: number): boolean {
  // Check if position is empty
  if (board[row][col].letter) return false;
  
  // Check if it's adjacent to existing tiles (except for first move)
  const hasAdjacentTile = (
    (row > 0 && board[row - 1][col].letter) ||
    (row < 14 && board[row + 1][col].letter) ||
    (col > 0 && board[row][col - 1].letter) ||
    (col < 14 && board[row][col + 1].letter)
  );
  
  // Check if board has any tiles (first move check)
  const hasAnyTiles = board.some(r => r.some(t => t.letter));
  
  if (!hasAnyTiles) {
    // First move must touch center
    return row === 7 && col === 7;
  }
  
  return hasAdjacentTile;
}

// AI difficulty settings
const DIFFICULTY_SETTINGS = {
  easy: {
    maxWordsToConsider: 10,
    minWordLength: 2,
    preferShortWords: true,
    thinkingTime: 1000
  },
  medium: {
    maxWordsToConsider: 25,
    minWordLength: 3,
    preferShortWords: false,
    thinkingTime: 2000
  },
  hard: {
    maxWordsToConsider: 50,
    minWordLength: 3,
    preferShortWords: false,
    thinkingTime: 3000
  }
};

// Main AI function
export function findBestMove(
  board: BoardTile[][], 
  aiTiles: string[], 
  difficulty: AIDifficulty = 'medium'
): AIMove | null {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  
  // Generate possible words from AI tiles
  const possibleWords = generateWords(aiTiles)
    .filter(word => word.length >= settings.minWordLength)
    .sort((a, b) => {
      if (settings.preferShortWords) {
        return a.length - b.length;
      }
      return b.length - a.length;
    })
    .slice(0, settings.maxWordsToConsider);
  
  let bestMove: AIMove | null = null;
  let bestScore = -1;
  
  // Find best placement for each word
  for (const word of possibleWords) {
    const positions = findValidPositions(board, word);
    
    for (const pos of positions) {
      if (pos.score > bestScore) {
        bestScore = pos.score;
        bestMove = {
          tiles: pos.tiles,
          words: [word],
          score: pos.score,
          message: `AI plays "${word}" for ${pos.score} points`
        };
      }
    }
  }
  
  // If no valid moves found, try single letter placements
  if (!bestMove) {
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        if (canPlaceTileAt(board, row, col)) {
          const tile = aiTiles[0];
          const boardTile = board[row][col];
          let score = LETTER_VALUES[tile] || 0;
          
          // Apply bonus multipliers
          switch (boardTile.bonusType) {
            case 'double-letter':
              score *= 2;
              break;
            case 'triple-letter':
              score *= 3;
              break;
            case 'double-word':
              score *= 2;
              break;
            case 'triple-word':
              score *= 3;
              break;
          }
          
          if (score > bestScore) {
            bestScore = score;
            bestMove = {
              tiles: [{ row, col, letter: tile }],
              words: [tile],
              score,
              message: `AI places "${tile}" for ${score} points`
            };
          }
        }
      }
    }
  }
  
  return bestMove;
}

// Simulate AI thinking time
export function simulateAIThinking(difficulty: AIDifficulty): Promise<void> {
  const thinkingTime = DIFFICULTY_SETTINGS[difficulty].thinkingTime;
  return new Promise(resolve => setTimeout(resolve, thinkingTime));
}
