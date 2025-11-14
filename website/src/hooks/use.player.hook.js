import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useWebSocket } from './use.web.socket.hook';
import { apiService } from '../services/api.service';

const PlayerContext = createContext();

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  const { sessionId, updates, cooldownStatus } = useWebSocket();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [cooldownEnd, setCooldownEnd] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const lastProcessedUpdateRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const hasInitializedRef = useRef(false);
  const lastCooldownStartRef = useRef(0);

  const resetCooldownState = useCallback(() => {
    setHasSubmitted(false);
    setCooldownEnd(null);
    setTimeRemaining(0);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const startCooldown = useCallback((durationMs, source = 'unknown') => {
    const now = Date.now();
    if (now - lastCooldownStartRef.current < 1000) {
      return;
    }
    
    lastCooldownStartRef.current = now;
    
    if (!durationMs || durationMs <= 0) {
      resetCooldownState();
      return;
    }

    const endTime = new Date(now + durationMs);
    const timeRemainingSeconds = Math.ceil(durationMs / 1000);
    
    setHasSubmitted(true);
    setCooldownEnd(endTime);
    setTimeRemaining(timeRemainingSeconds);
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    timerIntervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const remaining = endTime.getTime() - currentTime;
      
      if (remaining <= 0) {
        resetCooldownState();
      } else {
        setTimeRemaining(Math.ceil(remaining / 1000));
      }
    }, 1000);
    
  }, [resetCooldownState]);

  const syncCooldownFromBackend = useCallback(async () => {
    if (!sessionId) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiService.getSessionStatus(sessionId);
      
      if (response.success) {
        const { canUpdate, timeRemaining: backendTimeRemaining } = response.data.canUpdate;
        
        if (!canUpdate && backendTimeRemaining > 0) {
          const durationMs = backendTimeRemaining < 1000 ? backendTimeRemaining * 1000 : backendTimeRemaining;
          console.log('⏳ Player Backend has active cooldown:', durationMs, 'ms');
          startCooldown(durationMs, 'backend-sync');
        } else {
          resetCooldownState();
        }
      } else {
        resetCooldownState();
      }
    } catch (error) {
      resetCooldownState();
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, startCooldown, resetCooldownState]);

  useEffect(() => {
    if (sessionId && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      syncCooldownFromBackend();
    } else if (!sessionId) {
      hasInitializedRef.current = false;
      resetCooldownState();
      setIsLoading(false);
    }
  }, [sessionId, syncCooldownFromBackend, resetCooldownState]);

  useEffect(() => {
    if (!sessionId || !cooldownStatus || hasInitializedRef.current === false) return;

    if (!cooldownStatus.canUpdate && cooldownStatus.timeRemaining > 0) {
      const durationMs = cooldownStatus.timeRemaining < 1000 
        ? cooldownStatus.timeRemaining * 1000 
        : cooldownStatus.timeRemaining;
      
      if (!hasSubmitted || timeRemaining <= 5) { 
        startCooldown(durationMs, 'websocket');
      } else {
      }
    } else if (cooldownStatus.canUpdate && hasSubmitted) {
      console.log('Player WebSocket indicates can update, but keeping state for consistency');
      
    }
  }, [sessionId, cooldownStatus, startCooldown, hasSubmitted, timeRemaining]);

  useEffect(() => {
    if (!sessionId || !updates?.length) return;

    const playerUpdate = updates.find(update => update.sessionId === sessionId);
    if (!playerUpdate) return;
    
    const updateId = `${playerUpdate.x}_${playerUpdate.y}_${playerUpdate.char}_${playerUpdate.timestamp || Date.now()}`;
    
    if (lastProcessedUpdateRef.current === updateId) {
      return;
    }

    lastProcessedUpdateRef.current = updateId;
    
    setTimeout(() => {
      syncCooldownFromBackend();
    }, 500);
    
  }, [sessionId, updates, syncCooldownFromBackend]);

  useEffect(() => {
    if (!hasSubmitted || !sessionId) return;

    const syncInterval = setInterval(() => {
      syncCooldownFromBackend();
    }, 30000);

    return () => clearInterval(syncInterval);
  }, [hasSubmitted, sessionId, syncCooldownFromBackend]);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const canUpdate = !hasSubmitted || timeRemaining <= 0;

  const value = {
    sessionId,
    hasSubmitted,
    cooldownEnd,
    timeRemaining,
    canUpdate,
    isLoading,
    startCooldown,
    syncCooldownFromBackend
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};