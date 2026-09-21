import { describe, it, expect } from 'vitest';
import { checkGameResult, createEmptyBoard } from './ticTacToeUtils';
import type { BoardState } from '../../types';

describe('ticTacToeUtils', () => {
  it('should initialize an empty board with 9 null values', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(9);
    expect(board.every((c) => c === null)).toBe(true);
  });

  it('should detect horizontal win for X', () => {
    const board: BoardState = [
      'X', 'X', 'X',
      'O', 'O', null,
      null, null, null
    ];
    const result = checkGameResult(board);
    expect(result).toEqual({
      winner: 'X',
      winningLine: [0, 1, 2]
    });
  });

  it('should detect vertical win for O', () => {
    const board: BoardState = [
      'O', 'X', null,
      'O', 'X', null,
      'O', null, 'X'
    ];
    const result = checkGameResult(board);
    expect(result).toEqual({
      winner: 'O',
      winningLine: [0, 3, 6]
    });
  });

  it('should detect diagonal win for X', () => {
    const board: BoardState = [
      'X', 'O', 'O',
      null, 'X', null,
      null, null, 'X'
    ];
    const result = checkGameResult(board);
    expect(result).toEqual({
      winner: 'X',
      winningLine: [0, 4, 8]
    });
  });

  it('should detect anti-diagonal win for O', () => {
    const board: BoardState = [
      'X', null, 'O',
      null, 'O', 'X',
      'O', null, null
    ];
    const result = checkGameResult(board);
    expect(result).toEqual({
      winner: 'O',
      winningLine: [2, 4, 6]
    });
  });

  it('should detect a draw when board is full with no 3-in-a-row', () => {
    const board: BoardState = [
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X'
    ];
    const result = checkGameResult(board);
    expect(result).toEqual({
      winner: 'Draw',
      winningLine: null
    });
  });

  it('should return null when game is ongoing and not full', () => {
    const board: BoardState = [
      'X', 'O', null,
      null, 'X', null,
      null, null, 'O'
    ];
    const result = checkGameResult(board);
    expect(result).toBeNull();
  });
});
