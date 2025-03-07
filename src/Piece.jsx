import React from 'react';

const Piece = ({ piece, pos, isDragging, onMouseDown, symbol, cellSize = 50, offsetX = 25, offsetY = 25 }) => {
  const isRed = piece.startsWith('r');
  return (
    <g
      onMouseDown={(e) => onMouseDown(e, piece)}
      style={{ cursor: piece[0] === 'r' || piece[0] === 'b' ? 'pointer' : 'default' }}
    >
      <circle
        cx={offsetX + pos.x * cellSize}
        cy={offsetY + pos.y * cellSize}
        r="20"
        fill={isRed ? 'red' : 'black'}
        opacity={isDragging ? "1" : "0.8"}
        stroke={isDragging ? "yellow" : "none"}
        strokeWidth="2"
      />
      <text
        x={offsetX + pos.x * cellSize}
        y={offsetY + pos.y * cellSize}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="20"
      >
        {symbol}
      </text>
    </g>
  );
};

export default Piece;