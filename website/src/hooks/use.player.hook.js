import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWebSocket } from './use.web.socket.hook';

const PlayerContext = createContext();

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  const { sessionId, updates } = useWebSocket();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [cooldownEnd, setCooldownEnd] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Check if player has submitted in this session
  useEffect(() => {
    if (!sessionId || !updates) return;

    const playerUpdate = updates.find(update => update.sessionId === sessionId);
    if (playerUpdate) {
      setHasSubmitted(true);
      // Set cooldown end time (1 minute from now)
      const endTime = new Date(Date.now() + 60000);
      setCooldownEnd(endTime);
    }
  }, [sessionId, updates]);

  // Countdown timer for cooldown
  useEffect(() => {
    if (!cooldownEnd) return;

    const interval = setInterval(() => {
      const now = new Date();
      const remaining = cooldownEnd - now;

      if (remaining <= 0) {
        setHasSubmitted(false);
        setCooldownEnd(null);
        setTimeRemaining(0);
        clearInterval(interval);
      } else {
        setTimeRemaining(Math.floor(remaining / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownEnd]);

  const canUpdate = !hasSubmitted || timeRemaining <= 0;

  const value = {
    sessionId,
    hasSubmitted,
    cooldownEnd,
    timeRemaining,
    canUpdate
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};