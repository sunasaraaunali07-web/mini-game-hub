import { useState, useEffect } from 'react';
import type { GameId } from './types';
import { Navbar } from './components/Navbar';
import { GameHub } from './pages/GameHub';
import { TicTacToeGame } from './games/tictactoe/TicTacToeGame';
import { RockPaperScissorsGame } from './games/rockpaperscissors/RockPaperScissorsGame';
import { NumberGuessingGame } from './games/numberguessing/NumberGuessingGame';
import './App.css';

/**
 * App Component
 * 
 * This is the root component of the Mini Game Hub application.
 * 
 * How navigation works here (Beginner concept):
 * - We track which game is currently active using a React state variable `currentGame`.
 * - When `currentGame` is 'hub', we render the GameHub home screen.
 * - When `currentGame` is 'tictactoe', 'rockpaperscissors', or 'numberguessing',
 *   we render that specific game component.
 * - We also listen to the URL hash (e.g. #tictactoe) so you can bookmark games or use browser Back/Forward!
 */
export default function App() {
  // 1. Read initial game from URL hash or default to 'hub'
  const getGameFromHash = (): GameId => {
    const hash = window.location.hash.replace('#', '') as GameId;
    if (['tictactoe', 'rockpaperscissors', 'numberguessing'].includes(hash)) {
      return hash;
    }
    return 'hub';
  };

  const [currentGame, setCurrentGame] = useState<GameId>(getGameFromHash);

  // 2. Synchronize navigation with browser history & URL hash
  const navigateTo = (game: GameId) => {
    setCurrentGame(game);
    window.location.hash = game === 'hub' ? '' : game;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentGame(getGameFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="app-container">
      {/* Persistent Navigation Bar */}
      <Navbar
        currentGame={currentGame}
        onNavigate={navigateTo}
      />

      {/* Main Screen Content: Conditionally Rendered */}
      <main className="main-content">
        {currentGame === 'hub' && (
          <GameHub onSelectGame={navigateTo} />
        )}

        {currentGame === 'tictactoe' && (
          <TicTacToeGame onBackToHub={() => navigateTo('hub')} />
        )}

        {currentGame === 'rockpaperscissors' && (
          <RockPaperScissorsGame onBackToHub={() => navigateTo('hub')} />
        )}

        {currentGame === 'numberguessing' && (
          <NumberGuessingGame onBackToHub={() => navigateTo('hub')} />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span aria-hidden="true">🎮</span>
            <span>Mini Game Hub</span>
          </div>
          <p className="footer-subtitle">
            A beginner-friendly web learning project built with React &amp; TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}
