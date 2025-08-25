"use client";

interface ScoreDisplayProps {
  playerScore: number;
  aiScore: number;
  currentTurn: 'player' | 'ai';
}

export function ScoreDisplay({ playerScore, aiScore, currentTurn }: ScoreDisplayProps) {
  return (
    <div className="w-full max-w-sm">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50">
        <div className="text-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Score</h3>
        </div>
        
        <div className="flex justify-between items-center">
          {/* Player Score */}
          <div className={`
            flex flex-col items-center p-3 rounded-lg transition-all duration-200
            ${currentTurn === 'player' 
              ? 'bg-blue-50 border-2 border-blue-200 shadow-md' 
              : 'bg-gray-50 border-2 border-gray-200'
            }
          `}>
            <div className="text-sm font-medium text-gray-600 mb-1">You</div>
            <div className="text-2xl font-bold text-gray-800">{playerScore}</div>
            {currentTurn === 'player' && (
              <div className="text-xs text-blue-600 font-medium mt-1">Active</div>
            )}
          </div>

          {/* VS Separator */}
          <div className="text-gray-400 font-medium">vs</div>

          {/* AI Score */}
          <div className={`
            flex flex-col items-center p-3 rounded-lg transition-all duration-200
            ${currentTurn === 'ai' 
              ? 'bg-purple-50 border-2 border-purple-200 shadow-md' 
              : 'bg-gray-50 border-2 border-gray-200'
            }
          `}>
            <div className="text-sm font-medium text-gray-600 mb-1">AI</div>
            <div className="text-2xl font-bold text-gray-800">{aiScore}</div>
            {currentTurn === 'ai' && (
              <div className="text-xs text-purple-600 font-medium mt-1">Thinking</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
