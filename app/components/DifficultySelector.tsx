"use client";

import { AIDifficulty } from "../lib/ai-player";

interface DifficultySelectorProps {
  currentDifficulty: AIDifficulty;
  onDifficultyChange: (difficulty: AIDifficulty) => void;
  disabled?: boolean;
}

export function DifficultySelector({ 
  currentDifficulty, 
  onDifficultyChange, 
  disabled = false 
}: DifficultySelectorProps) {
  const difficulties: Array<{ value: AIDifficulty; label: string; description: string }> = [
    {
      value: 'easy',
      label: 'Easy',
      description: 'Short words, quick moves'
    },
    {
      value: 'medium',
      label: 'Medium',
      description: 'Balanced gameplay'
    },
    {
      value: 'hard',
      label: 'Hard',
      description: 'Long words, strategic moves'
    }
  ];

  return (
    <div className="w-full">
      <div className="text-sm font-medium text-gray-700 mb-2 text-center">
        AI Difficulty
      </div>
      <div className="flex space-x-1">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.value}
            onClick={() => onDifficultyChange(difficulty.value)}
            disabled={disabled}
            className={`
              flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200
              ${currentDifficulty === difficulty.value
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={difficulty.description}
          >
            {difficulty.label}
          </button>
        ))}
      </div>
    </div>
  );
}
