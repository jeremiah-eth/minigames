"use client";

import { Tile } from "./Tile";

interface TileRackProps {
  tiles: string[];
  onTileSelect?: (tile: string, index: number) => void;
  currentTurn: 'player' | 'ai';
  selectedTile: { tile: string; index: number } | null;
}

const LETTER_VALUES: Record<string, number> = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
  N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
};

export function TileRack({ tiles, onTileSelect, currentTurn, selectedTile }: TileRackProps) {
  const isPlayerTurn = currentTurn === 'player';

  return (
    <div className="w-full">
      <div className="text-sm font-medium text-gray-700 mb-2 text-center">
        Your Tiles
      </div>
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-3 shadow-md">
        <div className="flex justify-center items-center space-x-1">
          {tiles.map((tile, index) => (
            <div
              key={index}
              className="w-8 h-8 flex-shrink-0"
            >
              <Tile
                letter={tile}
                value={LETTER_VALUES[tile]}
                isSelected={selectedTile?.index === index}
                onClick={isPlayerTurn ? () => onTileSelect?.(tile, index) : undefined}
                className={isPlayerTurn ? 'hover:scale-110' : ''}
              />
            </div>
          ))}
          {/* Fill empty slots */}
          {Array.from({ length: 7 - tiles.length }, (_, index) => (
            <div
              key={`empty-${index}`}
              className="w-8 h-8 bg-gray-200/50 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center"
            >
              <span className="text-xs text-gray-400">?</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
