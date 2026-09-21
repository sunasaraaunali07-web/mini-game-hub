import React, { useState } from 'react';
import type { RPSMove, RPSOutcome, RPSScores } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ScoreBoard } from '../../components/ScoreBoard';
import { ALL_MOVES, MOVES, determineOutcome, getRandomComputerChoice } from './rpsUtils';
import './RockPaperScissors.css';

interface RockPaperScissorsGameProps {
  onBackToHub: () => void;
}

export const RockPaperScissorsGame: React.FC<RockPaperScissorsGameProps> = ({ onBackToHub }) => {
  // 1. Game State
  const [playerChoice, setPlayerChoice] = useState<RPSMove | null>(null);
  const [computerChoice, setComputerChoice] = useState<RPSMove | null>(null);
  const [outcome, setOutcome] = useState<RPSOutcome | null>(null);
  const [round, setRound] = useState<number>(0);

  // 2. Persistent Score Tracking
  const [scores, setScores] = useLocalStorage<RPSScores>('mini_game_hub_rps_scores', {
    playerWins: 0,
    computerWins: 0,
    draws: 0,
  });

  // 3. Handle Player Move Selection
  const handleSelectMove = (move: RPSMove) => {
    // Generate computer choice
    const compMove = getRandomComputerChoice();
    const result = determineOutcome(move, compMove);

    // Update round and selections
    setPlayerChoice(move);
    setComputerChoice(compMove);
    setOutcome(result);
    setRound((prev) => prev + 1);

    // Update scores in localStorage
    if (result === 'win') {
      setScores((prev) => ({ ...prev, playerWins: prev.playerWins + 1 }));
    } else if (result === 'lose') {
      setScores((prev) => ({ ...prev, computerWins: prev.computerWins + 1 }));
    } else {
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
    }
  };

  // 4. Reset Score
  const handleResetScores = () => {
    setScores({ playerWins: 0, computerWins: 0, draws: 0 });
    setRound(0);
    setPlayerChoice(null);
    setComputerChoice(null);
    setOutcome(null);
  };

  // 5. Play Next Round / Clear current showdown
  const handleNextRound = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setOutcome(null);
  };

  // Helper for outcome banner text and CSS class
  const getOutcomeDetails = () => {
    switch (outcome) {
      case 'win':
        return { text: 'You Win! 🎉', className: 'result-win' };
      case 'lose':
        return { text: 'Computer Wins! 💻', className: 'result-lose' };
      case 'draw':
        return { text: "It's a Draw! 🤝", className: 'result-draw' };
      default:
        return null;
    }
  };

  const outcomeDetails = getOutcomeDetails();

  return (
    <div className="rps-container animate-fade-in">
      {/* ScoreBoard */}
      <ScoreBoard
        title="Rock Paper Scissors Scores"
        scores={[
          { label: 'Player', value: scores.playerWins, highlight: outcome === 'win' },
          { label: 'Draws', value: scores.draws },
          { label: 'Computer', value: scores.computerWins, highlight: outcome === 'lose' },
        ]}
        onReset={handleResetScores}
      />

      {/* Round Indicator */}
      <div className="rps-round-badge" aria-label={`Current round: ${round || 1}`}>
        <span>Round {round > 0 ? round : 1}</span>
      </div>

      <h2 className="rps-prompt-text">Choose your move:</h2>

      {/* Move Selection Buttons */}
      <div className="rps-moves-grid" role="group" aria-label="Game moves">
        {ALL_MOVES.map((moveKey) => {
          const move = MOVES[moveKey];
          const isSelected = playerChoice === moveKey;

          return (
            <button
              key={move.id}
              className={`rps-move-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelectMove(move.id)}
              aria-label={`Choose ${move.name}`}
            >
              <span className="move-emoji" aria-hidden="true">{move.emoji}</span>
              <span className="move-name">{move.name}</span>
            </button>
          );
        })}
      </div>

      {/* Showdown Arena (Shown once player makes a choice) */}
      {playerChoice && computerChoice && outcomeDetails && (
        <section className="rps-arena animate-pop-in" aria-live="polite">
          <div className="arena-cards">
            {/* Player Card */}
            <div className="arena-card">
              <span className="arena-card-label">Your choice</span>
              <span className="arena-emoji" aria-hidden="true">{MOVES[playerChoice].emoji}</span>
              <span className="arena-card-choice">{MOVES[playerChoice].name}</span>
            </div>

            <span className="arena-vs" aria-hidden="true">VS</span>

            {/* Computer Card */}
            <div className="arena-card">
              <span className="arena-card-label">Computer</span>
              <span className="arena-emoji" aria-hidden="true">{MOVES[computerChoice].emoji}</span>
              <span className="arena-card-choice">{MOVES[computerChoice].name}</span>
            </div>
          </div>

          {/* Outcome Announcement */}
          <div className={`rps-result-banner ${outcomeDetails.className}`}>
            <span>{outcomeDetails.text}</span>
          </div>
        </section>
      )}

      {/* Controls */}
      <div className="rps-controls">
        {playerChoice && (
          <button className="btn btn-primary" onClick={handleNextRound}>
            Next Round 🔄
          </button>
        )}
        <button className="btn btn-secondary" onClick={onBackToHub}>
          Back to Hub 🏠
        </button>
      </div>
    </div>
  );
};
