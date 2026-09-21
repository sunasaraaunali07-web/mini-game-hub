import React from 'react';
import type { GameId } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  currentGame: GameId;
  onNavigate: (game: GameId) => void;
}

// User-friendly titles for active game indication
const GAME_TITLES: Record<GameId, string> = {
  hub: 'Game Hub',
  tictactoe: 'Tic-Tac-Toe',
  rockpaperscissors: 'Rock Paper Scissors',
  numberguessing: 'Number Guessing',
};

export const Navbar: React.FC<NavbarProps> = ({ currentGame, onNavigate }) => {
  const isAtHub = currentGame === 'hub';

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Brand / Logo */}
        <div className="brand-group" onClick={() => onNavigate('hub')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onNavigate('hub')}>
          <span className="brand-icon" aria-hidden="true">🎮</span>
          <span className="brand-title">Mini Game Hub</span>
        </div>

        {/* Center / Game Breadcrumb */}
        {!isAtHub && (
          <div className="active-game-badge animate-fade-in">
            <span className="badge-divider">/</span>
            <span className="active-title">{GAME_TITLES[currentGame]}</span>
          </div>
        )}

        {/* Right Actions: Back to Hub + Theme Switch */}
        <div className="header-actions">
          {!isAtHub && (
            <button
              className="btn btn-secondary nav-hub-btn"
              onClick={() => onNavigate('hub')}
              aria-label="Back to Game Hub"
            >
              <span aria-hidden="true">🏠</span>
              <span>Game Hub</span>
            </button>
          )}

          <ThemeToggle />
        </div>
      </div>

      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-subtle);
          backdrop-filter: blur(10px);
          padding: 0.85rem 1.25rem;
          transition: background-color var(--transition-normal), border-color var(--transition-normal);
        }

        .header-inner {
          max-width: 1080px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .brand-group {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          user-select: none;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          transition: opacity var(--transition-fast);
        }

        .brand-group:hover {
          opacity: 0.85;
        }

        .brand-icon {
          font-size: 1.5rem;
        }

        .brand-title {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .active-game-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-muted);
        }

        .badge-divider {
          color: var(--text-subtle);
        }

        .active-title {
          color: var(--text-main);
          font-weight: 700;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .nav-hub-btn {
          font-size: 0.88rem;
          padding: 0.45rem 0.9rem;
        }

        @media (max-width: 640px) {
          .active-game-badge {
            display: none;
          }
          .brand-title {
            font-size: 1.05rem;
          }
        }
      `}</style>
    </header>
  );
};
