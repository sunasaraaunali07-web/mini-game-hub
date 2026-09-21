import React, { useState } from 'react';
import type { Difficulty, GuessHint, NumberGuessingScores } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ScoreBoard } from '../../components/ScoreBoard';
import {
  DIFFICULTY_CONFIGS,
  generateRandomTarget,
  validateGuessInput,
  evaluateGuess,
} from './numberGuessingUtils';
import './NumberGuessing.css';

interface NumberGuessingGameProps {
  onBackToHub: () => void;
}

export const NumberGuessingGame: React.FC<NumberGuessingGameProps> = ({ onBackToHub }) => {
  // 1. Difficulty & Target State
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const config = DIFFICULTY_CONFIGS[difficulty];

  // Secret target number to guess
  const [targetNumber, setTargetNumber] = useState<number>(() =>
    generateRandomTarget(config.min, config.max)
  );

  // 2. Guess State
  const [inputVal, setInputVal] = useState<string>('');
  const [previousGuesses, setPreviousGuesses] = useState<number[]>([]);
  const [hint, setHint] = useState<GuessHint | null>(null);
  const [lastGuess, setLastGuess] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isWon, setIsWon] = useState<boolean>(false);

  // 3. Persistent Scores (stored in localStorage)
  const [scores, setScores] = useLocalStorage<NumberGuessingScores>('mini_game_hub_guess_scores', {
    gamesWon: 0,
    bestAttempts: {
      easy: null,
      medium: null,
      hard: null,
    },
  });

  // 4. Handle Submitting a Guess
  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isWon) return;

    // Validate the input
    const validation = validateGuessInput(inputVal, config.min, config.max);

    if (!validation.isValid || validation.parsedNumber === null) {
      setErrorMessage(validation.errorMessage);
      return;
    }

    // Input is valid: clear any prior error
    setErrorMessage(null);
    const guess = validation.parsedNumber;
    const result = evaluateGuess(guess, targetNumber);

    // Update history
    const updatedGuesses = [...previousGuesses, guess];
    setPreviousGuesses(updatedGuesses);
    setLastGuess(guess);
    setHint(result);
    setInputVal('');

    if (result === 'correct') {
      setIsWon(true);
      const totalAttempts = updatedGuesses.length;

      // Update persistent stats
      setScores((prev) => {
        const currentBest = prev.bestAttempts[difficulty];
        const newBest = currentBest === null ? totalAttempts : Math.min(currentBest, totalAttempts);

        return {
          gamesWon: prev.gamesWon + 1,
          bestAttempts: {
            ...prev.bestAttempts,
            [difficulty]: newBest,
          },
        };
      });
    }
  };

  // 5. Change Difficulty (starts a fresh game for that difficulty)
  const handleDifficultyChange = (newDiff: Difficulty) => {
    if (newDiff === difficulty) return;
    const newConfig = DIFFICULTY_CONFIGS[newDiff];
    setDifficulty(newDiff);
    setTargetNumber(generateRandomTarget(newConfig.min, newConfig.max));
    setInputVal('');
    setPreviousGuesses([]);
    setHint(null);
    setLastGuess(null);
    setErrorMessage(null);
    setIsWon(false);
  };

  // 6. Start a New Game (keeps difficulty and scores)
  const handleNewGame = () => {
    setTargetNumber(generateRandomTarget(config.min, config.max));
    setInputVal('');
    setPreviousGuesses([]);
    setHint(null);
    setLastGuess(null);
    setErrorMessage(null);
    setIsWon(false);
  };

  // 7. Reset all scores
  const handleResetScores = () => {
    setScores({
      gamesWon: 0,
      bestAttempts: { easy: null, medium: null, hard: null },
    });
  };

  const bestForCurrent = scores.bestAttempts[difficulty];

  return (
    <div className="guess-container animate-fade-in">
      {/* ScoreBoard */}
      <ScoreBoard
        title="Number Guessing Scores"
        scores={[
          { label: 'Wins', value: scores.gamesWon },
          { label: 'Attempts', value: previousGuesses.length },
          { label: 'Best Attempts', value: bestForCurrent !== null ? bestForCurrent : '—' },
        ]}
        onReset={handleResetScores}
      />

      {/* Difficulty Selector Tabs */}
      <div className="difficulty-selector" role="tablist" aria-label="Difficulty level">
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
          <button
            key={level}
            role="tab"
            aria-selected={difficulty === level}
            className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
            onClick={() => handleDifficultyChange(level)}
          >
            {DIFFICULTY_CONFIGS[level].label}
          </button>
        ))}
      </div>

      {/* Range Info Banner */}
      <div className="range-info-banner">
        <span>Difficulty: <strong>{config.label}</strong></span>
        <span>•</span>
        <span>Range: <span className="range-highlight">{config.min}–{config.max}</span></span>
      </div>

      {/* Main Game Play Card */}
      <section className="guess-play-card" aria-label="Guess input card">
        <h2 className="guess-prompt">
          I'm thinking of a number between {config.min} and {config.max}.
        </h2>

        {/* Input Form */}
        <form className="guess-form" onSubmit={handleGuessSubmit}>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="guess-input"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder={`${config.min}–${config.max}`}
            disabled={isWon}
            aria-label="Enter your guess"
            autoFocus
          />
          <button
            type="submit"
            className="btn btn-primary guess-submit-btn"
            disabled={isWon}
          >
            Guess
          </button>
        </form>

        {/* Error Alert */}
        {errorMessage && (
          <div className="guess-error-alert" role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Hint Announcement */}
        {hint && lastGuess !== null && (
          <div
            className={`guess-hint-banner ${
              hint === 'correct' ? 'hint-correct' : hint === 'higher' ? 'hint-higher' : 'hint-lower'
            }`}
            role="status"
            aria-live="polite"
          >
            {hint === 'correct' && (
              <span>🎉 Correct! You found the number {targetNumber} in {previousGuesses.length} attempts!</span>
            )}
            {hint === 'higher' && (
              <span>You guessed {lastGuess}. Try a higher number! ⬆️</span>
            )}
            {hint === 'lower' && (
              <span>You guessed {lastGuess}. Try a lower number! ⬇️</span>
            )}
          </div>
        )}

        {/* Previous Guesses */}
        {previousGuesses.length > 0 && (
          <div className="previous-guesses-section">
            <span className="previous-guesses-label">
              Previous Guesses ({previousGuesses.length}):
            </span>
            <div className="guesses-chips" aria-label="List of previous guesses">
              {previousGuesses.map((guess, idx) => {
                const isLatest = idx === previousGuesses.length - 1;
                return (
                  <span
                    key={idx}
                    className={`guess-chip ${isLatest ? 'last' : ''}`}
                    title={isLatest ? 'Most recent guess' : undefined}
                  >
                    {guess}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Controls */}
      <div className="guess-controls">
        <button className="btn btn-primary" onClick={handleNewGame}>
          {isWon ? 'Play Again 🔄' : 'New Game 🔄'}
        </button>
        <button className="btn btn-secondary" onClick={onBackToHub}>
          Back to Hub 🏠
        </button>
      </div>
    </div>
  );
};
