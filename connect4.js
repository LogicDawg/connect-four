/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
let playerLabel = document.querySelector('#currentplayer');
/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  for(let i = 0; i < HEIGHT;i++){
    board.push(Array.from({length : WIDTH}));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  playerLabel.innerHTML = `Player ${currPlayer} turn`;
  playerLabel.classList.toggle(`player${currPlayer}`);
  const htmlBoard = document.getElementById("board");
  // Create a top element to click on to drop piece
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  // Create data cell for each game piece based on width at the top, place to drop the game piece
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  //Create data cell grid based on hieght and width, this is where game pieces will go.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      cell.classList.add('.cell');
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  
  let column = [];
  //populate column array with cells, using x as the colummn
    for(let i = HEIGHT-1; i >=0;i--){
      let cell = document.getElementById(`${i}-${x}`);
      //check if the colume has a player piece in it
      if(cell.children.length < 1){
        column.push(i);
        }
  }
  // find the highest number row that returns to y cordinate for player piece.
  if(column.length > 0){
    return Math.max(...column);
  }
  else{
    return null;
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  let piece = document.createElement("div");
  const cell = document.getElementById(`${y}-${x}`);
  piece.className = 'piece'
  if (currPlayer === 1) {
    piece.classList.toggle("p1");
  }else{
    piece.classList.toggle(
      'p2');
  }
  cell.append(piece);
  
}

/** endGame: announce game end */

function endGame(msg) {
 alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  var x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!');
  }

  // switch players
    playerLabel.classList.toggle(`player${currPlayer}`);
    currPlayer = currPlayer === 1 ? 2 : 1;
    playerLabel.classList.toggle(`player${currPlayer}`);
    playerLabel.innerHTML = `Player ${currPlayer} turn`;
    

}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }
  //Looping through all cells to see if same player pieces exist in winning directions
  // directions include horizontal,vertical,diagonal right and diagonal left.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}


makeBoard();
makeHtmlBoard();
