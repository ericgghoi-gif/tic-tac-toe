# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Vanilla HTML/CSS/JS Tic Tac Toe game. No build tools, no frameworks, no dependencies.

## Development

Open `index.html` directly in a browser to run locally — no server needed.

On Windows:
```powershell
Start-Process index.html
```

## Deployment

Every push to `master` automatically deploys to GitHub Pages via `.github/workflows/deploy.yml`.

Live URL: https://ericgghoi-gif.github.io/tic-tac-toe/ (short: https://tinyurl.com/2xkc5go6)

## Architecture

All game logic lives in `script.js`. There is no module system — the three files are loaded directly by `index.html`.

- **State**: `board` (9-element array), `currentPlayer` ('X'|'O'), `gameOver` (boolean)
- **Win detection**: `checkWinner()` iterates `WINNING_COMBOS` (8 hardcoded index triplets) against `board`
- **DOM**: cells are selected once at load via `querySelectorAll('.cell')` and indexed by `data-index` attribute; class names (`taken`, `x`, `o`, `winner`) drive all visual state via CSS

## Git workflow

Commit and push to `master` after every change. GitHub Actions handles deployment automatically.
