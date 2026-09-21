import { describe, it, expect } from 'vitest';
import { determineOutcome, getRandomComputerChoice, ALL_MOVES } from './rpsUtils';

describe('rpsUtils', () => {
  it('should detect draws when moves are identical', () => {
    expect(determineOutcome('rock', 'rock')).toBe('draw');
    expect(determineOutcome('paper', 'paper')).toBe('draw');
    expect(determineOutcome('scissors', 'scissors')).toBe('draw');
  });

  it('should detect win when Rock beats Scissors', () => {
    expect(determineOutcome('rock', 'scissors')).toBe('win');
  });

  it('should detect loss when Rock loses to Paper', () => {
    expect(determineOutcome('rock', 'paper')).toBe('lose');
  });

  it('should detect win when Paper beats Rock', () => {
    expect(determineOutcome('paper', 'rock')).toBe('win');
  });

  it('should detect loss when Paper loses to Scissors', () => {
    expect(determineOutcome('paper', 'scissors')).toBe('lose');
  });

  it('should detect win when Scissors beats Paper', () => {
    expect(determineOutcome('scissors', 'paper')).toBe('win');
  });

  it('should detect loss when Scissors loses to Rock', () => {
    expect(determineOutcome('scissors', 'rock')).toBe('lose');
  });

  it('getRandomComputerChoice should always return one of the valid moves', () => {
    for (let i = 0; i < 50; i++) {
      const choice = getRandomComputerChoice();
      expect(ALL_MOVES).toContain(choice);
    }
  });
});
