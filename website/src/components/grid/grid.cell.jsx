import React from 'react';
import { useGrid } from '../../hooks/use.grid.hook';
import { usePlayer } from '../../hooks/use.player.hook';

const GridCell = ({ x, y }) => {
  const { getCell, handleCellClick } = useGrid();
  const { canUpdate } = usePlayer();
  
  const cell = getCell(x, y);
  const char = cell?.char || ' ';
  const isEmpty = char === ' ';

  const handleClick = () => {
    if (!canUpdate) return;
    handleCellClick(x, y, char);
  };

  return (
    <button
      onClick={handleClick}
      disabled={!canUpdate}
      className={`
        w-12 h-12 flex items-center justify-center text-2xl font-semibold
        border-2 border-gray-400 rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        ${isEmpty 
          ? 'bg-white hover:bg-gray-50 text-gray-400' 
          : 'bg-blue-50 border-blue-300 text-gray-800'
        }
        ${!canUpdate && !isEmpty 
          ? 'opacity-50 cursor-not-allowed' 
          : canUpdate 
            ? 'cursor-pointer hover:scale-105 hover:shadow-md' 
            : 'cursor-not-allowed opacity-70'
        }
      `}
      title={isEmpty ? `Click to add character` : `Cell (${x},${y}) - ${char}`}
    >
      {isEmpty ? '·' : char}
    </button>
  );
};

export default GridCell;