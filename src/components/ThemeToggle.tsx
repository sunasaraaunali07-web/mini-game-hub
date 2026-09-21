import React, { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Theme } from '../types';

/**
 * ThemeToggle Component
 * Allows users to toggle between dark mode (default) and light mode.
 * The selection is saved in localStorage so it persists between page refreshes.
 */
export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('mini_game_hub_theme', 'dark');

  // Synchronize the DOM element's data-theme attribute whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      className="btn btn-secondary theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{
        padding: '0.45rem 0.85rem',
        fontSize: '0.9rem',
        borderRadius: 'var(--radius-full)'
      }}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</span>
    </button>
  );
};
