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
    const timeRemainingSeconds = Math.ceil(durationMs / 1000);
    
    setCooldownEnd(endTime);
    setTimeRemaining(timeRemainingSeconds);
    
  }, [resetCooldownState]);

  const syncCooldownFromBackend = useCallback(async (preserveOptimistic = false) => {
    if (!sessionId) {
      setIsLoading(false);
      return;
    }


    try {
      const response = await apiService.getSessionStatus(sessionId);
      
      if (response.success) {
        const { canUpdate, timeRemaining: backendTimeRemaining } = response.data.canUpdate;
        
        if (!canUpdate && backendTimeRemaining) {
          const durationMs = typeof backendTimeRemaining === 'number' && backendTimeRemaining < 1000
            ? backendTimeRemaining * 1000
            : backendTimeRemaining;
          console.log('Player Updating to backend cooldown:', durationMs, 'ms');
          startCooldown(durationMs);
        } else if (canUpdate) {
          if (preserveOptimistic && hasSubmitted && cooldownEnd) {
            const optimisticRemaining = cooldownEnd.getTime() - Date.now();
            if (optimisticRemaining > 0) {
              setTimeout(() => {
                syncCooldownFromBackend(false);
              }, 300);
              return;
            }
          }
          if (!preserveOptimistic || !hasSubmitted) {
            resetCooldownState();
          } else {
            console.log('Player Keeping optimistic cooldown (preserveOptimistic && hasSubmitted)');
          }
        }
      }
    } catch (error) {
      console.error('Player Failed to sync cooldown from backend:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, startCooldown, resetCooldownState, hasSubmitted, cooldownEnd]);

  useEffect(() => {
    if (sessionId) {
      syncCooldownFromBackend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]); 

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
    if (!playerUpdate) {
      return;
    }
    const updateId = `${playerUpdate.x}_${playerUpdate.y}_${playerUpdate.char}_${playerUpdate.sessionId}`;
    
    if (lastProcessedUpdateRef.current === updateId) {
      return;
    }

    console.log('Player Update received for our session:', playerUpdate);
    lastProcessedUpdateRef.current = updateId;
    const timeoutId = setTimeout(() => {
      syncCooldownFromBackend(true);
    }, 500); 
    
    return () => clearTimeout(timeoutId);
  }, [sessionId, updates, syncCooldownFromBackend]);

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
    } else if (cooldownStatus.canUpdate) {
      if (hasSubmitted && cooldownEnd) {
        const optimisticRemaining = cooldownEnd.getTime() - Date.now();
        if (optimisticRemaining > 0) {
          return;
        } else {
          resetCooldownState();
        }
      } else if (!hasSubmitted) {
        console.log('Player Backend says canUpdate and no active cooldown - state is correct');
      }
    }
  }, [sessionId, cooldownStatus, startCooldown, resetCooldownState, hasSubmitted, cooldownEnd]);

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