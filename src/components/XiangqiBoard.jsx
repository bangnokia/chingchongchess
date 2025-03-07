import React from 'react';
import { useXiangqiGame } from '../useXiangqiGame';
import Board from './Board';
import Piece from './Piece';

const XiangqiBoard = () => {
  const {
    pieces,
    draggingPiece,
    selectedPiece,
    turn,
    svgRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handlePieceClick,
    handleBoardClick,
    getPossibleMoves,
  } = useXiangqiGame();

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

  // Get possible moves for the selected piece
  const possibleMoves = selectedPiece
    ? getPossibleMoves(selectedPiece, pieces[selectedPiece].x, pieces[selectedPiece].y)
    : (draggingPiece
      ? getPossibleMoves(draggingPiece, pieces[draggingPiece].x, pieces[draggingPiece].y)
      : []);

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '18px' }}>
        Current Turn: {turn === 'red' ? 'Red' : 'Black'}
      </div>
      <svg
        ref={svgRef}
        width={450}
        height={500}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Board
          possibleMoves={possibleMoves}
          onBoardClick={handleBoardClick}
        />
        {Object.entries(pieces).map(([piece, pos]) => pos && (
          <Piece
            key={piece}
            piece={piece}
            pos={pos}
            isDragging={draggingPiece === piece}
            isSelected={selectedPiece === piece}
            onMouseDown={handleMouseDown}
            onClick={() => handlePieceClick(piece)}
            symbol={pieceSymbols[piece]}
          />
        ))}
      </svg>
    </div>
  );
};

export default XiangqiBoard;