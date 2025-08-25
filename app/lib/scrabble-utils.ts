import words from 'an-array-of-english-words';

// Scrabble constants
export const LETTER_VALUES: Record<string, number> = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
  N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
};

export const TILE_DISTRIBUTION: Record<string, number> = {
  A: 9, B: 2, C: 2, D: 4, E: 12, F: 2, G: 3, H: 2, I: 9, J: 1, K: 1, L: 4, M: 2,
  N: 6, O: 8, P: 2, Q: 1, R: 6, S: 4, T: 6, U: 4, V: 2, W: 2, X: 1, Y: 2, Z: 1
};

// Bonus square positions
export const BONUS_SQUARES = {
  tripleWord: [[0,0], [7,0], [14,0], [0,7], [14,7], [0,14], [7,14], [14,14]],
  doubleWord: [[1,1], [2,2], [3,3], [4,4], [5,5], [6,6], [8,8], [9,9], [10,10], [11,11], [12,12], [13,13], [7,7]],
  tripleLetter: [[1,5], [1,9], [5,1], [5,5], [5,9], [5,13], [9,1], [9,5], [9,9], [9,13], [13,5], [13,9]],
  doubleLetter: [[0,3], [0,11], [2,6], [2,8], [3,0], [3,7], [3,14], [6,2], [6,6], [6,8], [6,12], [7,3], [7,11], [8,2], [8,6], [8,8], [8,12], [11,0], [11,7], [11,14], [12,6], [12,8], [14,3], [14,11]]
};

// Create a Set for faster word lookups
const VALID_WORDS = new Set(words.map(word => word.toUpperCase()));

export interface PlacedTile {
  row: number;
  col: number;
  letter: string;
}

export interface WordValidation {
  isValid: boolean;
  words: string[];
  score: number;
  message: string;
}

// Word validation function
export function validateWord(board: any[][], placedTiles: PlacedTile[]): WordValidation {
  if (placedTiles.length === 0) {
    return {
      isValid: false,
      words: [],
      score: 0,
      message: "No tiles placed"
    };
  }

  // Check if tiles are connected
  if (!areTilesConnected(board, placedTiles)) {
    return {
      isValid: false,
      words: [],
      score: 0,
      message: "Tiles must be connected"
    };
  }

  // Get all words formed
  const words = getAllWords(board, placedTiles);
  
  // Validate each word
  for (const word of words) {
    if (word.length < 2) continue; // Single letters are valid
    if (!VALID_WORDS.has(word)) {
      return {
        isValid: false,
        words: [],
        score: 0,
        message: `"${word}" is not a valid word`
      };
    }
  }

  // Calculate score
  const score = calculateWordScore(board, placedTiles, words);

  return {
    isValid: true,
    words,
    score,
    message: `Valid! Score: ${score}`
  };
}

// Check if placed tiles are connected
function areTilesConnected(board: any[][], placedTiles: PlacedTile[]): boolean {
  if (placedTiles.length <= 1) return true;

  // Check if tiles are in a line (horizontal or vertical)
  const rows = placedTiles.map(t => t.row);
  const cols = placedTiles.map(t => t.col);
  
  const sameRow = rows.every(r => r === rows[0]);
  const sameCol = cols.every(c => c === cols[0]);

  if (!sameRow && !sameCol) return false;

  // Check if tiles are adjacent
  if (sameRow) {
    const sortedCols = cols.sort((a, b) => a - b);
    for (let i = 1; i < sortedCols.length; i++) {
      if (sortedCols[i] - sortedCols[i-1] !== 1) return false;
    }
  } else {
    const sortedRows = rows.sort((a, b) => a - b);
    for (let i = 1; i < sortedRows.length; i++) {
      if (sortedRows[i] - sortedRows[i-1] !== 1) return false;
    }
  }

  return true;
}

// Get all words formed by the placed tiles
function getAllWords(board: any[][], placedTiles: PlacedTile[]): string[] {
  const words: string[] = [];
  
  // Get the main word (the one formed by placed tiles)
  const mainWord = getMainWord(board, placedTiles);
  if (mainWord.length >= 2) {
    words.push(mainWord);
  }

  // Get perpendicular words
  const perpendicularWords = getPerpendicularWords(board, placedTiles);
  words.push(...perpendicularWords);

  return words;
}

