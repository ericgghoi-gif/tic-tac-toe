const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const modePvpBtn = document.getElementById('modePvpBtn');
const modeAiBtn = document.getElementById('modeAiBtn');

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],             // diagonals
];

const HUMAN = 'X';
const AI = 'O';

let board = Array(9).fill(null);
let currentPlayer = HUMAN;
let gameOver = false;
let vsComputer = false;

function updateStatus() {
  if (gameOver) return;
  if (vsComputer) {
    status.textContent = currentPlayer === HUMAN ? "Your turn (X)" : 'Computer thinking...';
  } else {
    status.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function applyMove(index, player) {
  if (gameOver || board[index]) return false;

  board[index] = player;
  const cell = cells[index];
  cell.textContent = player;
  cell.classList.add('taken', player.toLowerCase());

  const winner = checkWinner();
  if (winner) {
    highlightWinner(winner.combo);
    if (vsComputer) {
      status.textContent = winner.player === AI
        ? 'Computer wins!'
        : 'You win!';
    } else {
      status.textContent = `Player ${player} wins!`;
    }
    gameOver = true;
    return true;
  }

  if (board.every(Boolean)) {
    status.textContent = "It's a draw!";
    gameOver = true;
    return true;
  }

  currentPlayer = currentPlayer === HUMAN ? AI : HUMAN;
  updateStatus();
  return true;
}

function handleClick(e) {
  const index = Number(e.target.dataset.index);
  if (gameOver || board[index]) return;
  if (vsComputer && currentPlayer !== HUMAN) return;

  applyMove(index, currentPlayer);

  if (!gameOver && vsComputer && currentPlayer === AI) {
    setTimeout(() => {
      const move = getBestMove();
      if (move !== null) applyMove(move, AI);
    }, 300);
  }
}

function checkWinner() {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], combo };
    }
  }
  return null;
}

function highlightWinner(combo) {
  combo.forEach(i => cells[i].classList.add('winner'));
}

function getBestMove() {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = AI;
      const score = minimax(false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

function minimax(isMaximizing) {
  const winner = checkWinner();
  if (winner) {
    if (winner.player === AI) return 1;
    if (winner.player === HUMAN) return -1;
  }
  if (board.every(Boolean)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = AI;
        best = Math.max(best, minimax(false));
        board[i] = null;
      }
    }
    return best;
  }

  let best = Infinity;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = HUMAN;
      best = Math.min(best, minimax(true));
      board[i] = null;
    }
  }
  return best;
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = HUMAN;
  gameOver = false;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
  });
  updateStatus();
}

function setMode(computer) {
  vsComputer = computer;
  modePvpBtn.classList.toggle('active', !computer);
  modeAiBtn.classList.toggle('active', computer);
  resetGame();
}

modePvpBtn.addEventListener('click', () => setMode(false));
modeAiBtn.addEventListener('click', () => setMode(true));

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetBtn.addEventListener('click', resetGame);
