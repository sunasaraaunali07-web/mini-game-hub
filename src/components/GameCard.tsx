import React from 'react';
import type { GameId } from '../types';

interface GameCardProps {
  id: GameId;
  title: string;
  icon: string;
  description: string;
  badge?: string;
  onSelect: (id: GameId) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  id,
  title,
  icon,
  description,
  badge,
  onSelect,
}) => {
  return (
    <article
      className="game-card"
      onClick={() => onSelect(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(id);
        }
      }}
      aria-label={`Play ${title}: ${description}`}
    >
      <div className="card-top">
        <div className="card-icon" aria-hidden="true">
          {icon}
        </div>
        {badge && <span className="card-badge">{badge}</span>}
      </div>

      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>

      <div className="card-footer">
        <button
          className="btn btn-primary card-play-btn"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(id);
          }}
          tabIndex={-1} /* Article is already keyboard focusable */
          aria-hidden="true"
        >
          <span>Play Now</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <style>{`
        .game-card {
          position: relative;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 1.75rem 1.5rem;
          cursor: pointer;
          transition: all var(--transition-normal);
          box-shadow: var(--shadow-sm);
          text-align: left;
          user-select: none;
        }

        .game-card:hover {
          transform: translateY(-5px);
          border-color: var(--border-focus);
          box-shadow: var(--shadow-md), var(--shadow-glow);
          background-color: var(--bg-card-hover);
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .card-icon {
          font-size: 2.75rem;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-surface-elevated);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          transition: transform var(--transition-fast);
        }

        .game-card:hover .card-icon {
          transform: scale(1.08) rotate(3deg);
        }

        .card-badge {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
          background-color: var(--badge-bg);
          color: var(--badge-text);
        }

        .card-body {
          flex: 1;
          margin-bottom: 1.5rem;
        }

        .card-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.5rem;
          letter-spacing: -0.01em;
        }

        .card-description {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .card-footer {
          margin-top: auto;
        }

        .card-play-btn {
          width: 100%;
          font-size: 0.95rem;
        }
      `}</style>
    </article>
  );
};
