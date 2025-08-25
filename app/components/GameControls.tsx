"use client";

interface GameControlsProps {
  onSubmit: () => void;
  onPass: () => void;
  onSwap: () => void;
  onReset: () => void;
  onShare?: () => void;
  currentTurn: 'player' | 'ai';
  gameStatus: 'playing' | 'finished';
  canSubmit: boolean;
  isAIThinking: boolean;
  gameOver?: boolean;
}

export function GameControls({ 
  onSubmit, 
  onPass, 
  onSwap, 
  onReset, 
  onShare,
  currentTurn, 
  gameStatus,
  canSubmit,
  isAIThinking,
  gameOver = false
}: GameControlsProps) {
  const isPlayerTurn = currentTurn === 'player';
  const isGameActive = gameStatus === 'playing';

  return (
    <div className="w-full space-y-3">
      {/* Main Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={onSubmit}
          disabled={!isPlayerTurn || !isGameActive || !canSubmit || isAIThinking}
          className={`
            flex-1 py-3 px-4 rounded-lg font-medium text-white
            bg-gradient-to-r from-blue-500 to-blue-600
            hover:from-blue-600 hover:to-blue-700
            disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed
            transition-all duration-200 shadow-md hover:shadow-lg
            transform hover:scale-105 disabled:transform-none
          `}
        >
          Submit Word
        </button>
        
        <button
          onClick={onPass}
          disabled={!isPlayerTurn || !isGameActive || isAIThinking}
          className={`
            flex-1 py-3 px-4 rounded-lg font-medium
            bg-gradient-to-r from-gray-100 to-gray-200
            hover:from-gray-200 hover:to-gray-300
            disabled:from-gray-50 disabled:to-gray-100 disabled:cursor-not-allowed
            text-gray-700 hover:text-gray-800
            transition-all duration-200 shadow-md hover:shadow-lg
            transform hover:scale-105 disabled:transform-none
          `}
        >
          Pass
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="flex space-x-2">
        <button
          onClick={onSwap}
          disabled={!isPlayerTurn || !isGameActive || isAIThinking}
          className={`
            flex-1 py-2 px-3 rounded-lg text-sm font-medium
            bg-gradient-to-r from-amber-100 to-amber-200
            hover:from-amber-200 hover:to-amber-300
            disabled:from-gray-50 disabled:to-gray-100 disabled:cursor-not-allowed
            text-amber-800 hover:text-amber-900
            transition-all duration-200 shadow-sm hover:shadow-md
            transform hover:scale-105 disabled:transform-none
          `}
        >
          Swap Tiles
        </button>
        
        <button
          onClick={onReset}
          disabled={isAIThinking}
          className={`
            flex-1 py-2 px-3 rounded-lg text-sm font-medium
            bg-gradient-to-r from-red-100 to-red-200
            hover:from-red-200 hover:to-red-300
            disabled:from-gray-50 disabled:to-gray-100 disabled:cursor-not-allowed
            text-red-800 hover:text-red-900
            transition-all duration-200 shadow-sm hover:shadow-md
            transform hover:scale-105 disabled:transform-none
          `}
        >
          New Game
        </button>
      </div>

      {/* Share Button (when game is over) */}
      {gameOver && onShare && (
        <div className="flex space-x-2">
          <button
            onClick={onShare}
            className={`
              flex-1 py-2 px-3 rounded-lg text-sm font-medium
              bg-gradient-to-r from-green-100 to-green-200
              hover:from-green-200 hover:to-green-300
              text-green-800 hover:text-green-900
              transition-all duration-200 shadow-sm hover:shadow-md
              transform hover:scale-105
            `}
          >
            Share Result
          </button>
        </div>
      )}

      {/* Turn Indicator */}
      <div className="text-center py-2">
        <div className={`
          inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
          ${isAIThinking
            ? 'bg-purple-100 text-purple-800 animate-pulse'
            : isPlayerTurn 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-purple-100 text-purple-800'
          }
        `}>
          <div className={`
            w-2 h-2 rounded-full mr-2
            ${isAIThinking ? 'bg-purple-500 animate-pulse' : isPlayerTurn ? 'bg-blue-500' : 'bg-purple-500'}
          `} />
          {isAIThinking ? 'AI Thinking...' : isPlayerTurn ? 'Your Turn' : 'AI Turn'}
        </div>
      </div>
    </div>
  );
}
