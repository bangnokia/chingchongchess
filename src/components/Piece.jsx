import React from 'react';

const Piece = ({ piece, pos, isDragging, isSelected, onMouseDown, onClick, symbol }) => {
  const isRed = piece.startsWith('r');

  return (
    <g
      transform={`translate(${25 + pos.x * 50}, ${25 + pos.y * 50})`}
      style={{ cursor: 'pointer' }}
      onMouseDown={(e) => onMouseDown(e, piece)}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <circle
        r={20}
        fill={isRed ? '#f44336' : '#000'}
        stroke={isSelected ? '#4CAF50' : '#333'}
        strokeWidth={isSelected ? 3 : 1}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={24}
        fill={isRed ? '#fff' : '#f0c48a'}
        style={{ pointerEvents: 'none' }}
      >
        {symbol}
      </text>
    </g>
  );
};

export default Piece;