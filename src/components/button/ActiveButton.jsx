/**
 * 灵动button组件
*/
import React, { useState } from 'react';
import './ActiveButton.css';

const ActiveButton = ({onClick, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      className={`gradient-btn ${isHovered ? 'hover-active' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="btn-text">{children}</span>
    </button>
  );
};

export default ActiveButton;
