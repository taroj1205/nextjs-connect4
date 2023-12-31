function findBestMove(grid: (string | null)[][]): number | null {
  const ourPlayer = "Red";
  const opponent = "Yellow";

  let blockingMove = findWinningMove(grid, opponent);
  if (blockingMove !== null) {
    return blockingMove;
  }

  let winningMove = findWinningMove(grid, ourPlayer);
  if (winningMove !== null) {
    return winningMove;
  }

  // If no blocking or winning move is found, place randomly
  let availableColumns = [];
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[0][col] === null) {
      availableColumns.push(col);
    }
  }

  // Check if placing a piece would lead the opponent to win in the next move
  let safeColumns = [];
  for (let col of availableColumns) {
    for (let row = grid.length - 1; row >= 0; row--) {
      if (grid[row][col] === null) {
        grid[row][col] = ourPlayer; // Simulate our move
        if (!findWinningMove(grid, opponent)) { // If the opponent cannot win in the next move
          safeColumns.push(col);
        }
        grid[row][col] = null; // Undo our move
        break;
      }
    }
  }

  if (safeColumns.length > 0) {
    let randomIndex = Math.floor(Math.random() * safeColumns.length);
    return safeColumns[randomIndex];
  }

  // If no safe column is found, place randomly in the available columns
  if (availableColumns.length > 0) {
    let randomIndex = Math.floor(Math.random() * availableColumns.length);
    return availableColumns[randomIndex];
  }

  return null;
}

function checkWin(grid: (string | null)[][], player: string): boolean {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (
        (grid[row][col] === player &&
          grid[row][col + 1] === player &&
          grid[row][col + 2] === player &&
          grid[row][col + 3] === player) ||
        (grid[row][col] === player &&
          grid[row + 1]?.[col] === player &&
          grid[row + 2]?.[col] === player &&
          grid[row + 3]?.[col] === player) ||
        (grid[row][col] === player &&
          grid[row + 1]?.[col + 1] === player &&
          grid[row + 2]?.[col + 2] === player &&
          grid[row + 3]?.[col + 3] === player) ||
        (grid[row][col] === player &&
          grid[row + 1]?.[col - 1] === player &&
          grid[row + 2]?.[col - 2] === player &&
          grid[row + 3]?.[col - 3] === player)
      ) {
        return true;
      }
    }
  }
  return false;
}

function findWinningMove(grid: (string | null)[][], player: string): number | null {
  for (let col = 0; col < grid[0].length; col++) {
    for (let row = grid.length - 1; row >= 0; row--) {
      if (grid[row][col] === null) {
        grid[row][col] = player;
        if (checkWin(grid, player)) {
          grid[row][col] = null;
          return col;
        }
        grid[row][col] = null;
        break;
      }
    }
  }

  return null;
}

export async function NextMove(grid: (string | null)[][]): Promise<number | null> {
  if (!grid) {
    throw new Error('No grid provided');
  }

  try {
    const move = findBestMove(grid);
    console.log(move);
    return move;
  } catch (error) {
    console.error(error);
    throw error;
  }
}