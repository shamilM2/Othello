// Define global variables
let starter;
const depth = 5;
let board; // variable to hold the game board as a 2D array
let currentPlayer = 1; // variable to keep track of the current player
let aiPlayer = 2; // assuming that the AI is always the second player

let boardSize = 400; // size of the game board in pixels
let cellSize = boardSize / 8; // size of each cell in the game board in pixels
let startX; // x-coordinate of the starting position of the game board
let startY; // y-coordinate of the starting position of the game board

let player1Score = 2; // initial score
let player2Score = 2; // initial score

// Add event listeners to the buttons
const chooseStarterBtn = document.getElementById("choose-starter-btn"); // select the "choose starter" button element by its id
chooseStarterBtn.addEventListener("click", chooseStarter); // add a click event listener to the button that calls the "chooseStarter" function

let scoreboard = document.createElement("div"); // create a new div element to hold the scoreboard
scoreboard.id = "scoreboard"; // set the id of the new div to "scoreboard"
document.body.appendChild(scoreboard); // append the new scoreboard div element to the body of the HTML document

function chooseStarter() {
  const choice = confirm(
    // prompt the user to choose who starts the game
    "Press 'OK' if you want to start the game, or press 'Cancel' if you want computer to start"
  );

  if (choice == true) {
    // if the user chooses to start the game
    starter = "human"; // set the starter to "human"
  } else {
    // if the user chooses the computer to start
    starter = "computer"; // set the starter to "computer"
    currentPlayer = aiPlayer; // set the current player to be the AI player
  }
  newGame(); // start a new game
}

// Start a new game
function newGame() {
  setup(); // call the setup function to initialize the game board and pieces
  loop(); // start the game loop
}

function computerMove() {
  if (isBoardEmpty(board)) {
    // if the board is empty, choose a random corner cell to start with
    const corners = [
      { row: 0, col: 0 },
      { row: 0, col: 7 },
      { row: 7, col: 0 },
      { row: 7, col: 7 },
    ];
    const randomCorner = corners[Math.floor(Math.random() * corners.length)]; // select a random corner cell
    handleMove(randomCorner.row, randomCorner.col); // make the move at the selected corner cell
  } else {
    // if the board is not empty, use the minimax algorithm to choose the best move
    const bestMove = getBestMove(board, depth, aiPlayer); // get the best move from the minimax algorithm
    handleMove(bestMove.row, bestMove.col); // make the best move on the board
  }
}

/////////////////////////// ScoreBoard

function updateScore() {
  // update the scores for player 1 and player 2
  player1Score = board
    .flat()
    .reduce((acc, val) => acc + (val === 1 ? 1 : 0), 0);
  player2Score = board
    .flat()
    .reduce((acc, val) => acc + (val === 2 ? 1 : 0), 0);
}

//////////////////////////////////////

// Set up canvas and board
function setup() {
  createCanvas(500, 500); // create a canvas of size 500x500 pixels
  background(100, 150, 200); // set the background color to a light blue
  strokeWeight(2); // set the stroke weight for drawing shapes to 2 pixels
  startX = (width - boardSize) / 2; // calculate the starting x-coordinate of the game board to center it horizontally
  startY = (height - boardSize) / 2; // calculate the starting y-coordinate of the game board to center it vertically
  createBoard(); // create the game board as a 2D array
  drawBoard(); // draw the game board on the canvas
}

// Draw the board
function drawBoard() {
  // Loop through each row of the board
  for (let row = 0; row < 8; row++) {
    // Loop through each column of the board
    for (let col = 0; col < 8; col++) {
      // Calculate the x and y coordinates of the current cell
      let x = startX + col * cellSize;
      let y = startY + row * cellSize;
      // Determine the color to use for the current cell based on its value
      let color =
        board[row][col] === 0
          ? [100, 200, 100] // If the cell is empty, use a light green color
          : board[row][col] === 1
          ? [255] // If the cell is occupied by player 1, use white color
          : [0]; // If the cell is occupied by player 2, use black color
      // Fill the cell with the determined color
      fill(...color);
      // If the cell is occupied by a player, draw a circle in the center of the cell
      if (board[row][col] !== 0) {
        ellipse(x + cellSize / 2, y + cellSize / 2, cellSize * 0.8);
      }
      // Draw a rectangle to represent the current cell
      rect(x, y, cellSize, cellSize);
    }
  }
}

