const timeDelta = 100;
let board;
let canvas;
let ctx;

class Board {
      constructor(canvas, rows, cols, users, emojis = ['X', 'O']) {
	    this.canvas = canvas;
	    this.rows = rows;
	    this.cols = cols;
	    this.turn = 0;

	    this.players = new Array(2).fill(0).map(player => Object({
		  user: users.pop(),
		  emoji: emojis.pop(),
	    }));

	    this.board = new Array(rows).fill(0).map((e, i) => new Array(cols).fill(''));
	    // this.print();
      }

      checkGame(board = this.board) {

	    // Check for win
	    const win = Boolean(
		  board.some(row => row.every(emoji => emoji === this.players[this.turn].emoji)) // Check rows
		  ||
		  board.map((row, i, boardCopy) => boardCopy.map((col, j) => boardCopy[j][i])).some(column => column.every(emoji => emoji === this.players[this.turn].emoji)) // Check cols
		  ||
		  board.map((row, i) => row[i]).every(emoji => emoji === this.players[this.turn].emoji) // Check diagonals
		  ||
		  board.map((row, i, boardCopy) => row[boardCopy.length - i - 1]).every(emoji => emoji === this.players[this.turn].emoji) // Check reverse diagonal
	    );

	    if (win)
		  return 'win';

	    // Check for draw
	    const draw = Boolean(
		  board.every(row => row.every(Boolean))
	    );

	    if (draw)
		  return 'draw';

      }

      update(canvas = this.canvas) {
	    this.dw = canvas.width / 3;
	    this.dh = canvas.height / 3;
	    this.show(canvas);
      }

      show(canvas = this.canvas) {
	    const ctx = canvas.getContext('2d');

	    // Draw lines
	    ctx.strokeStyle = 'white';
	    ctx.lineWidth = 5;
	    for (let i = 1; i < this.rows; i++) {
		  ctx.beginPath();
		  ctx.moveTo(0, i * this.dh);
		  ctx.lineTo(canvas.width, i * this.dh);
		  ctx.stroke();
	    }
	    for (let j = 1; j < this.cols; j++) {
		  ctx.beginPath();
		  ctx.moveTo(j * this.dw, 0);
		  ctx.lineTo(j * this.dw, canvas.height);
		  ctx.stroke();
	    }

	    const offset = 0.1;
	    for (let i = 0; i < this.rows; i++)
		  for (let j = 0; j < this.cols; j++) {
			if (this.board[i][j] === 'X') {
			      ctx.beginPath();
			      ctx.moveTo((j + offset) * this.dw, (i + offset) * this.dh);
			      ctx.lineTo((j + 1 - offset) * this.dw, (i + 1 - offset) * this.dh);
			      ctx.stroke();
			      ctx.beginPath();
			      ctx.moveTo((j + 1 - offset) * this.dw, (i + offset) * this.dh);
			      ctx.lineTo((j + offset) * this.dw, (i + 1 - offset) * this.dh);
			      ctx.stroke();
			} else if (this.board[i][j] === 'O') {
			      ctx.beginPath();
			      ctx.arc((j + 0.5) * this.dw, (i + 0.5) * this.dh, (1 - offset) * this.dw * 0.5, 0, 2 * Math.PI);
			      ctx.stroke();
			}
		  }
      }

      play(i, j) {
	    this.board[i][j] = this.players[this.turn].emoji;
	    this.update();
	    this.print();
	    const gameStatus = this.checkGame();
	    if (gameStatus === 'win') {
		  console.log('win');
		  return;
	    }
	    else if (gameStatus === 'draw') {
		  console.log('Tie!!!');
		  return;
	    }


	    this.turn = (this.turn + 1) % this.players.length;
	    if (this.players[this.turn].user === 'ai')
		  return this.tttAI();
      }

