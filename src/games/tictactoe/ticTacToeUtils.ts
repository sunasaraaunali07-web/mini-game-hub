import type { BoardState, Player, TicTacToeResult } from '../../types';

/**
 * Pure utility functions for Tic-Tac-Toe.
 * 
 * Placing logic in a dedicated file separate from React components makes it:
 * 1. Simple to read without JSX distraction
 * 2. 100% testable with unit tests
 * 3. Easy for a beginner to modify rules or understand algorithms
 */

/**
 * All 8 possible winning line configurations on a 3x3 board:
 * 3 horizontal rows, 3 vertical columns, 2 diagonals
 */
export const WINNING_COMBINATIONS: readonly [number, number, number][] = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Creates a fresh empty board of 9 null cells.
 */
export function createEmptyBoard(): BoardState {
  return Array(9).fill(null);
}

/**
 * Checks whether either player has won or if the game ended in a draw.
 * 
 * @param board Current 9-cell board state
 * @returns TicTacToeResult with winner ('X' | 'O' | 'Draw') and winning cell indices, or null if game is ongoing
 */
export function checkGameResult(board: BoardState): TicTacToeResult | null {
  // 1. Check all winning lines
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    const cellA = board[a];
    const cellB = board[b];
    const cellC = board[c];

    if (cellA !== null && cellA === cellB && cellA === cellC) {
      return {
        winner: cellA as Player,
        winningLine: [a, b, c],
      };
    }
  }

  // 2. If no winner, check if board is completely filled (Draw)
  const isFull = board.every((cell) => cell !== null);
  if (isFull) {
    return {
      winner: 'Draw',
      winningLine: null,
    };
  }

  // 3. Otherwise, game is still in progress
  return null;
}
