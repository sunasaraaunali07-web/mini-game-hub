import type { RPSMove, RPSOutcome } from '../../types';

/**
 * Pure helper functions and constants for Rock Paper Scissors.
 */

export interface MoveInfo {
  id: RPSMove;
  name: string;
  emoji: string;
  beats: RPSMove;
}

export const MOVES: Record<RPSMove, MoveInfo> = {
  rock: {
    id: 'rock',
    name: 'Rock',
    emoji: '✊',
    beats: 'scissors',
  },
  paper: {
    id: 'paper',
    name: 'Paper',
    emoji: '✋',
    beats: 'rock',
  },
  scissors: {
    id: 'scissors',
    name: 'Scissors',
    emoji: '✌️',
    beats: 'paper',
  },
};

export const ALL_MOVES: RPSMove[] = ['rock', 'paper', 'scissors'];

/**
 * Generates a random move for the computer opponent.
 */
export function getRandomComputerChoice(): RPSMove {
  const randomIndex = Math.floor(Math.random() * ALL_MOVES.length);
  return ALL_MOVES[randomIndex];
}

/**
 * Determines the outcome of a round from the player's perspective.
 * 
 * @param playerMove The move chosen by the player
 * @param computerMove The move chosen by the computer
 * @returns 'win' | 'lose' | 'draw'
 */
export function determineOutcome(playerMove: RPSMove, computerMove: RPSMove): RPSOutcome {
  if (playerMove === computerMove) {
    return 'draw';
  }

  if (MOVES[playerMove].beats === computerMove) {
    return 'win';
  }

  return 'lose';
}
