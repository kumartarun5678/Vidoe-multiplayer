import React from 'react';
import { useWebSocket } from '../../hooks/use.web.socket.hook';

const PlayerCounter = () => {
  const { playerCount, isConnected } = useWebSocket();

  return (
    <div className="flex items-center space-x-3">
      <div className={`w-3 h-3 rounded-full ${
        isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
      }`} />
      
      <div className="flex items-center space-x-2">
        <div className="text-sm text-gray-600 font-medium">Online Players:</div>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
          {playerCount}
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
};

export default PlayerCounter;