/**
 * Central TypeScript types for Mini Game Hub.
 * Keeping types organized in one place makes it easy for a beginner
 * to see the data structures used throughout the app.
 */

// Identifiers for each game screen in the app
export type GameId = 'hub' | 'tictactoe' | 'rockpaperscissors' | 'numberguessing';

// Theme options
export type Theme = 'dark' | 'light';

// ==========================================
// 1. TIC-TAC-TOE TYPES
// ==========================================

export type Player = 'X' | 'O';
export type BoardCell = Player | null;
export type BoardState = BoardCell[]; // 9-element array

export interface TicTacToeResult {
  winner: Player | 'Draw';
  winningLine: number[] | null; // Indexes of the 3 winning cells, e.g. [0, 1, 2]
}

export interface TicTacToeScores {
  xWins: number;
  oWins: number;
  draws: number;
}

// ==========================================
// 2. ROCK PAPER SCISSORS TYPES
// ==========================================

export type RPSMove = 'rock' | 'paper' | 'scissors';
export type RPSOutcome = 'win' | 'lose' | 'draw';

export interface RPSScores {
  playerWins: number;
  computerWins: number;
  draws: number;
}

// ==========================================
// 3. NUMBER GUESSING TYPES
// ==========================================

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  label: string;
  min: number;
  max: number;
  description: string;
}

export type GuessHint = 'higher' | 'lower' | 'correct';

export interface NumberGuessingScores {
  gamesWon: number;
  bestAttempts: Record<Difficulty, number | null>;
}
