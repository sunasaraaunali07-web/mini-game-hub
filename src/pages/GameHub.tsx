import React from 'react';
import type { GameId } from '../types';
import { GameCard } from '../components/GameCard';

interface GameHubProps {
  onSelectGame: (game: GameId) => void;
}

export const GameHub: React.FC<GameHubProps> = ({ onSelectGame }) => {
  const games = [
    {
      id: 'tictactoe' as GameId,
      title: 'Tic-Tac-Toe',
      icon: '🎮',
      badge: '2 Players',
      description: 'Classic 3×3 strategy game.',
    },
    {
      id: 'rockpaperscissors' as GameId,
      title: 'Rock Paper Scissors',
      icon: '✊',
      badge: 'vs Computer',
      description: 'Choose your move and challenge the computer.',
    },
    {
      id: 'numberguessing' as GameId,
      title: 'Number Guessing',
      icon: '🔢',
      badge: '3 Difficulties',
      description: 'Guess the hidden number using the fewest attempts.',
    },
  ];

  return (
    <div className="hub-page animate-fade-in">
      <section className="hub-hero">
        <h1 className="hero-heading">Play, Learn &amp; Challenge Yourself</h1>
        <p className="hero-subheading">
          A collection of three classic mini-games built with clean, beginner-friendly React &amp; TypeScript.
          Choose a game below to jump in!
        </p>
      </section>

      <div className="games-grid">
        {games.map((game) => (
          <GameCard
            key={game.id}
            id={game.id}
            title={game.title}
            icon={game.icon}
            badge={game.badge}
            description={game.description}
            onSelect={onSelectGame}
          />
        ))}
      </div>

      <style>{`
        .hub-page {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hub-hero {
          text-align: center;
          margin-bottom: 3rem;
          max-width: 680px;
        }

        .hero-heading {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 0.85rem;
          background: linear-gradient(135deg, var(--text-main) 60%, var(--color-primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subheading {
          font-size: 1.1rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .games-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 900px) {
          .games-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .hero-heading {
            font-size: 1.85rem;
          }
          .hero-subheading {
            font-size: 1rem;
          }
          .games-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};
