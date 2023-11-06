import React, { useState } from 'react';

const AlertPopup = () => {
  const [isOpen, setIsOpen] = useState(true);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        onClick={togglePopup}
      >
        Open Popup
      </button>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-1/2 bg-white p-4 border-b border-blue-500">
          <div className="text-center text-blue-500 text-xl mb-4">Popup Content</div>
          <button
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            onClick={togglePopup}
          >
            Close Popup
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertPopup;
