import React from 'react';

const Board = ({ cellSize = 50, offsetX = 25, offsetY = 25, possibleMoves }) => {
  const boardWidth = 450;
  const boardHeight = 500;

  return (
    <>
      <rect x="0" y="0" width={boardWidth} height={boardHeight} fill="#f0d9b5" />
      {Array.from({ length: 9 }).map((_, i) => (
        <g key={`v${i}`}>
          <line x1={offsetX + i * cellSize} y1={offsetY} x2={offsetX + i * cellSize} y2={offsetY + 4 * cellSize} stroke="black" strokeWidth="1" />
          <line x1={offsetX + i * cellSize} y1={offsetY + 5 * cellSize} x2={offsetX + i * cellSize} y2={offsetY + 9 * cellSize} stroke="black" strokeWidth="1" />
        </g>
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        i !== 4 && i !== 5 && (
          <line key={`h${i}`} x1={offsetX} y1={offsetY + i * cellSize} x2={offsetX + 8 * cellSize} y2={offsetY + i * cellSize} stroke="black" strokeWidth="1" />
        )
      ))}
      <rect x={offsetX} y={offsetY + 4 * cellSize} width={8 * cellSize} height={cellSize} fill="none" stroke="blue" strokeWidth="2" />
      <text x={offsetX + 4 * cellSize} y={offsetY + 4.5 * cellSize} textAnchor="middle" dominantBaseline="middle" fill="blue">楚河漢界</text>
      <line x1={offsetX + 3 * cellSize} y1={offsetY} x2={offsetX + 5 * cellSize} y2={offsetY + 2 * cellSize} stroke="black" strokeWidth="1" />
      <line x1={offsetX + 5 * cellSize} y1={offsetY} x2={offsetX + 3 * cellSize} y2={offsetY + 2 * cellSize} stroke="black" strokeWidth="1" />
      <line x1={offsetX + 3 * cellSize} y1={offsetY + 7 * cellSize} x2={offsetX + 5 * cellSize} y2={offsetY + 9 * cellSize} stroke="black" strokeWidth="1" />
      <line x1={offsetX + 5 * cellSize} y1={offsetY + 7 * cellSize} x2={offsetX + 3 * cellSize} y2={offsetY + 9 * cellSize} stroke="black" strokeWidth="1" />
      {[{ x: 1, y: 2 }, { x: 7, y: 2 }, { x: 1, y: 7 }, { x: 7, y: 7 }].map((pos, i) => (
        <circle key={`mark${i}`} cx={offsetX + pos.x * cellSize} cy={offsetY + pos.y * cellSize} r="5" fill="gray" opacity="0.5" />
      ))}
      {possibleMoves.map((move, i) => (
        <circle
          key={`move${i}`}
          cx={offsetX + move.x * cellSize}
          cy={offsetY + move.y * cellSize}
          r="10"
          fill="rgba(0, 255, 0, 0.4)"
          stroke="white"
          strokeWidth="1"
        />
      ))}
    </>
  );
};

export default Board;