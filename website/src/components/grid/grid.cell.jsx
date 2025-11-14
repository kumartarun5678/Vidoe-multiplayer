import React from 'react';
import { useGrid } from '../../hooks/use.grid.hook';
import { usePlayer } from '../../hooks/use.player.hook';
import { toast } from 'react-toastify';

const GridCell = ({ x, y }) => {
  const { getCell, handleCellClick, sessionId } = useGrid();
  const { canUpdate, isLoading } = usePlayer();
  
  const cell = getCell(x, y);
  const char = cell?.char || ' ';
  const isEmpty = char === ' ';
  const isOwnCell = cell?.lastUpdatedBy === sessionId;

  const handleClick = () => {
    if (isLoading) {
      toast.error('Checking your cooldown status... Please wait.');
      return;
    }

    if (!canUpdate) {
      toast.error('You can only update one cell per minute. Please wait for the timer.');
      return;
    }
    
    handleCellClick(x, y, char);
  };

  const getCellStyles = () => {
    if (isLoading) {
      return 'bg-gray-100 border-gray-300 text-gray-400 cursor-wait';
    }
    
    if (isOwnCell) {
      return 'bg-green-100 border-green-400 hover:bg-green-200 text-gray-800';
    }
    if (isEmpty) {
      return 'bg-white hover:bg-gray-50 text-gray-400';
    }
    return 'bg-blue-50 border-blue-300 hover:bg-blue-100 text-gray-800';
  };

  const getTooltipText = () => {
    if (isLoading) {
      return 'Checking your status...';
    }
    
    if (isEmpty) {
      return `Cell (${x},${y}) - Click to add character`;
    }
    if (isOwnCell) {
      return `Your cell (${x},${y}) - ${char}`;
    }
    return `Cell (${x},${y}) - ${char} (by others)`;
  };

  return (
    <button
      onClick={handleClick}
      disabled={!canUpdate && !isEmpty || isLoading}
      className={`
        w-12 h-12 flex items-center justify-center text-2xl font-semibold
        border-2 rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        relative group
        ${getCellStyles()}
        ${canUpdate && !isLoading ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : 'cursor-not-allowed'}
        ${!canUpdate && !isEmpty ? 'opacity-80' : ''}
      `}
      title={getTooltipText()}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!isLoading && (isEmpty ? (
        <span className="text-gray-300 group-hover:text-gray-400">·</span>
      ) : (
        <span className="transform transition-transform group-hover:scale-110">
          {char}
        </span>
      ))}

      {isOwnCell && !isLoading && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      )}

      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
        {getTooltipText()}
        {!canUpdate && sessionId && !isLoading && (
          <div className="text-orange-300 mt-1">Update locked</div>
        )}
      </div>
    </button>
  );
};

export default GridCell;