// Get the main word formed by placed tiles
function getMainWord(board: any[][], placedTiles: PlacedTile[]): string {
  if (placedTiles.length === 0) return "";

  const rows = placedTiles.map(t => t.row);
  const cols = placedTiles.map(t => t.col);
  
  const sameRow = rows.every(r => r === rows[0]);
  const sameCol = cols.every(c => c === cols[0]);

  if (sameRow) {
    // Horizontal word
    const row = rows[0];
    const minCol = Math.min(...cols);
    const maxCol = Math.max(...cols);
    
    let word = "";
    for (let col = minCol; col <= maxCol; col++) {
      const tile = board[row][col];
      word += tile.letter || "";
    }
    return word;
  } else {
    // Vertical word
    const col = cols[0];
    const minRow = Math.min(...rows);
    const maxRow = Math.max(...rows);
    
    let word = "";
    for (let row = minRow; row <= maxRow; row++) {
      const tile = board[row][col];
      word += tile.letter || "";
    }
    return word;
  }
}

// Get perpendicular words
function getPerpendicularWords(board: any[][], placedTiles: PlacedTile[]): string[] {
  const words: string[] = [];
  
  for (const placedTile of placedTiles) {
    const { row, col } = placedTile;
    
    // Check if this tile forms a word perpendicular to the main word
    const rows = placedTiles.map(t => t.row);
    const cols = placedTiles.map(t => t.col);
    
    const sameRow = rows.every(r => r === rows[0]);
    
    if (sameRow) {
      // Main word is horizontal, check for vertical word
      const verticalWord = getVerticalWordAt(board, row, col);
      if (verticalWord.length >= 2) {
        words.push(verticalWord);
      }
    } else {
      // Main word is vertical, check for horizontal word
      const horizontalWord = getHorizontalWordAt(board, row, col);
      if (horizontalWord.length >= 2) {
        words.push(horizontalWord);
      }
    }
  }
  
  return words;
}

// Get vertical word at a specific position
function getVerticalWordAt(board: any[][], row: number, col: number): string {
  let startRow = row;
  let endRow = row;
  
  // Find start of word
  while (startRow > 0 && board[startRow - 1][col].letter) {
    startRow--;
  }
  
  // Find end of word
  while (endRow < 14 && board[endRow + 1][col].letter) {
    endRow++;
  }
  
  // Build word
  let word = "";
  for (let r = startRow; r <= endRow; r++) {
    word += board[r][col].letter || "";
  }
  
  return word;
}

// Get horizontal word at a specific position
function getHorizontalWordAt(board: any[][], row: number, col: number): string {
  let startCol = col;
  let endCol = col;
  
  // Find start of word
  while (startCol > 0 && board[row][startCol - 1].letter) {
    startCol--;
  }
  
  // Find end of word
  while (endCol < 14 && board[row][endCol + 1].letter) {
    endCol++;
  }
  
  // Build word
  let word = "";
  for (let c = startCol; c <= endCol; c++) {
    word += board[row][c].letter || "";
  }
  
  return word;
}

// Calculate score for placed tiles
function calculateWordScore(board: any[][], placedTiles: PlacedTile[], words: string[]): number {
  let totalScore = 0;
  
  for (const word of words) {
    if (word.length < 2) continue;
    
    let wordScore = 0;
    let wordMultiplier = 1;
    
    // Calculate score for each letter in the word
    for (let i = 0; i < word.length; i++) {
      const letter = word[i];
      let letterScore = LETTER_VALUES[letter] || 0;
      let letterMultiplier = 1;
      
      // Check if this position has a placed tile with bonus
      const placedTile = placedTiles.find(t => {
        const tile = board[t.row][t.col];
        return tile.letter === letter;
      });
      
      if (placedTile) {
        const tile = board[placedTile.row][placedTile.col];
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
      }
      
      wordScore += letterScore * letterMultiplier;
    }
    
    totalScore += wordScore * wordMultiplier;
  }
  
  return totalScore;
}

// Check if first move touches center
export function isFirstMoveValid(board: any[][], placedTiles: PlacedTile[]): boolean {
  // Check if board is empty (first move)
  const hasExistingTiles = board.some(row => row.some(tile => tile.letter));
  
  if (!hasExistingTiles) {
    // First move must touch center square (7,7)
    return placedTiles.some(tile => tile.row === 7 && tile.col === 7);
  }
  
  return true;
}

// Create tile bag
export function createTileBag(): string[] {
  const bag: string[] = [];
  Object.entries(TILE_DISTRIBUTION).forEach(([letter, count]) => {
    for (let i = 0; i < count; i++) {
      bag.push(letter);
    }
  });
  return shuffleArray(bag);
}

// Shuffle array
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Draw tiles from bag
export function drawTiles(tileBag: string[], count: number): { tiles: string[]; newBag: string[] } {
  const tiles = tileBag.slice(0, count);
  const newBag = tileBag.slice(count);
  return { tiles, newBag };
}