// Create the board as a 2D array
function createBoard() {
  board = new Array(8); // create an empty array with 8 elements
  for (let i = 0; i < board.length; i++) {
    board[i] = new Array(8).fill(0); // fill each element with a new array of 8 elements, all initialized to 0
  }
  board[3][3] = 1; // set the initial positions of player 1's pieces
  board[3][4] = 2;
  board[4][3] = 2; // set the initial positions of player 2's pieces
  board[4][4] = 1;
}

// Handle the event when the mouse is clicked on the canvas
function mouseClicked() {
  // Check if the mouse is clicked inside the board
  if (
    mouseX < startX ||
    mouseX > startX + boardSize ||
    mouseY < startY ||
    mouseY > startY + boardSize
  ) {
    return; // if not, return without doing anything
  }
  // Calculate the corresponding row and column for the clicked cell
  let row = floor((mouseY - startY) / cellSize);
  let col = floor((mouseX - startX) / cellSize);
  // Call the handleMove function to handle the move
  handleMove(row, col);
}

// Function to flip opponent's pieces
function flipOpponentPieces(row, col) {
  // Define the opponent's player number
  let opponentPlayer = currentPlayer === 1 ? 2 : 1;
  // Define arrays to hold the direction vectors for each of the 8 directions on the board
  let directions = [
    [0, -1], // up
    [0, 1], // down
    [-1, 0], // left
    [1, 0], // right
    [-1, -1], // up-left
    [-1, 1], // up-right
    [1, -1], // down-left
    [1, 1], // down-right
  ];
  // Loop through each direction
  for (let direction of directions) {
    let [dx, dy] = direction;
    let flippedPieces = [];
    // Check if there is a line of opponent's pieces in this direction that can be flipped
    let x = col + dx;
    let y = row + dy;
    while (
      x >= 0 &&
      x < 8 &&
      y >= 0 &&
      y < 8 &&
      board[y][x] === opponentPlayer
    ) {
      flippedPieces.push([y, x]); // Add the opponent's piece to the flipped pieces array
      x += dx; // Move to the next cell in this direction
      y += dy;
    }
    if (x >= 0 && x < 8 && y >= 0 && y < 8 && board[y][x] === currentPlayer) {
      // If we've reached a cell with one of the current player's pieces, flip the opponent's pieces in this direction
      for (let [flipRow, flipCol] of flippedPieces) {
        board[flipRow][flipCol] = currentPlayer; // Set the current player's number on the opponent's piece
      }
    }
  }
}

// Function to check if the board is full
function isBoardFull() {
  // Loop through each cell of the board
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      // If any cell is empty, return false
      if (board[row][col] === 0) {
        return false;
      }
    }
  }
  // If all cells are occupied, return true
  return true;
}

// Function to create a deep copy of the board
function copyBoard(board) {
  // Use the map() method to create a new array with the same values as the original
  // Use slice() to create a copy of each row to ensure that the arrays are not linked
  return board.map((row) => row.slice());
}

// Function to find the best move using the minimax algorithm
function getBestMove(board, depth, maximizingPlayer) {
  // Initialize the best score and best move
  let bestScore = -Infinity;
  let bestMove;

  // Loop through each cell of the board
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      // If the cell is empty
      if (board[row][col] === 0) {
        // Check if the move will flip any opponent pieces
        if (
          willFlipOpponentPieces(board, row, col, maximizingPlayer) !== true
        ) {
          continue; // if not, skip to the next cell
        }
        // Make a new copy of the board with the potential move
        let newBoard = copyBoard(board);
        newBoard[row][col] = maximizingPlayer;
        // Calculate the score using the minimax algorithm with alpha-beta pruning
        let score = minimax(
          newBoard,
          depth - 1,
          -Infinity,
          Infinity,
          !maximizingPlayer
        )[0];
        // If the score is better than the previous best score, update the best score and best move
        if (score > bestScore) {
          bestScore = score;
          bestMove = { row, col };
        }
      }
    }
  }

  // Return the best move
  return bestMove;
}

