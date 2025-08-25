"use client";

interface TileProps {
  letter: string;
  value: number;
  isPlaced?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Tile({ letter, value, isPlaced = false, isSelected = false, onClick, className = "" }: TileProps) {
  return (
    <div
      className={`
        relative w-full h-full bg-gradient-to-br from-amber-100 to-amber-200
        border-2 border-amber-300 rounded-md shadow-sm
        flex flex-col items-center justify-center
        ${isPlaced ? 'shadow-md' : 'shadow-sm'}
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
        ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-105' : ''}
        transition-all duration-200 ease-in-out
        ${className}
      `}
      onClick={onClick}
    >
      {/* Letter */}
      <div className="text-lg font-bold text-gray-800 leading-none">
        {letter}
      </div>
      
      {/* Value */}
      <div className="absolute bottom-0.5 right-0.5 text-xs font-semibold text-gray-600">
        {value}
      </div>
    </div>
  );
}
