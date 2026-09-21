import React, { useState } from 'react';
import type { BoardState, Player, TicTacToeScores } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ScoreBoard } from '../../components/ScoreBoard';
import { checkGameResult, createEmptyBoard } from './ticTacToeUtils';
import './TicTacToe.css';

interface TicTacToeGameProps {
  onBackToHub: () => void;
}

export const TicTacToeGame: React.FC<TicTacToeGameProps> = ({ onBackToHub }) => {
  // 1. Game State
  const [board, setBoard] = useState<BoardState>(createEmptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');

  // 2. Persistent Scores (stored in localStorage)
  const [scores, setScores] = useLocalStorage<TicTacToeScores>('mini_game_hub_tictactoe_scores', {
    xWins: 0,
    oWins: 0,
    draws: 0,
  });

  // 3. Compute Game Result (Winner or Draw)
  const gameResult = checkGameResult(board);
  const isGameOver = gameResult !== null;

  // 4. Handle Cell Clicks
  const handleCellClick = (index: number) => {
    // Ignore click if cell is already taken or if game is already over
    if (board[index] !== null || isGameOver) {
      return;
    }

    // Clone the board array and record the current player's move
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    // Check if this move wins the game or results in a draw
    const resultAfterMove = checkGameResult(newBoard);

    if (resultAfterMove) {
      // Update scores accordingly
      if (resultAfterMove.winner === 'X') {
        setScores((prev) => ({ ...prev, xWins: prev.xWins + 1 }));
      } else if (resultAfterMove.winner === 'O') {
        setScores((prev) => ({ ...prev, oWins: prev.oWins + 1 }));
      } else if (resultAfterMove.winner === 'Draw') {
        setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      }
    } else {
      // Switch turns between X and O
      setCurrentPlayer((prev) => (prev === 'X' ? 'O' : 'X'));
    }
  };

  // 5. Start a New Game (clears board, resets to Player X, keeps scores)
  const handleNewGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('X');
  };

  // 6. Reset Scores back to 0
  const handleResetScores = () => {
    setScores({ xWins: 0, oWins: 0, draws: 0 });
  };

  // Build status banner text and CSS class
  let statusText = `Player ${currentPlayer}'s Turn`;
  let statusClass = currentPlayer === 'X' ? 'status-turn-x' : 'status-turn-o';

  if (gameResult) {
    if (gameResult.winner === 'Draw') {
      statusText = "It's a Draw! 🤝";
      statusClass = 'status-draw';
    } else {
      statusText = `🎉 Player ${gameResult.winner} Wins!`;
      statusClass = 'status-win';
    }
  }

  return (
    <div className="tictactoe-container animate-fade-in">
      {/* ScoreBoard */}
      <ScoreBoard
        title="Tic-Tac-Toe Scores"
        scores={[
          { label: 'Player X', value: scores.xWins, highlight: currentPlayer === 'X' && !isGameOver },
          { label: 'Draws', value: scores.draws },
          { label: 'Player O', value: scores.oWins, highlight: currentPlayer === 'O' && !isGameOver },
        ]}
        onReset={handleResetScores}
      />

      {/* Status Banner */}
      <div className={`game-status-banner ${statusClass}`} role="status" aria-live="polite">
        <span>{statusText}</span>
      </div>

      {/* 3x3 Grid Board */}
      <div className="ttt-board" role="grid" aria-label="Tic-Tac-Toe Board">
        {board.map((cellValue, index) => {
          const isWinningCell = gameResult?.winningLine?.includes(index) ?? false;

          return (
            <button
              key={index}
              className={`ttt-cell ${isWinningCell ? 'cell-winning' : ''}`}
              onClick={() => handleCellClick(index)}
              disabled={cellValue !== null || isGameOver}
              aria-label={
                cellValue
                  ? `Cell ${index + 1}: Player ${cellValue}`
                  : `Cell ${index + 1}: Empty, click to place ${currentPlayer}`
              }
            >
              {cellValue && (
                <span className={cellValue === 'X' ? 'symbol-x' : 'symbol-o'}>
                  {cellValue}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Controls: New Game & Return */}
      <div className="ttt-controls">
        <button className="btn btn-primary" onClick={handleNewGame}>
          {isGameOver ? 'Play Again 🔄' : 'New Game 🔄'}
        </button>
        <button className="btn btn-secondary" onClick={onBackToHub}>
          Back to Hub 🏠
        </button>
      </div>
    </div>
  );
};
