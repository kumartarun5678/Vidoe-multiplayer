import React from 'react';
import { useWebSocket } from '../../hooks/use.web.socket.hook';

const HistoryTimeline = () => {
  const { updates } = useWebSocket();

  if (!updates || updates.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No updates yet. Be the first to make a change!
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {updates.map((update, index) => (
        <div
          key={index}
          className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-white transition-colors"
        >
          <div className="flex justify-between items-start mb-1">
            <div className="text-sm font-medium text-gray-700">
              Cell ({update.x}, {update.y})
            </div>
            <div className="text-xs text-gray-500">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-lg">{update.char}</div>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {update.sessionId?.slice(-8)}...
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryTimeline;