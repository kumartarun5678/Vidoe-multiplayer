import React from 'react';

const HistoryControls = () => {
  
  return (
    <div className="flex space-x-2 mb-4">
      <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
        Previous
      </button>
      <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
        Next
      </button>
      <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
        Play
      </button>
    </div>
  );
};

export default HistoryControls;