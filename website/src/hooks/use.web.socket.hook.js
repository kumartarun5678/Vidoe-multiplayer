import React, { createContext, useContext, useEffect, useState } from 'react';
import { socketService } from '../services/socket.service';
import { SOCKET_EVENTS } from '../utils/constants';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [gridState, setGridState] = useState(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    socketService.connect();
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    
    const handleSessionCreated = (data) => {
      setSessionId(data.sessionId);
      setGridState(data.gridState);
      setPlayerCount(data.playerCount);
      localStorage.setItem('sessionId', data.sessionId);
    };

    const handleGridUpdated = (data) => {
      if (data.data.gridState) {
        setGridState(data.data.gridState);
      }
      if (data.type === 'cell_update') {
        setUpdates(prev => [data.data, ...prev.slice(0, 49)]);
      }
    };

    const handlePlayerCountUpdate = (data) => {
      setPlayerCount(data.data.count);
    };

    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);
    socketService.on(SOCKET_EVENTS.SESSION_CREATED, handleSessionCreated);
    socketService.on(SOCKET_EVENTS.GRID_UPDATED, handleGridUpdated);
    socketService.on(SOCKET_EVENTS.PLAYER_COUNT_UPDATE, handlePlayerCountUpdate);

    const savedSessionId = localStorage.getItem('sessionId');
    if (savedSessionId) {
      socketService.emit(SOCKET_EVENTS.CHECK_STATUS, { sessionId: savedSessionId });
    }

    return () => {
      socketService.off('connect', handleConnect);
      socketService.off('disconnect', handleDisconnect);
      socketService.off(SOCKET_EVENTS.SESSION_CREATED, handleSessionCreated);
      socketService.off(SOCKET_EVENTS.GRID_UPDATED, handleGridUpdated);
      socketService.off(SOCKET_EVENTS.PLAYER_COUNT_UPDATE, handlePlayerCountUpdate);
    };
  }, []);

  const updateCell = (x, y, char) => {
    if (!sessionId) return;

    socketService.emit(SOCKET_EVENTS.CELL_UPDATE, {
      x, y, char, sessionId
    });
  };

  const value = {
    isConnected,
    sessionId,
    gridState,
    playerCount,
    updates,
    updateCell
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};