/**
 * 灵动button组件
*/
import React, { useState } from 'react';
import './ActiveButton.css';

const ActiveButton = ({type, onLoad, onClick, children, style }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type={type}
      style = {style}
      onClick={onClick}
      onLoad={onLoad}
      className={`gradient-btn ${isHovered ? 'hover-active' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="btn-text">{children}</span>
    </button>
  );
};

export default ActiveButton;