// This function handles the move made by the player or the AI
function handleMove(row, col) {
  // Check if the cell is empty
  if (board[row][col] !== 0) {
    return; // If not, return without doing anything
  }
  // Check if any opponent's pieces can be flipped by the move
  if (willFlipOpponentPieces(board, row, col, currentPlayer) !== true) {
    return; // If not, return without doing anything
  }

  // Mark the cell with the current player's mark
  board[row][col] = currentPlayer;
  // Flip the opponent's pieces
  flipOpponentPieces(row, col);
  // Check for the win condition
  if (isBoardFull()) {
    // Calculate the scores of player 1 and player 2
    let player1Score = 0;
    let player2Score = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === 1) {
          player1Score++;
        } else if (board[row][col] === 2) {
          player2Score++;
        }
      }
    }
    // Declare the winner or the tie
    if (player1Score > player2Score) {
      window.alert("Player 1 wins!");
    } else if (player2Score > player1Score) {
      window.alert("Player 2 wins!");
    } else {
      window.alert("It's a tie!");
    }
    // Update the score and end the game
    updateScore(player1Score, player2Score);
    return;
  }

  // Switch to the next player
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  // Check if it's the AI player's turn
  if (currentPlayer === aiPlayer) {
    // Call the minimax function to determine the AI player's move
    let bestMove = getBestMove(board, depth, aiPlayer);
    // Mark the cell with the AI player's mark
    board[bestMove.row][bestMove.col] = aiPlayer;
    // Flip the opponent's pieces
    flipOpponentPieces(bestMove.row, bestMove.col);
    // Check for the win condition
    if (isBoardFull()) {
      // Calculate the scores of player 1 and player 2
      let player1Score = 0;
      let player2Score = 0;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (board[row][col] === 1) {
            player1Score++;
          } else if (board[row][col] === 2) {
            player2Score++;
          }
        }
      }
      // Declare the winner or the tie
      if (player1Score > player2Score) {
        window.alert("Player 1 wins!");
      } else if (player2Score > player1Score) {
        window.alert("Player 2 wins!");
      } else {
        window.alert("It's a tie!");
      }
      // Update the score and end the game
      updateScore(player1Score, player2Score);
      return;
    }
    // Switch back to the human player
    currentPlayer = currentPlayer === 1 ? 2 : 1;
  }
  // Redraw the board to reflect the changes
  drawBoard();
  // Update the score
  updateScore();
  // Update the scoreboard
  let scoreboardText = `Player 1: ${player1Score} | Player 2: ${player2Score}`;
  scoreboard.textContent = scoreboardText;
}

// This function determines if the current state of the board is a terminal state (i.e. the game is over)
function isTerminalNode(board) {
  // Check if there's a winner for player "X"
  if (checkWinner(board, "X")) {
    return true;
  }
  // Check if there's a winner for player "O"
  if (checkWinner(board, "O")) {
    return true;
  }
  // Check if it's a draw, i.e. if every cell of the board is filled with a move
  if (board.every((cell) => cell !== null)) {
    return true;
  }
  // If none of the above conditions are met, the game is not over yet
  return false;
}

// This function checks if there's a winner for the current state of the board
function checkWinner(board) {
  // Define the possible winning positions on the board
  const winningPositions = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Check each of the winning positions to see if they are all occupied by the same player's moves
  for (let positions of winningPositions) {
    const [a, b, c] = positions;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // return the winner's symbol if a winning position is found
    }
  }

  // If the board is completely filled and no winner was found, return "tie"
  if (board.every((square) => square !== null)) {
    return "tie";
  }

  // If neither a winner nor a tie was found, return null
  return null;
}

function minimax(board, depth, alpha, beta, maximizingPlayer) {
  // If we've reached the maximum depth or the game is over, return the score and null for the player
  if (depth === 0 || isTerminalNode(board)) {
    return [getScore(board, maximizingPlayer), null];
  }

  // Initialize the best move and score based on whether we're maximizing or minimizing
  let bestMove = null;
  let bestScore = maximizingPlayer ? -Infinity : Infinity;

  // Loop over each valid move on the board
  for (let move of getValidMoves(board, maximizingPlayer)) {
    // Make a new board with the current move
    let newBoard = makeMove(board, move, maximizingPlayer);
    // Recursively call minimax on the new board with a lower depth and opposite player
    let score = minimax(newBoard, depth - 1, alpha, beta, !maximizingPlayer)[0];

    // Update the best move and score if necessary
    if (maximizingPlayer && score > bestScore) {
      bestScore = score;
      bestMove = move;
    } else if (!maximizingPlayer && score < bestScore) {
      bestScore = score;
      bestMove = move;
    }

    // Update alpha or beta based on whether we're maximizing or minimizing
    if (maximizingPlayer) {
      alpha = Math.max(alpha, score);
    } else {
      beta = Math.min(beta, score);
    }

    // If beta is less than or equal to alpha, we can break out of the loop
    if (alpha >= beta) {
      break;
    }
  }

  // Return the best score and move
  return [bestScore, bestMove];
}

