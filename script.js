const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],             // diagonals
];

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;

function handleClick(e) {
  const index = e.target.dataset.index;
  if (gameOver || board[index]) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add('taken', currentPlayer.toLowerCase());

  const winner = checkWinner();
  if (winner) {
    highlightWinner(winner.combo);
    status.textContent = `Player ${currentPlayer} wins! 🎉`;
    gameOver = true;
    return;
  }

  if (board.every(Boolean)) {
    status.textContent = "It's a draw!";
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  status.textContent = `Player ${currentPlayer}'s turn`;
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

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  status.textContent = "Player X's turn";
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
  });
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetBtn.addEventListener('click', resetGame);
