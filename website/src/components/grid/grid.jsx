import React from 'react';
import GridCell from './grid.cell';
import { useGrid } from '../../hooks/use.grid.hook';

const Grid = () => {
  const { cells } = useGrid();
  const gridSize = 10;

  if (!cells || cells.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-500">Loading grid...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex justify-center">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize + 1}, minmax(0, 1fr))` }}>
          <div className="w-12 h-8"></div>
          {Array.from({ length: gridSize }).map((_, x) => (
            <div key={`col-${x}`} className="w-12 h-8 flex items-center justify-center text-sm font-medium text-gray-600">
              {x}
            </div>
          ))}
        </div>
      </div>
      <div className="flex">
        <div className="mr-4">
          {Array.from({ length: gridSize }).map((_, y) => (
            <div key={`row-${y}`} className="h-12 flex items-center justify-center text-sm font-medium text-gray-600 mb-1">
              {y}
            </div>
          ))}
        </div>
        <div 
          className="grid gap-1 bg-gradient-to-br from-gray-200 to-gray-300 p-4 rounded-xl shadow-inner"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
          }}
        >
          {Array.from({ length: gridSize }).map((_, x) =>
            Array.from({ length: gridSize }).map((_, y) => (
              <GridCell
                key={`${x}-${y}`}
                x={x}
                y={y}
              />
            ))
          )}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-2 border-gray-400 rounded"></div>
          <span>Empty cell</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 border-2 border-blue-300 rounded"></div>
          <span>Occupied cell</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-400 rounded"></div>
          <span>Your cell</span>
        </div>
      </div>
    </div>
  );
};

export default Grid;