function willFlipOpponentPieces(board, row, col, currentPlayer) {
  // Define the opponent's player number
  let opponentPlayer = currentPlayer === 1 ? 2 : 1;
  // Define arrays to hold the direction vectors for each of the 8 directions on the board
  let directions = [
    [0, -1], // up
    [0, 1], // down
    [-1, 0], // left
    [1, 0], // right
    [-1, -1], // up-left
    [-1, 1], // up-right
    [1, -1], // down-left
    [1, 1], // down-right
  ];
  // Loop through each direction
  for (let direction of directions) {
    let [dx, dy] = direction;
    let flippedPieces = [];
    // Check if there is a line of opponent's pieces in this direction that can be flipped
    let x = col + dx;
    let y = row + dy;
    while (
      x >= 0 &&
      x < 8 &&
      y >= 0 &&
      y < 8 &&
      board[y][x] === opponentPlayer
    ) {
      flippedPieces.push([y, x]);
      x += dx;
      y += dy;
    }
    if (
      x >= 0 &&
      x < 8 &&
      y >= 0 &&
      y < 8 &&
      board[y][x] === currentPlayer &&
      flippedPieces.length > 0
    ) {
      // If the move flips any of the opponent's pieces in this direction, it's a valid move
      return true;
    }
  }
  return false;
}

function getValidMoves(board, player) {
  const validMoves = [];
  // Loop through each cell of the board
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      // If the cell is empty, check if it's a valid move for the player
      if (board[i][j] === 0) {
        if (
          willFlipOpponentPieces(board, board.row, board.col, player) !== true
        ) {
          validMoves.push([i, j]); // if not, skip to the next cell
        }
      }
    }
  }

  return validMoves;
}

function makeMove(board, move, player) {
  let [x, y] = move; // Get the row and column of the move from the move array
  board[x][y] = player; // Update the board to reflect the new move
  let otherPlayer = player === 1 ? 2 : 1; // Determine the other player's number
  let directions = [
    // Define the 8 direction vectors for the board
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  for (let i = 0; i < directions.length; i++) {
    // Loop through each direction
    let [dx, dy] = directions[i]; // Get the direction vector
    let r = x + dx; // Set the initial row to the move's row plus the direction's row component
    let c = y + dy; // Set the initial column to the move's column plus the direction's column component
    let flipped = []; // Define an array to hold the flipped pieces
    while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === otherPlayer) {
      // Check if the neighboring cell is the other player's piece
      flipped.push([r, c]); // Add the neighboring cell to the flipped pieces array
      r += dx; // Move to the next cell in the direction
      c += dy;
    }
    if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === player) {
      // Check if the next cell in the direction is the current player's piece
      for (let j = 0; j < flipped.length; j++) {
        // Loop through the flipped pieces
        let [r2, c2] = flipped[j]; // Get the row and column of the flipped piece
        board[r2][c2] = player; // Update the board to reflect the flipped piece
      }
    }
  }
  return board; // Return the updated board
}

function getScore(board, player) {
  let score = 0;

  // Define the weights for the different squares on the board
  const weights = [
    [100, -20, 10, 5, 5, 10, -20, 100],
    [-20, -50, -2, -2, -2, -2, -50, -20],
    [10, -2, 1, 1, 1, 1, -2, 10],
    [5, -2, 1, 0, 0, 1, -2, 5],
    [5, -2, 1, 0, 0, 1, -2, 5],
    [10, -2, 1, 1, 1, 1, -2, 10],
    [-20, -50, -2, -2, -2, -2, -50, -20],
    [100, -20, 10, 5, 5, 10, -20, 100],
  ];

  // Count the number of corners owned by the player
  let cornerCount = getCornerCount(board, player);

  // Count the number of opponent pieces that are directly adjacent to the player's pieces
  let opponentCount = getOpponent(board, player);

  // Calculate the mobility of the player (i.e. number of valid moves)
  let playerMoves = getValidMoves(board, player).length;

  // Calculate the mobility of the opponent
  let opponentMoves = getValidMoves(board, !player).length;

  // Iterate over each square on the board
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === player) {
        // If the square belongs to the player, add its weight to the score
        score += weights[i][j];
      } else if (board[i][j] !== 0) {
        // If the square belongs to the opponent, subtract its weight from the score
        score -= weights[i][j];
      }
    }
  }

  // Weight the corner count, opponent count, and mobility counts
  score += cornerCount * 500;
  score -= opponentCount * 50;
  score += playerMoves * 10;
  score -= opponentMoves * 5;

  return score;
}

// Helper function to count the number of corners owned by the player
function getCornerCount(board, player) {
  let count = 0;
  if (board[0][0] === player) count++;
  if (board[0][7] === player) count++;
  if (board[7][0] === player) count++;
  if (board[7][7] === player) count++;
  return count;
}

// Helper function to determine the opponent of the current player
function getOpponent(player) {
  return player === 1 ? 2 : 1;
}
