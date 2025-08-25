"use client";

import { useState, useEffect } from "react";
import { ScrabbleBoard } from "./ScrabbleBoard";
import { TileRack } from "./TileRack";
import { GameControls } from "./GameControls";
import { ScoreDisplay } from "./ScoreDisplay";
import { GameHeader } from "./GameHeader";
import { DifficultySelector } from "./DifficultySelector";
import { PlayerStats } from "./PlayerStats";
import { useGameState } from "../hooks/useGameState";
import { generateGameFrameMetadata, generateStatsFrameMetadata } from "../lib/frame-metadata";
import { useAddFrame } from "@coinbase/onchainkit/minikit";

interface ScrabbleGameProps {
  walletAddress?: string;
}

export function ScrabbleGame({ walletAddress }: ScrabbleGameProps) {
  const [showStats, setShowStats] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const {
    gameState,
    playerStats,
    selectTile,
    placeTile,
    removeTile,
    submitWord,
    passTurn,
    swapTiles,
    setAIDifficulty,
    resetGame,
  } = useGameState(walletAddress);

  const addFrame = useAddFrame();

  // Auto-save game state when it changes
  useEffect(() => {
    if (walletAddress && gameState.gameStatus === 'playing') {
      // Game state is automatically saved in the hook
    }
  }, [gameState, walletAddress]);

  const handleShareGame = async () => {
    try {
      const frameMetadata = generateGameFrameMetadata(gameState, playerStats || undefined);
      await addFrame();
      setShowShareModal(false);
    } catch (error) {
      console.error('Failed to share game:', error);
    }
  };

  const handleShareStats = async () => {
    try {
      if (playerStats && walletAddress) {
        const frameMetadata = generateStatsFrameMetadata(playerStats, walletAddress);
        await addFrame();
        setShowStats(false);
      }
    } catch (error) {
      console.error('Failed to share stats:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Game Header */}
      <GameHeader 
        currentTurn={gameState.currentTurn}
        gameStatus={gameState.gameStatus}
        onStatsClick={() => setShowStats(true)}
        playerStats={playerStats}
      />

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
        {/* Score Display */}
        <ScoreDisplay 
          playerScore={gameState.playerScore}
          aiScore={gameState.aiScore}
          currentTurn={gameState.currentTurn}
        />

        {/* Difficulty Selector */}
        <div className="w-full max-w-sm">
          <DifficultySelector
            currentDifficulty={gameState.aiDifficulty}
            onDifficultyChange={setAIDifficulty}
            disabled={gameState.currentTurn === 'ai' || gameState.isAIThinking}
          />
        </div>

        {/* Game Board */}
        <div className="w-full max-w-sm">
          <ScrabbleBoard 
            board={gameState.board}
            onTilePlace={placeTile}
            onTileRemove={removeTile}
            currentTurn={gameState.currentTurn}
            selectedTile={gameState.selectedTile}
            validation={gameState.validation}
          />
        </div>

        {/* Tile Rack */}
        <div className="w-full max-w-sm">
          <TileRack 
            tiles={gameState.playerTiles}
            onTileSelect={selectTile}
            currentTurn={gameState.currentTurn}
            selectedTile={gameState.selectedTile}
          />
        </div>

        {/* Game Message */}
        <div className="w-full max-w-sm text-center">
          <div className={`
            px-4 py-2 rounded-lg text-sm font-medium
            ${gameState.isAIThinking 
              ? 'bg-purple-100 text-purple-800 border border-purple-200 animate-pulse'
              : gameState.validation?.isValid 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : gameState.validation 
              ? 'bg-red-100 text-red-800 border border-red-200'
              : 'bg-blue-100 text-blue-800 border border-blue-200'
            }
          `}>
            {gameState.message}
          </div>
        </div>

        {/* Game Controls */}
        <div className="w-full max-w-sm">
          <GameControls 
            onSubmit={submitWord}
            onPass={passTurn}
            onSwap={swapTiles}
            onReset={resetGame}
            currentTurn={gameState.currentTurn}
            gameStatus={gameState.gameStatus}
            canSubmit={gameState.validation?.isValid || false}
            isAIThinking={gameState.isAIThinking}
            onShare={() => setShowShareModal(true)}
            gameOver={gameState.gameStatus === 'finished'}
          />
        </div>
      </div>

      {/* Player Stats Modal */}
      {showStats && playerStats && (
        <PlayerStats
          stats={playerStats}
          onClose={() => setShowStats(false)}
          onShare={handleShareStats}
        />
      )}

      {/* Share Game Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Share Game</h3>
            <p className="text-gray-600 mb-6">
              Share your current game state or final result with friends!
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleShareGame}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Share Game
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
