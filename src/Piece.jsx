import React from 'react';

function Piece({ piece, pos, onMouseDown, isDragging, isTurn, pieceSymbols, offsetX, offsetY, cellSize }) {
  return (
    <g onMouseDown={onMouseDown} style={{ cursor: isTurn ? 'pointer' : 'default' }}>
      <circle
        cx={offsetX + pos.x * cellSize}
        cy={offsetY + pos.y * cellSize}
        r="20"
        fill={piece.startsWith('r') ? 'red' : 'black'}
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
        {pieceSymbols[piece]}
      </text>
    </g>
  );
}

export default Piece;
