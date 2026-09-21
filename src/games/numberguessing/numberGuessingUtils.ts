import type { Difficulty, DifficultyConfig, GuessHint } from '../../types';

/**
 * Pure functions and settings for the Number Guessing game.
 */

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: 'Easy',
    min: 1,
    max: 50,
    description: 'Range: 1–50 (Great for quick games)',
  },
  medium: {
    label: 'Medium',
    min: 1,
    max: 100,
    description: 'Range: 1–100 (The classic challenge)',
  },
  hard: {
    label: 'Hard',
    min: 1,
    max: 500,
    description: 'Range: 1–500 (Master detective)',
  },
};

/**
 * Generates an integer target within the inclusive range [min, max].
 */
export function generateRandomTarget(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface ValidationResult {
  isValid: boolean;
  parsedNumber: number | null;
  errorMessage: string | null;
}

/**
 * Validates player input against rules:
 * - Cannot be empty
 * - Must be a valid number
 * - Must be a whole integer (no decimals)
 * - Must be between min and max inclusive
 */
export function validateGuessInput(rawInput: string, min: number, max: number): ValidationResult {
  const trimmed = rawInput.trim();

  // Check 1: Empty input
  if (trimmed === '') {
    return {
      isValid: false,
      parsedNumber: null,
      errorMessage: `Please enter a number between ${min} and ${max}.`,
    };
  }

  // Check 2: Non-numeric
  const parsed = Number(trimmed);
  if (isNaN(parsed)) {
    return {
      isValid: false,
      parsedNumber: null,
      errorMessage: 'Please enter numbers only (e.g. 42).',
    };
  }

  // Check 3: Decimals / non-integer
  if (!Number.isInteger(parsed)) {
    return {
      isValid: false,
      parsedNumber: null,
      errorMessage: 'Please enter a whole integer without decimals.',
    };
  }

  // Check 4: Out of bounds
  if (parsed < min || parsed > max) {
    return {
      isValid: false,
      parsedNumber: null,
      errorMessage: `Number must be between ${min} and ${max}.`,
    };
  }

  return {
    isValid: true,
    parsedNumber: parsed,
    errorMessage: null,
  };
}

/**
 * Evaluates the player's guess against the secret target number.
 */
export function evaluateGuess(guess: number, target: number): GuessHint {
  if (guess === target) {
    return 'correct';
  }
  return guess < target ? 'higher' : 'lower';
}
