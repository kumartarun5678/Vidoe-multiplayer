import React, { useState } from 'react';
import { useGrid } from '../hooks/use.grid.hook';

const CharacterPicker = () => {
  const { selectedCell, handleCharacterSelect, handleClosePicker } = useGrid();
  const [customChar, setCustomChar] = useState('');

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customChar && customChar.length === 1) {
      handleCharacterSelect(customChar);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClosePicker();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Select a Character</h2>
            <button
              onClick={handleClosePicker}
              className="text-white hover:text-gray-200 transition-colors text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-blue-100 mt-2">
            Cell ({selectedCell?.x}, {selectedCell?.y})
            {selectedCell?.currentChar && ` - Current: ${selectedCell.currentChar}`}
          </p>
        </div>

        <div className="p-6">
          {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Popular Emojis
          </h3>
          <div className="grid grid-cols-8 gap-2 mb-6">
            {popularEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {emoji}
              </button>
            ))}
          </div> */}

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Custom Character
            </h3>
            <form onSubmit={handleCustomSubmit} className="flex gap-2">
              <input
                type="text"
                value={customChar}
                onChange={(e) => setCustomChar(e.target.value)}
                placeholder="Enter any Unicode character..."
                maxLength={1}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!customChar}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Use
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-2">
              Enter any single Unicode character (emojis, letters, symbols)
            </p>
          </div>
          {customChar && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <div className="text-4xl text-center bg-white p-4 rounded border">
                {customChar}
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Click outside to cancel</span>
            <button
              onClick={handleClosePicker}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterPicker;