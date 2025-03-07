import { useState, useRef } from 'react';

export const useXiangqiGame = () => {
  const initialPieces = {
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
  };

  const [pieces, setPieces] = useState(initialPieces);
  const [draggingPiece, setDraggingPiece] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [turn, setTurn] = useState('red');
  const svgRef = useRef(null);

  const isValidMove = (piece, fromX, fromY, toX, toY) => {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const isRed = piece.startsWith('r');

    if (toX < 0 || toX > 8 || toY < 0 || toY > 9) return false;

    if (piece.includes('king')) {
      return (Math.abs(dx) === 1 && dy === 0) || (Math.abs(dy) === 1 && dx === 0) &&
        toX >= 3 && toX <= 5 && (isRed ? toY >= 7 : toY <= 2);
    }
    // ... (rest of the isValidMove logic remains the same)
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
      x: x - (25 + pieces[piece].x * 50),
      y: y - (25 + pieces[piece].y * 50)
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
      [draggingPiece]: { x: (x - 25) / 50, y: (y - 25) / 50 }
    }));
  };

  const handleMouseUp = (e) => {
    if (!draggingPiece) return;
    const rect = svgRef.current.getBoundingClientRect();
    const toX = Math.round((e.clientX - rect.left - 25) / 50);
    const toY = Math.round((e.clientY - rect.top - 25) / 50);
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

  return {
    pieces,
    draggingPiece,
    turn,
    svgRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    getPossibleMoves,
  };
};