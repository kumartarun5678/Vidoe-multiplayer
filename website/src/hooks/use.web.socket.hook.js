import React, { createContext, useContext, useEffect, useState } from 'react';
import { socketService } from '../services/socket.service';
import { apiService } from '../services/api.service';
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
  const [cooldownStatus, setCooldownStatus] = useState(null);
  const [roomId, setRoomId] = useState('room-1');

  useEffect(() => {
      const savedSessionId = localStorage.getItem('sessionId');
  
  socketService.connect({
    auth: {
      sessionId: savedSessionId
    }
  });
    socketService.connect();
    const handleConnect = () => {
      setIsConnected(true);
      if (savedSessionId) {
        socketService.emit(SOCKET_EVENTS.CHECK_STATUS, { sessionId: savedSessionId });
      }
    };
    const handleDisconnect = () => {
      setIsConnected(false);
    };
    
    const handleSessionCreated = (data) => {
      setSessionId(data.sessionId);
      setGridState(data.gridState);
      setPlayerCount(data.playerCount);
      setCooldownStatus(data.cooldownStatus || null);
      setRoomId(data.roomId || 'room-1');
      localStorage.setItem('sessionId', data.sessionId);
    };

    const handleGridUpdated = (data) => {
      if (data.data && data.data.gridState) {
        setGridState(data.data.gridState);
      }
      if (data.type === 'cell_update') {
        setUpdates(prev => [data.data, ...prev.slice(0, 49)]);
      }
    };

    const handlePlayerCountUpdate = (data) => {
      setPlayerCount(data.data.count);
    };

    const handleCooldownStatus = (data) => {
      setCooldownStatus(data);
    };

    const handleUpdateSuccess = (data) => {
      if (data.gridState) {
        setGridState(data.gridState);
      }
    };

    const handleUpdateFailed = (data) => {
      console.error('Update failed:', data);
    };

    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);
    socketService.on(SOCKET_EVENTS.SESSION_CREATED, handleSessionCreated);
    socketService.on(SOCKET_EVENTS.GRID_UPDATED, handleGridUpdated);
    socketService.on(SOCKET_EVENTS.PLAYER_COUNT_UPDATE, handlePlayerCountUpdate);
    socketService.on(SOCKET_EVENTS.COOLDOWN_STATUS, handleCooldownStatus);
    socketService.on(SOCKET_EVENTS.UPDATE_SUCCESS, handleUpdateSuccess);
    socketService.on(SOCKET_EVENTS.UPDATE_FAILED, handleUpdateFailed);

    if (savedSessionId) {
      socketService.emit(SOCKET_EVENTS.CHECK_STATUS, { sessionId: savedSessionId });
    }

    return () => {
      socketService.off('connect', handleConnect);
      socketService.off('disconnect', handleDisconnect);
      socketService.off(SOCKET_EVENTS.SESSION_CREATED, handleSessionCreated);
      socketService.off(SOCKET_EVENTS.GRID_UPDATED, handleGridUpdated);
      socketService.off(SOCKET_EVENTS.PLAYER_COUNT_UPDATE, handlePlayerCountUpdate);
      socketService.off(SOCKET_EVENTS.COOLDOWN_STATUS, handleCooldownStatus);
      socketService.off(SOCKET_EVENTS.UPDATE_SUCCESS, handleUpdateSuccess);
      socketService.off(SOCKET_EVENTS.UPDATE_FAILED, handleUpdateFailed);
    };
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    socketService.emit(SOCKET_EVENTS.GET_COOLDOWN_STATUS, { sessionId });
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || !isConnected) return;

    const syncGridState = async () => {
      try {
        const response = await apiService.getGridState();
        if (response && response.success && response.data) {
          const gridData = response.data;
        
          if (gridData.cells && Array.isArray(gridData.cells)) {
            if (!gridState || gridState.totalUpdates !== gridData.totalUpdates) {
              console.log('WebSocket Updating grid state via periodic sync');
              setGridState(gridData);
            }
          }
        }
      } catch (error) {
        console.error('WebSocket Failed to sync grid state:', error);
      }
    };
    const intervalId = setInterval(syncGridState, 15000);
    
    return () => clearInterval(intervalId);
  }, [sessionId, isConnected, gridState]);

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
    cooldownStatus,
    roomId,
    updateCell
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};