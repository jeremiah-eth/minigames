"use client";

import { useState } from "react";
import { Achievement } from "../lib/achievements";

interface AchievementsDisplayProps {
  achievements: Achievement[];
  onClose: () => void;
}

export function AchievementsDisplay({ achievements, onClose }: AchievementsDisplayProps) {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  
  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Achievements</h2>
            <p className="text-sm text-gray-600">
              {unlockedCount} of {totalCount} unlocked
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unlocked' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unlocked
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              filter === 'locked' 
                ? 'bg-gray-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Locked
          </button>
        </div>

        {/* Achievements List */}
        <div className="overflow-y-auto max-h-[60vh] space-y-3">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                achievement.unlocked
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold text-sm ${
                      achievement.unlocked ? 'text-gray-800' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </h3>
                    {achievement.unlocked && (
                      <span className="text-xs text-green-600 font-medium">✓</span>
                    )}
                  </div>
                  
                  <p className={`text-xs mb-2 ${
                    achievement.unlocked ? 'text-gray-600' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                  
                  {/* Progress Bar */}
                  {achievement.maxProgress && achievement.maxProgress > 1 && (
                    <div className="w-full">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress || 0} / {achievement.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            achievement.unlocked 
                              ? 'bg-green-500' 
                              : 'bg-blue-400'
                          }`}
                          style={{
                            width: `${Math.min(100, ((achievement.progress || 0) / achievement.maxProgress) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Unlock Date */}
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-gray-400 mt-2">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