      click({clientX, clientY}) {
	    // this.dw = this.canvas.width / 3;
	    // this.dh = this.canvas.height / 3;

	    const choiceI = Math.floor(clientY / this.dh);
	    const choiceJ = Math.floor(clientX / this.dw);
	    this.play(choiceI, choiceJ);
      }

      tttAI() {
	    // Random algorithm
	    const pool = new Array(this.rows * this.cols)
	    .fill(0)
	    .map((e, index_) => Object({i: Math.floor(index_ / this.rows), j: index_ % this.cols, value: this.board[Math.floor(index_ / this.rows)][index_ % this.cols]}))
	    .filter(elem => !Boolean(elem.value));
	    const {i: choiceI, j: choiceJ} = pool[Math.floor(Math.random() * pool.length)];

	    // const ai = this.players[(this.turn + 0) % this.players.length].emoji
	    // const human = this.players[(this.turn + 1) % this.players.length].emoji

	    // const scores = {
		  // [ai]: 10,
		  // [human]: -10,
		  // tie: 0
	    // };

	    // const equals3 = (emoji, i_, arr) => emoji === arr[0] && emoji !== '';
	    // const checkWinner = board => {
		  // let winner = null;

		  // // Check rows
		  // board.some(row => { 
			// const rowB = row.every(equals3);
			// if (rowB) winner = row[0];
			// return rowB
		  // });

		  // // Check columns
		  // board.map((row, i, boardCopy) => boardCopy.map((col, j) => boardCopy[j][i])).some(column => {
			// const colB = column.every(equals3)
			// if (colB) winner = column[0];
			// return colB;
		  // });

		  // // Check diagonals
		  // if (board.map((row, i) => row[i]).every(equals3))
			// winner = board[0][0];

		  // // Check for reverse diagonals
		  // if(board.map((row, i, boardCopy) => boardCopy[i][boardCopy.length - i - 1]).every(equals3))
			// winner = board[0][board.length - 1];

		  // // Check for draw
		  // const draw = Boolean(
			// board.map(row1 => row1.map(button => button.value)).every(row1 => row1.every(Boolean))
		  // );

		  // if (winner) return scores[winner];
		  // else if (draw) return scores['tie'];
	    // }

	    // const minimax = (board, depth, isMaximizing)  => {
		  // const result = checkWinner(board);
		  // if (result) 
			// return result;

		  // let bestScore = isMaximizing ? -Infinity : Infinity;
		  // for (let i = 0; i < this.rows; i++) 
			// for (let j = 0; j < this.cols; j++) {
			      // // Is the spot available?
			      // if (board[i][j]) continue
			      // board[i][j] = isMaximizing ? ai : human;
			      // let score = minimax(board, depth + 1, !isMaximizing);
			      // board[i][j] = '';
			      // bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
			// }

		  // return bestScore;
	    // }

	    // let bestScore = -Infinity;
	    // let choiceI, choiceJ;
	    // for (let i = 0; i < this.rows; i++) 
		  // for (let j = 0; j < this.cols; j++) {
			// // Is the spot available?
			// if (this.board[i][j]) continue
			// this.board[i][j] = this.players[this.turn].emoji;
			// let score = minimax(this.board, 0, false);
			// this.board[i][j] = '';
			// if (score > bestScore) {
			      // bestScore = score;
			      // choiceI = i;
			      // choiceJ = j;
			// }
		  // }

	    this.play(choiceI, choiceJ);
      }

      print() {
	    console.table(this.board);
      }
}

window.onload = () => {
      const submitButton = document.getElementById('submit');
      submitButton.addEventListener('click', setup);
}

const setup = () => {
      document.body.innerHTML = '<canvas></canvas>';
      canvas = document.querySelector('canvas');
      board = new Board(canvas, 3, 3, ['human', 'ai']);
      canvas.addEventListener('click', event => board.click(event));
      draw();
}

const draw = () => {
      const width = Math.min(window.innerWidth, window.innerHeight);
      canvas.width = width;
      canvas.height = width;
      board.update();
      setTimeout(draw, timeDelta);
}
