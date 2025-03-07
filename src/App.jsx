import React, { useState, useRef } from 'react';

const XiangqiBoard = () => {
  const boardWidth = 450;
  const boardHeight = 500;
  const cellSize = 50;
  const offsetX = 25;
  const offsetY = 25;
  const svgRef = useRef(null);

  const [pieces, setPieces] = useState({
    'r_king': { x: 4, y: 9 }, 'r_advisor1': { x: 3, y: 9 }, 'r_advisor2': { x: 5, y: 9 },
    'r_elephant1': { x: 2, y: 9 }, 'r_elephant2': { x: 6, y: 9 },
    'r_horse1': { x: 1, y: 9 }, 'r_horse2': { x: 7, y: 9 },
    'r_chariot1': { x: 0, y: 9 }, 'r_chariot2': { x: 8, y: 9 },
    'r_cannon1': { x: 1, y: 7 }, 'r_cannon2': { x: 7, y: 7 },
    'r_pawn1': { x: 0, y: 6 }, 'r_pawn2': { x: 2, y: 6 }, 'r_pawn3': { x: 4, y: 6 },
    'r_pawn4': { x: 6, y: 6 }, 'r_pawn5': { x: 8, y: 6 },
    'b_king': { x: 4, y: 0 }, 'b_advisor1': { x: 3, y: 0 }, 'b_advisor2': { x: 5, y: 0 },
    'b_elephant1': { x: 2, y: 0 }, 'b_elephant2': { x: 6, y: 0 },
    'b_horse1': { x: 1, y: 0 }, 'b_horse2': { x: 7, y: 0 },
    'b_chariot1': { x: 0, y: 0 }, 'b_chariot2': { x: 8, y: 0 },
    'b_cannon1': { x: 1, y: 2 }, 'b_cannon2': { x: 7, y: 2 },
    'b_pawn1': { x: 0, y: 3 }, 'b_pawn2': { x: 2, y: 3 }, 'b_pawn3': { x: 4, y: 3 },
    'b_pawn4': { x: 6, y: 3 }, 'b_pawn5': { x: 8, y: 3 },
  });

  const pieceSymbols = {
    'r_king': '帥', 'b_king': '將',
    'r_advisor1': '仕', 'r_advisor2': '仕', 'b_advisor1': '士', 'b_advisor2': '士',
    'r_elephant1': '相', 'r_elephant2': '相', 'b_elephant1': '象', 'b_elephant2': '象',
    'r_horse1': '馬', 'r_horse2': '馬', 'b_horse1': '馬', 'b_horse2': '馬',
    'r_chariot1': '車', 'r_chariot2': '車', 'b_chariot1': '車', 'b_chariot2': '車',
    'r_cannon1': '砲', 'r_cannon2': '砲', 'b_cannon1': '炮', 'b_cannon2': '炮',
    'r_pawn1': '兵', 'r_pawn2': '兵', 'r_pawn3': '兵', 'r_pawn4': '兵', 'r_pawn5': '兵',
    'b_pawn1': '卒', 'b_pawn2': '卒', 'b_pawn3': '卒', 'b_pawn4': '卒', 'b_pawn5': '卒',
  };

  const [draggingPiece, setDraggingPiece] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [turn, setTurn] = useState('red');

  const isValidMove = (piece, fromX, fromY, toX, toY) => {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const isRed = piece.startsWith('r');

    if (toX < 0 || toX > 8 || toY < 0 || toY > 9) return false;

    if (piece.includes('king')) {
      return (Math.abs(dx) === 1 && dy === 0) || (Math.abs(dy) === 1 && dx === 0) &&
        toX >= 3 && toX <= 5 && (isRed ? toY >= 7 : toY <= 2);
    }
    if (piece.includes('advisor')) {
      return Math.abs(dx) === 1 && Math.abs(dy) === 1 &&
        toX >= 3 && toX <= 5 && (isRed ? toY >= 7 : toY <= 2);
    }
    if (piece.includes('elephant')) {
      if (Math.abs(dx) !== 2 || Math.abs(dy) !== 2) return false;
      const midX = fromX + dx/2, midY = fromY + dy/2;
      if (Object.values(pieces).some(p => p.x === midX && p.y === midY)) return false;
      return isRed ? toY >= 5 : toY <= 4;
    }
    if (piece.includes('horse')) {
      if ((Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2)) {
        const blockX = Math.abs(dx) === 2 ? fromX + dx/2 : fromX;
        const blockY = Math.abs(dy) === 2 ? fromY + dy/2 : fromY;
        return !Object.values(pieces).some(p => p.x === blockX && p.y === blockY);
      }
      return false;
    }
    if (piece.includes('chariot')) {
      if (dx !== 0 && dy !== 0) return false;
      const steps = Math.max(Math.abs(dx), Math.abs(dy));
      const stepX = dx/steps, stepY = dy/steps;
      for (let i = 1; i < steps; i++) {
        if (Object.values(pieces).some(p => p.x === fromX + i*stepX && p.y === fromY + i*stepY)) return false;
      }
      return true;
    }
    if (piece.includes('cannon')) {
      if (dx !== 0 && dy !== 0) return false;
      const steps = Math.max(Math.abs(dx), Math.abs(dy));
      const stepX = dx/steps || 0, stepY = dy/steps || 0;
      const piecesBetween = Object.values(pieces).filter(p => {
        if (dx !== 0) return p.y === fromY && p.x > Math.min(fromX, toX) && p.x < Math.max(fromX, toX);
        return p.x === fromX && p.y > Math.min(fromY, toY) && p.y < Math.max(fromY, toY);
      }).length;
      const targetPiece = Object.values(pieces).find(p => p.x === toX && p.y === toY);
      return (targetPiece && piecesBetween === 1) || (!targetPiece && piecesBetween === 0);
    }
    if (piece.includes('pawn')) {
      if (isRed) {
        if (fromY <= 4) return (dy === -1 && dx === 0) || (dy === 0 && Math.abs(dx) === 1);
        return dy === -1 && dx === 0;
      } else {
        if (fromY >= 5) return (dy === 1 && dx === 0) || (dy === 0 && Math.abs(dx) === 1);
        return dy === 1 && dx === 0;
      }
    }
    return false;
  };

  const getPossibleMoves = (piece, fromX, fromY) => {
    const moves = [];
    for (let x = 0; x <= 8; x++) {
      for (let y = 0; y <= 9; y++) {
        if (isValidMove(piece, fromX, fromY, x, y)) {
          const targetPiece = Object.keys(pieces).find(p =>
            pieces[p].x === x && pieces[p].y === y && p !== piece
          );
          if (!targetPiece || targetPiece[0] !== piece[0]) {
            moves.push({ x, y });
          }
        }
      }
    }
    return moves;
  };

  const handleMouseDown = (e, piece) => {
    if (piece[0] !== turn[0]) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDraggingPiece(piece);
    setDragOffset({
      x: x - (offsetX + pieces[piece].x * cellSize),
      y: y - (offsetY + pieces[piece].y * cellSize)
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingPiece) return;
    e.preventDefault();
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;
    setPieces(prev => ({
      ...prev,
      [draggingPiece]: { x: (x - offsetX) / cellSize, y: (y - offsetY) / cellSize }
    }));
  };

  const handleMouseUp = (e) => {
    if (!draggingPiece) return;
    const rect = svgRef.current.getBoundingClientRect();
    const toX = Math.round((e.clientX - rect.left - offsetX) / cellSize);
    const toY = Math.round((e.clientY - rect.top - offsetY) / cellSize);
    const fromPos = pieces[draggingPiece];

    if (isValidMove(draggingPiece, fromPos.x, fromPos.y, toX, toY)) {
      const targetPiece = Object.keys(pieces).find(p =>
        pieces[p].x === toX && pieces[p].y === toY && p !== draggingPiece
      );
      if (!targetPiece || targetPiece[0] !== draggingPiece[0]) {
        setPieces(prev => ({
          ...prev,
          [draggingPiece]: { x: toX, y: toY },
          ...(targetPiece && { [targetPiece]: undefined })
        }));
        setTurn(turn === 'red' ? 'black' : 'red');
      } else {
        setPieces(prev => ({ ...prev, [draggingPiece]: { x: fromPos.x, y: fromPos.y } }));
      }
    } else {
      setPieces(prev => ({ ...prev, [draggingPiece]: { x: fromPos.x, y: fromPos.y } }));
    }
    setDraggingPiece(null);
  };

  const possibleMoves = draggingPiece ? getPossibleMoves(draggingPiece, pieces[draggingPiece].x, pieces[draggingPiece].y) : [];

  return (
    <svg
      ref={svgRef}
      width={boardWidth}
      height={boardHeight}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
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
          fill="green"
          opacity="0.3"
        />
      ))}
      {Object.entries(pieces).map(([piece, pos]) => pos && (
        <g
          key={piece}
          onMouseDown={(e) => handleMouseDown(e, piece)}
          style={{ cursor: piece[0] === turn[0] ? 'pointer' : 'default' }}
        >
          <circle
            cx={offsetX + pos.x * cellSize}
            cy={offsetY + pos.y * cellSize}
            r="20"
            fill={piece.startsWith('r') ? 'red' : 'black'}
            opacity={draggingPiece === piece ? "1" : "0.8"}
            stroke={draggingPiece === piece ? "yellow" : "none"}
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
      ))}
    </svg>
  );
};

export default XiangqiBoard;