import React from 'react';
import { usePlayer } from '../../hooks/use.player.hook';

const Timer = () => {
  const { hasSubmitted, timeRemaining } = usePlayer();

  if (!hasSubmitted || timeRemaining <= 0) {
    return null;
  }

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="flex items-center space-x-2 bg-orange-100 border border-orange-300 rounded-lg px-4 py-2">
      <div className="text-orange-800 text-sm font-medium">
        Next update in:
      </div>
      <div className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-mono font-bold">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
    </div>
  );
};

export default Timer;