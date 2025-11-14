import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useWebSocket } from './use.web.socket.hook';
import { apiService } from '../services/api.service';
import { COOLDOWN_DURATION } from '../utils/constants';

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

  const resetCooldownState = useCallback(() => {
    setHasSubmitted(false);
    setCooldownEnd(null);
    setTimeRemaining(0);
  }, []);

  const startCooldown = useCallback((durationMs) => {
    if (!durationMs || durationMs <= 0) {
      resetCooldownState();
      return;
    }

    setHasSubmitted(true);
    const endTime = new Date(Date.now() + durationMs);
    setCooldownEnd(endTime);
    setTimeRemaining(Math.ceil(durationMs / 1000));
  }, [resetCooldownState]);

  useEffect(() => {
    const syncCooldownFromBackend = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiService.getSessionStatus(sessionId);
        
        if (response.success) {
          const { canUpdate, timeRemaining: backendTimeRemaining } = response.data.canUpdate;
          
          if (!canUpdate && backendTimeRemaining) {
            startCooldown(backendTimeRemaining);
          } else {
            resetCooldownState();
          }
        }
      } catch (error) {
        console.error('Failed to sync cooldown from backend:', error);
      } finally {
        setIsLoading(false);
      }
    };

    syncCooldownFromBackend();
  }, [sessionId, startCooldown, resetCooldownState]);

  useEffect(() => {
    lastProcessedUpdateRef.current = null;
  }, [sessionId]);


  useEffect(() => {
    if (!cooldownEnd) return;

    const interval = setInterval(() => {
      const now = new Date();
      const remaining = cooldownEnd - now;

      if (remaining <= 0) {
        resetCooldownState();
        clearInterval(interval);
      } else {
        setTimeRemaining(Math.floor(remaining / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownEnd, resetCooldownState]);

  useEffect(() => {
    if (!sessionId || !updates?.length) return;

    const playerUpdate = updates.find(update => update.sessionId === sessionId);
    if (!playerUpdate || lastProcessedUpdateRef.current === playerUpdate) {
      return;
    }

    lastProcessedUpdateRef.current = playerUpdate;
    
    startCooldown(COOLDOWN_DURATION);
  }, [sessionId, updates, startCooldown]);

  useEffect(() => {
    if (!sessionId || !cooldownStatus) return;

    if (!cooldownStatus.canUpdate) {
      const remainingMs = typeof cooldownStatus.timeRemaining === 'number'
        ? cooldownStatus.timeRemaining
        : cooldownStatus.cooldownEnd
          ? new Date(cooldownStatus.cooldownEnd).getTime() - Date.now()
          : null;

      if (remainingMs && remainingMs > 0) {
        startCooldown(remainingMs);
      }
    } else if (hasSubmitted) {
      resetCooldownState();
    }
  }, [sessionId, cooldownStatus, startCooldown, resetCooldownState, hasSubmitted]);

  const canUpdate = !hasSubmitted || timeRemaining <= 0;

  const value = {
    sessionId,
    hasSubmitted,
    cooldownEnd,
    timeRemaining,
    canUpdate,
    isLoading
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};