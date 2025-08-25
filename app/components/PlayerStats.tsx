"use client";

import { GameStats, getWinRate } from "../lib/game-persistence";

interface PlayerStatsProps {
  stats: GameStats;
  onClose: () => void;
  onShare: () => void;
}

export function PlayerStats({ stats, onClose, onShare }: PlayerStatsProps) {
  const winRate = getWinRate(stats);
  const lastPlayed = new Date(stats.lastPlayed).toLocaleDateString();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Your Stats</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.gamesPlayed}</div>
            <div className="text-sm text-blue-700">Games Played</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.gamesWon}</div>
            <div className="text-sm text-green-700">Games Won</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{winRate}%</div>
            <div className="text-sm text-purple-700">Win Rate</div>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{stats.bestScore}</div>
            <div className="text-sm text-amber-700">Best Score</div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Average Score</span>
            <span className="font-semibold text-gray-800">{stats.averageScore}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Total Score</span>
            <span className="font-semibold text-gray-800">{stats.totalScore}</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Last Played</span>
            <span className="font-semibold text-gray-800">{lastPlayed}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onShare}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Share Stats
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
