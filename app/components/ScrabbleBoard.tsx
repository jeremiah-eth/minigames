"use client";

import { BoardTile } from "../hooks/useGameState";
import { Tile } from "./Tile";
import { WordValidation } from "../lib/scrabble-utils";

interface ScrabbleBoardProps {
  board: BoardTile[][];
  onTilePlace: (row: number, col: number) => void;
  onTileRemove: (row: number, col: number) => void;
  currentTurn: 'player' | 'ai';
  selectedTile: { tile: string; index: number } | null;
  validation: WordValidation | null;
}

export function ScrabbleBoard({ 
  board, 
  onTilePlace, 
  onTileRemove, 
  currentTurn, 
  selectedTile,
  validation 
}: ScrabbleBoardProps) {
  const getBonusSquareClass = (bonusType: BoardTile['bonusType']) => {
    switch (bonusType) {
      case 'triple-word':
        return 'bg-red-400/20 border-red-400/30';
      case 'double-word':
        return 'bg-pink-400/20 border-pink-400/30';
      case 'triple-letter':
        return 'bg-blue-400/20 border-blue-400/30';
      case 'double-letter':
        return 'bg-cyan-400/20 border-cyan-400/30';
      default:
        return 'bg-white/80 border-gray-200';
    }
  };

  const getBonusLabel = (bonusType: BoardTile['bonusType']) => {
    switch (bonusType) {
      case 'triple-word':
        return 'TW';
      case 'double-word':
        return 'DW';
      case 'triple-letter':
        return 'TL';
      case 'double-letter':
        return 'DL';
      default:
        return '';
    }
  };

  const handleSquareClick = (row: number, col: number) => {
    if (currentTurn !== 'player') return;
    
    const tile = board[row][col];
    if (tile.letter && tile.isPlaced) {
      onTileRemove(row, col);
    } else if (selectedTile && !tile.letter) {
      onTilePlace(row, col);
    }
  };

  const isSquareHighlighted = (row: number, col: number) => {
    if (!validation) return false;
    
    // Highlight squares that are part of the current word
    return validation.words.some(word => {
      // This is a simplified check - in a real implementation you'd track which squares form which words
      return true; // For now, highlight all squares when there's a valid word
    });
  };

  return (
    <div className="w-full aspect-square bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-2 shadow-lg">
      <div className="grid grid-cols-15 gap-0.5 w-full h-full">
        {board.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                relative aspect-square border border-gray-300 rounded-sm
                ${getBonusSquareClass(tile.bonusType)}
                ${currentTurn === 'player' && !tile.letter && selectedTile ? 'cursor-pointer hover:bg-blue-50/50' : ''}
                ${currentTurn === 'player' && tile.letter && tile.isPlaced ? 'cursor-pointer hover:bg-red-50/50' : ''}
                ${isSquareHighlighted(rowIndex, colIndex) && validation?.isValid ? 'ring-2 ring-green-400' : ''}
                ${isSquareHighlighted(rowIndex, colIndex) && validation && !validation.isValid ? 'ring-2 ring-red-400' : ''}
                transition-all duration-200
              `}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            >
              {/* Bonus square label */}
              {tile.bonusType !== 'none' && !tile.letter && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">
                    {getBonusLabel(tile.bonusType)}
                  </span>
                </div>
              )}
              
              {/* Placed tile */}
              {tile.letter && (
                <Tile
                  letter={tile.letter}
                  value={tile.value}
                  isPlaced={true}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                />
              )}

              {/* Selection indicator */}
              {selectedTile && !tile.letter && currentTurn === 'player' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-500/20 rounded-full border-2 border-blue-500/50"></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
