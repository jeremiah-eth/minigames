import { useState, useCallback, useEffect } from "react";
import { 
  LETTER_VALUES, 
  BONUS_SQUARES, 
  createTileBag, 
  drawTiles, 
  validateWord, 
  isFirstMoveValid,
  type PlacedTile,
  type WordValidation
} from "../lib/scrabble-utils";
import { findBestMove, simulateAIThinking, type AIDifficulty, type AIMove } from "../lib/ai-player";
import { 
  saveGameState, 
  loadGameState, 
  clearGameState, 
  updatePlayerStats, 
  loadPlayerStats,
  type GameStats 
} from "../lib/game-persistence";

export interface BoardTile {
  letter: string | null;
  value: number;
  bonusType: 'none' | 'double-letter' | 'triple-letter' | 'double-word' | 'triple-word';
  isPlaced: boolean;
}

export interface GameState {
  board: BoardTile[][];
  playerTiles: string[];
  aiTiles: string[];
  playerScore: number;
  aiScore: number;
  currentTurn: 'player' | 'ai';
  gameStatus: 'playing' | 'finished';
  tileBag: string[];
  selectedTile: { tile: string; index: number } | null;
  placedTiles: PlacedTile[];
  validation: WordValidation | null;
  message: string;
  aiDifficulty: AIDifficulty;
  isAIThinking: boolean;
  aiMove: AIMove | null;
}

function createBoard(): BoardTile[][] {
  const board: BoardTile[][] = [];
  for (let row = 0; row < 15; row++) {
    board[row] = [];
    for (let col = 0; col < 15; col++) {
      let bonusType: BoardTile['bonusType'] = 'none';
      
      if (BONUS_SQUARES.tripleWord.some(([r, c]) => r === row && c === col)) {
        bonusType = 'triple-word';
      } else if (BONUS_SQUARES.doubleWord.some(([r, c]) => r === row && c === col)) {
        bonusType = 'double-word';
      } else if (BONUS_SQUARES.tripleLetter.some(([r, c]) => r === row && c === col)) {
        bonusType = 'triple-letter';
      } else if (BONUS_SQUARES.doubleLetter.some(([r, c]) => r === row && c === col)) {
        bonusType = 'double-letter';
      }
      
      board[row][col] = {
        letter: null,
        value: 0,
        bonusType,
        isPlaced: false
      };
    }
  }
  return board;
}

