"use client";

import { GameStats } from "../lib/game-persistence";

interface GameHeaderProps {
  currentTurn: 'player' | 'ai';
  gameStatus: 'playing' | 'finished';
  onStatsClick?: () => void;
  playerStats?: GameStats | null;
}

export function GameHeader({ currentTurn, gameStatus, onStatsClick, playerStats }: GameHeaderProps) {
  const winRate = playerStats ? Math.round((playerStats.gamesWon / playerStats.gamesPlayed) * 100) : 0;

  return (
    <div className="w-full bg-white/90 backdrop-blur-sm border-b border-gray-200/50 px-4 py-3">
      <div className="max-w-sm mx-auto flex justify-between items-center">
        {/* Game Title */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Scrabble</h1>
            <p className="text-xs text-gray-500">vs AI</p>
          </div>
        </div>

        {/* Game Status & Stats */}
        <div className="flex items-center space-x-3">
          {/* Stats Button */}
          {playerStats && playerStats.gamesPlayed > 0 && (
            <button
              onClick={onStatsClick}
              className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title="View Stats"
            >
              <span className="text-xs font-medium text-gray-700">
                {winRate}% WR
              </span>
              <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          )}

          {/* Game Status */}
          <div className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${gameStatus === 'playing'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            }
          `}>
            <div className={`
              w-1.5 h-1.5 rounded-full mr-1.5
              ${gameStatus === 'playing' ? 'bg-green-500' : 'bg-red-500'}
            `} />
            {gameStatus === 'playing' ? 'Active' : 'Finished'}
          </div>
        </div>
      </div>
    </div>
  );
}
