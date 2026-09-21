# 🎓 Mini Game Hub — Beginner Learning Guide

Welcome to the **Mini Game Hub** codebase!

This guide was written specifically for you as a beginner web developer. It explains how this project is constructed, how the files talk to each other, and how key web concepts (React, TypeScript, CSS, and localStorage) work in practice.

---

## 1. What Each Major Folder Does

When you look inside the `src/` folder, you will see a clean, organized structure:

| Folder | What It's For |
| :--- | :--- |
| `src/components/` | **Reusable building blocks** shared across screens (Navbar, ScoreBoard, ThemeToggle, GameCard). |
| `src/pages/` | **Full-page screens**. In our app, this contains `GameHub.tsx`, the home screen. |
| `src/games/` | **Independent game folders**. Each game gets its own subfolder containing its UI, pure logic, tests, and styles. |
| `src/hooks/` | **Custom React hooks**. Reusable stateful logic, like saving data to `localStorage`. |
| `src/types/` | **TypeScript interfaces & types**. Describes the shape of our game data (scores, moves, difficulty). |
| `src/styles/` | **CSS styling**. Central design tokens (`variables.css`) and base layout styles (`global.css`). |

---

## 2. What Each Important File Does

Here is a quick map of the most important files:

* [`src/main.tsx`](file:///src/main.tsx): The **entry point** where React attaches to the HTML document.
* [`src/App.tsx`](file:///src/App.tsx): The **traffic controller**. Decides which game or screen to show based on state.
* [`src/types/index.ts`](file:///src/types/index.ts): Holds all TypeScript definitions so you don't have to guess what properties an object has.
* [`src/hooks/useLocalStorage.ts`](file:///src/hooks/useLocalStorage.ts): A custom hook that keeps React state in sync with the browser's storage.
* [`src/styles/variables.css`](file:///src/styles/variables.css): Defines color themes (Dark & Light) using standard CSS custom properties (`--color-primary`, `--bg-surface`, etc.).

---

## 3. Where the Game Hub Is Implemented

* **Component**: [`src/pages/GameHub.tsx`](file:///src/pages/GameHub.tsx)
* **Card Component**: [`src/components/GameCard.tsx`](file:///src/components/GameCard.tsx)

**How it works**:
`GameHub.tsx` defines a list of available games with their title, icon, and description. It loops through this list and renders a `<GameCard />` for each one. When you click a card, it fires `onSelectGame('tictactoe')`, which signals `App.tsx` to switch the view.

---

## 4. Where Tic-Tac-Toe Logic Is Implemented

* **Pure Logic & Calculations**: [`src/games/tictactoe/ticTacToeUtils.ts`](file:///src/games/tictactoe/ticTacToeUtils.ts)
* **Automated Tests**: [`src/games/tictactoe/ticTacToeUtils.test.ts`](file:///src/games/tictactoe/ticTacToeUtils.test.ts)
* **User Interface & Interaction**: [`src/games/tictactoe/TicTacToeGame.tsx`](file:///src/games/tictactoe/TicTacToeGame.tsx)
* **Visual Styles**: [`src/games/tictactoe/TicTacToe.css`](file:///src/games/tictactoe/TicTacToe.css)

**Why separation matters**:
Notice how `checkGameResult()` in `ticTacToeUtils.ts` has **no JSX or HTML**. It takes an array of 9 cells and checks the 8 possible winning lines. Because it is a "pure function", we can test all win scenarios (horizontal, vertical, diagonal, and draw) in milliseconds without needing to click buttons in a browser!

---

## 5. Where Rock Paper Scissors Logic Is Implemented

* **Pure Logic & Move Rules**: [`src/games/rockpaperscissors/rpsUtils.ts`](file:///src/games/rockpaperscissors/rpsUtils.ts)
* **Automated Tests**: [`src/games/rockpaperscissors/rpsUtils.test.ts`](file:///src/games/rockpaperscissors/rpsUtils.test.ts)
* **User Interface & Arena**: [`src/games/rockpaperscissors/RockPaperScissorsGame.tsx`](file:///src/games/rockpaperscissors/RockPaperScissorsGame.tsx)
* **Visual Styles**: [`src/games/rockpaperscissors/RockPaperScissors.css`](file:///src/games/rockpaperscissors/RockPaperScissors.css)

**How it works**:
1. When you click a move (e.g. ✊ Rock), `handleSelectMove('rock')` is called.
2. `getRandomComputerChoice()` randomly selects from `['rock', 'paper', 'scissors']`.
3. `determineOutcome(playerMove, computerMove)` uses a simple rule map to return `'win'`, `'lose'`, or `'draw'`.
4. The component shows the showdown arena, bumps the round counter, and updates the scoreboard.

---

## 6. Where Number Guessing Logic Is Implemented

* **Pure Logic, Validation & Hints**: [`src/games/numberguessing/numberGuessingUtils.ts`](file:///src/games/numberguessing/numberGuessingUtils.ts)
* **Automated Tests**: [`src/games/numberguessing/numberGuessingUtils.test.ts`](file:///src/games/numberguessing/numberGuessingUtils.test.ts)
* **User Interface**: [`src/games/numberguessing/NumberGuessingGame.tsx`](file:///src/games/numberguessing/NumberGuessingGame.tsx)
* **Visual Styles**: [`src/games/numberguessing/NumberGuessing.css`](file:///src/games/numberguessing/NumberGuessing.css)

**How input validation works**:
In `numberGuessingUtils.ts`, the `validateGuessInput` function carefully checks:
1. Is it empty?
2. Is it not a number (e.g. letters)?
3. Does it contain decimal points (floats)?
4. Is it out of the current range (e.g., < 1 or > 100)?

If invalid, it returns a friendly error message to display to the user without crashing the app.

---

## 7. How Navigation Between Games Works

Navigation in this project is simple and requires **no external router library**:

1. In [`src/App.tsx`](file:///src/App.tsx), we maintain state:
   ```tsx
   const [currentGame, setCurrentGame] = useState<GameId>('hub');
   ```
2. In the JSX, conditional rendering displays the selected component:
   ```tsx
   {currentGame === 'hub' && <GameHub onSelectGame={navigateTo} />}
   {currentGame === 'tictactoe' && <TicTacToeGame onBackToHub={() => navigateTo('hub')} />}
   ```
3. To make it even better, `navigateTo` updates `window.location.hash` (e.g. `#tictactoe`), so you can share URLs or click the browser's Back and Forward buttons!

---

## 8. Where Scores Are Stored & How localStorage Works

All game scores are stored locally in your browser using our custom hook [`src/hooks/useLocalStorage.ts`](file:///src/hooks/useLocalStorage.ts).

### Example from Tic-Tac-Toe:
```tsx
const [scores, setScores] = useLocalStorage<TicTacToeScores>('mini_game_hub_tictactoe_scores', {
  xWins: 0,
  oWins: 0,
  draws: 0,
});
```

### How `useLocalStorage` works under the hood:
1. **Initial Read**: When the component first mounts, it checks `window.localStorage.getItem(key)`. If data exists, it parses the JSON; otherwise it uses the default values.
2. **Automatic Save**: Whenever you call `setScores(...)`, a React `useEffect` automatically serializes the new state with `JSON.stringify()` and writes it back to `localStorage`.
3. **Safety**: If the user's browser has disabled storage or is in a strict private browsing mode, it safely falls back to standard in-memory React state.

---

## 9. Where Styling Is Defined & How Themes Work

Styles use modern, pure CSS with **CSS Custom Properties (Variables)**:

1. Look in [`src/styles/variables.css`](file:///src/styles/variables.css). Notice how we define tokens for dark and light themes:
   ```css
   :root[data-theme='dark'] {
     --bg-app: #090d16;
     --text-main: #f9fafb;
   }
   :root[data-theme='light'] {
     --bg-app: #f1f5f9;
     --text-main: #0f172a;
   }
   ```
2. The [`ThemeToggle.tsx`](file:///src/components/ThemeToggle.tsx) component simply switches `document.documentElement.setAttribute('data-theme', theme)`.
3. Every button, card, and background uses `var(--bg-app)` or `var(--text-main)`, so the entire website changes appearance instantly with zero CSS duplication!

---

## 10. How to Run the Project (One-Command Launcher: `python main.py`)

Instead of remembering multiple commands, we provided a master launcher script [`main.py`](file:///main.py):

```bash
python main.py
```

### What this script does for you:
1. Checks if the build exists (and builds it automatically if missing).
2. Starts a local HTTP server with single-page application routing.
3. Automatically opens your default web browser.
4. Detects your computer's Wi-Fi network address so anyone on your local network (e.g. phone or family member) can open and play immediately!
5. Offers an interactive menu or flags:
   - `python main.py --share`: Automatically creates an internet shareable link via localtunnel so friends outside your Wi-Fi can play.
   - `python main.py --dev`: Runs the Vite hot-reloading dev server for live coding.
   - `python main.py --test`: Runs the 25 automated unit tests.

If you prefer standard npm commands:
```bash
npm run dev   # Start Vite dev server
npm test      # Run automated tests
npm run build # Compile production bundle
```

---

## 11. How to Run Automated Tests

To run the Vitest test suite and check that all game algorithms work correctly:
```bash
npm test
```

---

## 12. How to Build for Production

To compile and bundle the application into static files ready for deployment:
```bash
npm run build
```
The optimized production files will be placed in the `dist/` directory. You can preview the production build locally with:
```bash
npm run preview
```

---

## 13. Next Steps: Ideas for Learning & Extending!

Now that you understand how the code is structured, here are fun challenges to try:
- **Add a sound effect**: Play a click or celebration sound when winning.
- **Add an AI opponent to Tic-Tac-Toe**: Create a simple single-player mode that picks random empty cells or blocks winning rows.
- **Add a new game**: Create `src/games/memorymatch/` and plug it into `App.tsx` and `GameHub.tsx`!
