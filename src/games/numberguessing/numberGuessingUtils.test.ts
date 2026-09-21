import { describe, it, expect } from 'vitest';
import {
  generateRandomTarget,
  validateGuessInput,
  evaluateGuess,
} from './numberGuessingUtils';

describe('numberGuessingUtils', () => {
  it('generateRandomTarget produces numbers strictly within [min, max]', () => {
    for (let i = 0; i < 100; i++) {
      const target = generateRandomTarget(1, 50);
      expect(target).toBeGreaterThanOrEqual(1);
      expect(target).toBeLessThanOrEqual(50);
    }
  });

  describe('validateGuessInput', () => {
    it('accepts valid integers within range', () => {
      const res = validateGuessInput('42', 1, 100);
      expect(res.isValid).toBe(true);
      expect(res.parsedNumber).toBe(42);
      expect(res.errorMessage).toBeNull();
    });

    it('rejects empty input with friendly error', () => {
      const res = validateGuessInput('   ', 1, 100);
      expect(res.isValid).toBe(false);
      expect(res.errorMessage).toBe('Please enter a number between 1 and 100.');
    });

    it('rejects non-numeric characters', () => {
      const res = validateGuessInput('abc', 1, 100);
      expect(res.isValid).toBe(false);
      expect(res.errorMessage).toBe('Please enter numbers only (e.g. 42).');
    });

    it('rejects decimal numbers', () => {
      const res = validateGuessInput('42.5', 1, 100);
      expect(res.isValid).toBe(false);
      expect(res.errorMessage).toBe('Please enter a whole integer without decimals.');
    });

    it('rejects numbers smaller than min', () => {
      const res = validateGuessInput('0', 1, 100);
      expect(res.isValid).toBe(false);
      expect(res.errorMessage).toBe('Number must be between 1 and 100.');
    });

    it('rejects numbers larger than max', () => {
      const res = validateGuessInput('105', 1, 100);
      expect(res.isValid).toBe(false);
      expect(res.errorMessage).toBe('Number must be between 1 and 100.');
    });
  });

  describe('evaluateGuess', () => {
    it('returns "higher" when guess is less than target', () => {
      expect(evaluateGuess(30, 50)).toBe('higher');
    });

    it('returns "lower" when guess is greater than target', () => {
      expect(evaluateGuess(70, 50)).toBe('lower');
    });

    it('returns "correct" when guess equals target', () => {
      expect(evaluateGuess(50, 50)).toBe('correct');
    });
  });
});