export function useGameState(walletAddress?: string) {
  const [gameState, setGameState] = useState<GameState>(() => {
    const tileBag = createTileBag();
    const { tiles: playerTiles, newBag: bagAfterPlayer } = drawTiles(tileBag, 7);
    const { tiles: aiTiles, newBag: finalBag } = drawTiles(bagAfterPlayer, 7);
    
    return {
      board: createBoard(),
      playerTiles,
      aiTiles,
      playerScore: 0,
      aiScore: 0,
      currentTurn: 'player',
      gameStatus: 'playing',
      tileBag: finalBag,
      selectedTile: null,
      placedTiles: [],
      validation: null,
      message: "Select a tile and place it on the board",
      aiDifficulty: 'medium',
      isAIThinking: false,
      aiMove: null
    };
  });

  const [playerStats, setPlayerStats] = useState<GameStats | null>(null);

  // Load saved game and stats when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      // Load player stats
      const stats = loadPlayerStats(walletAddress);
      setPlayerStats(stats);
      
      // Load saved game if exists
      const savedGame = loadGameState(walletAddress);
      if (savedGame) {
        setGameState(savedGame.gameState);
      }
    }
  }, [walletAddress]);

  // Save game state when it changes
  useEffect(() => {
    if (walletAddress && gameState.gameStatus === 'playing') {
      saveGameState(walletAddress, gameState);
    }
  }, [gameState, walletAddress]);

  // AI turn handler
  useEffect(() => {
    if (gameState.currentTurn === 'ai' && gameState.gameStatus === 'playing' && !gameState.isAIThinking) {
      handleAITurn();
    }
  }, [gameState.currentTurn, gameState.gameStatus, gameState.isAIThinking]);

  const handleAITurn = useCallback(async () => {
    setGameState(prev => ({ ...prev, isAIThinking: true, message: "AI is thinking..." }));
    
    // Simulate thinking time
    await simulateAIThinking(gameState.aiDifficulty);
    
    // Find AI move
    const aiMove = findBestMove(gameState.board, gameState.aiTiles, gameState.aiDifficulty);
    
    if (aiMove) {
      // Execute AI move
      setGameState(prev => {
        const newBoard = prev.board.map(row => row.map(tile => ({ ...tile })));
        
        // Place AI tiles
        for (const tile of aiMove.tiles) {
          newBoard[tile.row][tile.col] = {
            ...newBoard[tile.row][tile.col],
            letter: tile.letter,
            value: LETTER_VALUES[tile.letter],
            isPlaced: true
          };
        }
        
        // Remove used tiles from AI rack
        const usedLetters = aiMove.tiles.map(t => t.letter);
        const newAiTiles = [...prev.aiTiles];
        for (const letter of usedLetters) {
          const index = newAiTiles.indexOf(letter);
          if (index > -1) {
            newAiTiles.splice(index, 1);
          }
        }
        
        // Draw new tiles for AI
        const tilesToDraw = Math.min(aiMove.tiles.length, prev.tileBag.length);
        const { tiles: newTiles, newBag } = drawTiles(prev.tileBag, tilesToDraw);
        const finalAiTiles = [...newAiTiles, ...newTiles];
        
        // Check if game is over
        const isGameOver = finalAiTiles.length === 0 && newBag.length === 0;
        
        return {
          ...prev,
          board: newBoard,
          aiTiles: finalAiTiles,
          aiScore: prev.aiScore + aiMove.score,
          tileBag: newBag,
          currentTurn: isGameOver ? 'player' : 'player',
          gameStatus: isGameOver ? 'finished' : 'playing',
          isAIThinking: false,
          aiMove: null,
          message: isGameOver ? "Game Over!" : aiMove.message
        };
      });
    } else {
      // AI passes
      setGameState(prev => ({
        ...prev,
        currentTurn: 'player',
        isAIThinking: false,
        aiMove: null,
        message: "AI passes. Your turn."
      }));
    }
  }, [gameState.board, gameState.aiTiles, gameState.aiDifficulty]);

  const selectTile = useCallback((tile: string, index: number) => {
    if (gameState.currentTurn !== 'player' || gameState.gameStatus !== 'playing') return;
    
    setGameState(prev => ({
      ...prev,
      selectedTile: { tile, index },
      message: `Selected ${tile}. Click on the board to place it.`
    }));
  }, [gameState.currentTurn, gameState.gameStatus]);

  const placeTile = useCallback((row: number, col: number) => {
    if (gameState.currentTurn !== 'player' || gameState.gameStatus !== 'playing') return;
    if (!gameState.selectedTile) return;
    
    const { tile: letter, index } = gameState.selectedTile;
    
    // Check if square is empty
    if (gameState.board[row][col].letter) {
      setGameState(prev => ({
        ...prev,
        message: "Square is already occupied"
      }));
      return;
    }
    
    setGameState(prev => {
      const newBoard = prev.board.map(row => row.map(tile => ({ ...tile })));
      newBoard[row][col] = {
        ...newBoard[row][col],
        letter,
        value: LETTER_VALUES[letter],
        isPlaced: true
      };
      
      const newPlacedTiles = [...prev.placedTiles, { row, col, letter }];
      const newPlayerTiles = prev.playerTiles.filter((_, i) => i !== index);
      
      // Validate the move
      const validation = validateWord(newBoard, newPlacedTiles);
      
      let message = validation.message;
      if (validation.isValid && !isFirstMoveValid(newBoard, newPlacedTiles)) {
        message = "First move must touch the center square";
        validation.isValid = false;
      }
      
      return {
        ...prev,
        board: newBoard,
        playerTiles: newPlayerTiles,
        placedTiles: newPlacedTiles,
        selectedTile: null,
        validation,
        message
      };
    });
  }, [gameState.currentTurn, gameState.gameStatus, gameState.selectedTile, gameState.board, gameState.placedTiles, gameState.playerTiles]);

  const removeTile = useCallback((row: number, col: number) => {
    setGameState(prev => {
      const tile = prev.board[row][col];
      if (!tile.letter || !tile.isPlaced) return prev;
      
      const newBoard = prev.board.map(row => row.map(tile => ({ ...tile })));
      newBoard[row][col] = {
        ...newBoard[row][col],
        letter: null,
        value: 0,
        isPlaced: false
      };
      
      const newPlacedTiles = prev.placedTiles.filter(t => !(t.row === row && t.col === col));
      const newPlayerTiles = [...prev.playerTiles, tile.letter];
      
      // Re-validate after removal
      const validation = newPlacedTiles.length > 0 ? validateWord(newBoard, newPlacedTiles) : null;
      
      return {
        ...prev,
        board: newBoard,
        playerTiles: newPlayerTiles,
        placedTiles: newPlacedTiles,
        validation,
        message: newPlacedTiles.length > 0 ? validation?.message || "Tile removed" : "Select a tile and place it on the board"
      };
    });
  }, []);

  const submitWord = useCallback(() => {
    if (gameState.currentTurn !== 'player' || gameState.gameStatus !== 'playing') return;
    if (!gameState.validation?.isValid) return;
    
    setGameState(prev => {
      // Add score
      const newPlayerScore = prev.playerScore + (prev.validation?.score || 0);
      
      // Draw new tiles
      const tilesToDraw = Math.min(prev.placedTiles.length, prev.tileBag.length);
      const { tiles: newTiles, newBag } = drawTiles(prev.tileBag, tilesToDraw);
      const newPlayerTiles = [...prev.playerTiles, ...newTiles];
      
      // Check if game is over
      const isGameOver = newPlayerTiles.length === 0 && newBag.length === 0;
      
      // Update stats if game is over and wallet is connected
      if (isGameOver && walletAddress) {
        const playerWon = newPlayerScore > prev.aiScore;
        const newStats = updatePlayerStats(walletAddress, {
          score: newPlayerScore,
          won: playerWon
        });
        setPlayerStats(newStats);
      }
      
      return {
        ...prev,
        playerScore: newPlayerScore,
        playerTiles: newPlayerTiles,
        tileBag: newBag,
        currentTurn: isGameOver ? 'player' : 'ai',
        gameStatus: isGameOver ? 'finished' : 'playing',
        placedTiles: [],
        selectedTile: null,
        validation: null,
        message: isGameOver ? "Game Over!" : "AI is thinking..."
      };
    });
  }, [gameState.currentTurn, gameState.gameStatus, gameState.validation, gameState.placedTiles, gameState.tileBag, gameState.playerTiles, gameState.playerScore, walletAddress]);

  const passTurn = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentTurn: prev.currentTurn === 'player' ? 'ai' : 'player',
      placedTiles: [],
      selectedTile: null,
      validation: null,
      message: prev.currentTurn === 'player' ? "AI is thinking..." : "Your turn"
    }));
  }, []);

  const swapTiles = useCallback(() => {
    if (gameState.currentTurn !== 'player' || gameState.gameStatus !== 'playing') return;
    if (gameState.tileBag.length < 3) {
      setGameState(prev => ({
        ...prev,
        message: "Not enough tiles in bag to swap"
      }));
      return;
    }
    
    setGameState(prev => {
      // Return current tiles to bag
      const newBag = [...prev.tileBag, ...prev.playerTiles];
      
      // Draw new tiles
      const { tiles: newTiles, newBag: finalBag } = drawTiles(newBag, 7);
      
      return {
        ...prev,
        playerTiles: newTiles,
        tileBag: finalBag,
        selectedTile: null,
        placedTiles: [],
        validation: null,
        message: "Tiles swapped. Your turn."
      };
    });
  }, [gameState.currentTurn, gameState.gameStatus, gameState.tileBag, gameState.playerTiles]);

  const setAIDifficulty = useCallback((difficulty: AIDifficulty) => {
    setGameState(prev => ({
      ...prev,
      aiDifficulty: difficulty
    }));
  }, []);

  const resetGame = useCallback(() => {
    const tileBag = createTileBag();
    const { tiles: playerTiles, newBag: bagAfterPlayer } = drawTiles(tileBag, 7);
    const { tiles: aiTiles, newBag: finalBag } = drawTiles(bagAfterPlayer, 7);
    
    const newGameState = {
      board: createBoard(),
      playerTiles,
      aiTiles,
      playerScore: 0,
      aiScore: 0,
      currentTurn: 'player',
      gameStatus: 'playing',
      tileBag: finalBag,
      selectedTile: null,
      placedTiles: [],
      validation: null,
      message: "Select a tile and place it on the board",
      aiDifficulty: 'medium',
      isAIThinking: false,
      aiMove: null
    };
    
    setGameState(newGameState);
    
    // Clear saved game state
    if (walletAddress) {
      clearGameState(walletAddress);
    }
  }, [walletAddress]);

  return {
    gameState,
    playerStats,
    selectTile,
    placeTile,
    removeTile,
    submitWord,
    passTurn,
    swapTiles,
    setAIDifficulty,
    resetGame
  };
}
