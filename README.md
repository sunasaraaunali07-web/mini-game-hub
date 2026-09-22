# 🎮 Mini Game Hub

A modern, responsive, and beginner-friendly web application built with **React**, **TypeScript**, and **Vite**.

Mini Game Hub brings together three classic, self-contained mini-games in a cohesive gaming environment designed for learning and fun.

---

## 🌟 Features

- **Central Game Hub**: Interactive cards with icons, descriptions, and smooth hover animations.
- **Three Independent Games**:
  - 🎮 **Tic-Tac-Toe**: 2-player local play, turn indicator, automatic win/draw detection, winning 3-in-a-row cell highlight, and score tracking.
  - ✊ **Rock Paper Scissors**: Battle the computer with real-time showdown reveal, round counter, and match win/loss/draw scoreboard.
  - 🔢 **Number Guessing Game**: 3 difficulty levels (Easy 1–50, Medium 1–100, Hard 1–500), input validation against invalid/decimal/out-of-bound entries, dynamic "higher/lower" hints, and attempt history chips.
- **Dark & Light Theming**: Default dark gaming theme with an instant toggle to a crisp light theme, saved in `localStorage`.
- **Persistent Scores**: Match results and best attempt records stay saved in the browser across page reloads.
- **Zero Backend / Serverless**: 100% runs in your browser.
- **Fully Responsive**: Adapts seamlessly to smartphones, tablets, and desktop displays.
- **Accessible & Tested**: Keyboard friendly, accessible ARIA labels, semantic HTML, and automated unit tests for all game logic using Vitest.

---

## 🕹️ Games Included

### 1. Tic-Tac-Toe
* **Symbols**: Player X and Player O.
* **Rules**: Standard 3×3 grid. First player to connect 3 symbols horizontally, vertically, or diagonally wins.
* **Scoreboard**: Tracks Player X wins, Player O wins, and Draws with a dedicated Reset Score button.

### 2. Rock Paper Scissors
* **Opponent**: Computer AI with random selection.
* **Rules**: Rock crushes Scissors, Scissors cuts Paper, Paper covers Rock.
* **Rounds**: Automatic round counting with clear win/lose/draw announcements and scoreboard.

### 3. Number Guessing Game
* **Difficulties**:
  - **Easy**: 1–50
  - **Medium**: 1–100
  - **Hard**: 1–500
* **Features**: Live attempt counter, previous guess history, feedback hints ("Try a higher number! ⬆️" / "Try a lower number! ⬇️"), and win celebration screen.

---

## 💻 Tech Stack

* **Framework**: [React 19](https://react.dev/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Build Tool**: [Vite](https://vite.dev/)
* **Testing**: [Vitest](https://vitest.dev/)
* **Styling**: Pure CSS with CSS Custom Properties (Theme variables)

---

## 🚀 Quick Start (Easiest Way: `python main.py`)

You can launch the entire project with a single command using our master Python launcher:

```bash
python main.py
```

It will automatically:
1. Verify and build project assets
2. Start the local server
3. Open your browser to https://mini-game-hub-iota.vercel.app


## 📁 Project Structure

```
mini-game-hub/
├── index.html                   # HTML template & theme flash protector
├── package.json                 # Project dependencies and npm scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration
├── README.md                    # Project documentation
├── LEARNING_GUIDE.md            # Detailed beginner guide to the codebase
└── src/
    ├── main.tsx                 # React entry point
    ├── App.tsx                  # Top-level screen coordinator & hash router
    ├── App.css                  # Layout & footer styling
    ├── index.css                # Global imports
    ├── types/
    │   └── index.ts             # Central TypeScript interfaces
    ├── hooks/
    │   └── useLocalStorage.ts   # Custom hook for localStorage persistence
    ├── styles/
    │   ├── variables.css        # Dark/Light theme tokens & CSS variables
    │   └── global.css           # Global reset, typography, and button styles
    ├── components/
    │   ├── Navbar.tsx           # Global navigation & header
    │   ├── ThemeToggle.tsx      # Dark / light theme button
    │   ├── ScoreBoard.tsx       # Reusable score counter strip
    │   └── GameCard.tsx         # Interactive card for the Game Hub
    ├── pages/
    │   └── GameHub.tsx          # Home page grid of mini games
    └── games/
        ├── tictactoe/
        │   ├── TicTacToeGame.tsx
        │   ├── ticTacToeUtils.ts
        │   ├── ticTacToeUtils.test.ts
        │   └── TicTacToe.css
        ├── rockpaperscissors/
        │   ├── RockPaperScissorsGame.tsx
        │   ├── rpsUtils.ts
        │   ├── rpsUtils.test.ts
        │   └── RockPaperScissors.css
        └── numberguessing/
            ├── NumberGuessingGame.tsx
            ├── numberGuessingUtils.ts
            ├── numberGuessingUtils.test.ts
            └── NumberGuessing.css
```

---

## 💡 Future Expansion Ideas

The modular architecture makes adding new games straightforward. Here are ideas to expand the hub:
- **Memory Match Card Game**: Match pairs of flipped emoji cards.
- **Connect Four**: 7×6 grid with gravity drops.
- **Reaction Time Game**: Click as fast as possible when the light turns green.
- **Minesweeper**: Grid with flagged bombs and numbers.

---

## 📖 Beginner Learning Guide

If you are inspecting or modifying this codebase for learning, make sure to read [LEARNING_GUIDE.md](file:///LEARNING_GUIDE.md), which explains each concept in beginner-friendly detail.
