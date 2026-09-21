import React from 'react';

export interface ScoreItem {
  label: string;
  value: number | string;
  highlight?: boolean;
}

interface ScoreBoardProps {
  scores: ScoreItem[];
  onReset?: () => void;
  title?: string;
}

/**
 * Reusable ScoreBoard Component
 * Displays game metrics (wins, losses, draws, rounds, attempts) in a neat row.
 * Keeps scoring consistent across all three mini-games.
 */
export const ScoreBoard: React.FC<ScoreBoardProps> = ({ scores, onReset, title = 'Scoreboard' }) => {
  return (
    <section className="scoreboard-container" aria-label={title}>
      <div className="scoreboard-cards">
        {scores.map((item, index) => (
          <div key={index} className={`score-card ${item.highlight ? 'score-highlight' : ''}`}>
            <span className="score-label">{item.label}</span>
            <span className="score-value">{item.value}</span>
          </div>
        ))}
      </div>

      {onReset && (
        <button
          className="btn btn-danger-outline reset-score-btn"
          onClick={onReset}
          aria-label="Reset all game scores to zero"
        >
          Reset Score
        </button>
      )}

      <style>{`
        .scoreboard-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          width: 100%;
          max-width: 480px;
        }

        .scoreboard-cards {
          display: flex;
          align-items: stretch;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
        }

        .score-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 0.5rem;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          transition: transform var(--transition-fast), border-color var(--transition-fast);
        }

        .score-highlight {
          border-color: var(--color-primary);
          background-color: var(--bg-surface-elevated);
        }

        .score-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          font-weight: 600;
          margin-bottom: 0.25rem;
          text-align: center;
        }

        .score-value {
          font-size: 1.5rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: var(--text-main);
        }

        .reset-score-btn {
          margin-top: 0.25rem;
        }
      `}</style>
    </section>
  );
};
