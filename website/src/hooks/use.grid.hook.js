import React, { createContext, useContext, useCallback, useState } from 'react';
import { useWebSocket } from './use.web.socket.hook';
import { usePlayer } from './use.player.hook';
import { COOLDOWN_DURATION } from '../utils/constants';
import CharacterPicker from '../utils/character.picker'

const GridContext = createContext();

export const useGrid = () => {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error('useGrid must be used within a GridProvider');
  }
  return context;
};

export const GridProvider = ({ children }) => {
  const { gridState, updateCell, sessionId, roomId } = useWebSocket();
  const { canUpdate, startCooldown, isLoading } = usePlayer();
  const [selectedCell, setSelectedCell] = useState(null);
  const [showCharacterPicker, setShowCharacterPicker] = useState(false);

  const handleCellClick = useCallback((x, y, currentChar, canUpdateCell) => {
    if (!sessionId) return;
    
    if (canUpdateCell === false) {
      return false; 
    }

    setSelectedCell({ x, y, currentChar });
    setShowCharacterPicker(true);
    return true;
  }, [sessionId]);

  const handleCharacterSelect = useCallback((char) => {
    if (!selectedCell) return false;
    
    if (!canUpdate || isLoading) {
      console.log('[Grid] Cannot update - canUpdate:', canUpdate, 'isLoading:', isLoading);
      return false;
    }

    console.log('[Grid] Submitting character:', char, 'at cell:', selectedCell.x, selectedCell.y);
    
    updateCell(selectedCell.x, selectedCell.y, char);
    
    console.log('[Grid] Starting optimistic cooldown:', COOLDOWN_DURATION, 'ms');
    startCooldown(COOLDOWN_DURATION);
    
    setShowCharacterPicker(false);
    setSelectedCell(null);
    return true;
  }, [selectedCell, updateCell, canUpdate, isLoading, startCooldown]);

  const handleClosePicker = useCallback(() => {
    setShowCharacterPicker(false);
    setSelectedCell(null);
  }, []);

  const getCell = useCallback((x, y) => {
    if (!gridState?.cells) return null;
    return gridState.cells[x]?.[y] || null;
  }, [gridState]);

  const value = {
    grid: gridState,
    cells: gridState?.cells || [],
    handleCellClick,
    getCell,
    selectedCell,
    showCharacterPicker,
    handleCharacterSelect,
    handleClosePicker,
    sessionId,
    roomId,
    canUpdate,
    isLoading
  };

  return (
    <GridContext.Provider value={value}>
      {children}
      {showCharacterPicker && <CharacterPicker />}
    </GridContext.Provider>
  );
};