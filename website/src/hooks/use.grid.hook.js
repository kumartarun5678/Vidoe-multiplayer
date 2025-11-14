import React, { createContext, useContext, useCallback, useState } from 'react';
import { useWebSocket } from './use.web.socket.hook';
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
  const { gridState, updateCell, sessionId } = useWebSocket();
  const [selectedCell, setSelectedCell] = useState(null);
  const [showCharacterPicker, setShowCharacterPicker] = useState(false);

  const handleCellClick = useCallback((x, y, currentChar) => {
    if (!sessionId) return;

    setSelectedCell({ x, y, currentChar });
    setShowCharacterPicker(true);
  }, [sessionId]);

  const handleCharacterSelect = useCallback((char) => {
    if (!selectedCell) return;

    updateCell(selectedCell.x, selectedCell.y, char);
    setShowCharacterPicker(false);
    setSelectedCell(null);
  }, [selectedCell, updateCell]);

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
    sessionId
  };

  return (
    <GridContext.Provider value={value}>
      {children}
      {showCharacterPicker && <CharacterPicker />}
    </GridContext.Provider>
  );
};