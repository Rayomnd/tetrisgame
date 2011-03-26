goog.provide('tetris.Board');

tetris.Board.WIDTH = 10;
tetris.Board.HEIGHT = 20;

tetris.Board.isBlocked = function(x, y) {
	if(x < 0  || x >= tetris.Board.WIDTH || y < 0 || y >= tetris.Board.HEIGHT || tetris.blocks[y*tetris.Board.WIDTH+x] != undefined) {
		return true;
	} else {
		return false;
	}
}

tetris.Board.checkMove = function(tetromino, buffer_ctx) {
	var pos, i, isValid, x, y;
	var buffer_pixel, buffer_data;
	for(i = 0; i < 4; i++) {
		pos = tetris.Piece.PATTERNS[tetromino.pattern][tetromino.rotation][i];
		x = pos[0] / 20 + tetromino.x / 20; // check
		y = pos[1] / 20 + tetromino.y / 20;
		if (tetris.Board.isBlocked(x, y)) {
			return 0;
		};
	};
	return 1;
}

tetris.Board.drawBoard = function(ctx, buffer, buffer_ctx) {
	buffer_ctx.beginPath();
	buffer_ctx.strokeStyle="red";
	buffer_ctx.strokeRect(0,0,200,400);
	buffer_ctx.closePath();
	ctx.drawImage(buffer, 0, 0);
}

tetris.Board.clearFilledRows = function(ctx, buffer, buffer_ctx, tetromino) {
	var row, col, row2, nextLevel;
	nextLevel = 1;
	var fillRows = 0;
	for(row = 20; row >=0; ) {
		for(col = 0; col < 10; ++col) {
			if(!tetris.blocks[row*tetris.Board.WIDTH+col]) {
				break;
			};
		};
		if(col == 10) {
			tetris.Score.score += tetris.Level.level * [40,100,300,1200][fillRows];
			fillRows++;
			for(row2 = row - 1; row2 >= 0; row2--) {
				for(col = 0; col < 10; ++col) {
					tetris.blocks[(row2+1)*tetris.Board.WIDTH+col] = tetris.blocks[row2*tetris.Board.WIDTH+col];
				};
			};
			
			tetris.Piece.redraw(ctx, buffer, buffer_ctx);
			tetris.Board.updateScore();
		} else {
			row--;
		};
	};
	tetris.rowsCleared.num = tetris.rowsCleared.num + fillRows;
	nextLevel = 1 + Math.floor(tetris.rowsCleared.num/4);
	tetris.Level.level = nextLevel;
	tetris.Board.updateLevel();
	tetris.Board.updateSpeed();
}

tetris.Board.showNextPiece = function() {
	var x, y;
	var pos, i;
	preview_ctx.clearRect(0,0,80,80);
	
	tetris.Piece.startTetromino(nextTetromino);
	x = nextTetromino.x;
	y = nextTetromino.y;
	nextTetromino.x = 0;
	nextTetromino.y = 0;

	preview_ctx.fillStyle="black";
	for(i = 0; i < 4; i++) {
		pos = tetris.Piece.PATTERNS[nextTetromino.pattern][nextTetromino.rotation][i];
		preview_ctx.fillRect(pos[0] + nextTetromino.x, pos[1] + nextTetromino.y, 20, 20);
	}
	
	// preview_ctx.beginPath();
	// preview_ctx.strokeStyle="red";
	// preview_ctx.strokeRect(0,0,80,80);
	// preview_ctx.closePath();
	
	// buffer_ctx.clearRect(0, 0, 80, 80);
	nextTetromino.x = x;
	nextTetromino.y = y;
}

tetris.Board.isEnd = function() {
	var col;
	for(col = 0; col < 10 && tetris.isEnd.end == false; col++) {
		if(tetris.Board.isBlocked(col, 0)) {
			// storage the scores and rows completed in the local storage
			tetris.Score.allScores.push(tetris.Score.score);
			// tetris.rowsCleared.completedRows.push(tetris.rowsCleared.num);
			tetris.localStorage.store(); // store the score
			tetris.localStorage.list(); // list the scroes in the aside
			clearInterval(tetris.intervalInt.i);
			tetris.isEnd.end = true;
		};
	};
}

tetris.Board.updateScore = function() {
		gameScore.innerHTML = tetris.Score.score;
}

tetris.Board.updateLevel = function() {
	gameLevel.innerHTML = tetris.Level.level;
}

tetris.Board.updateSpeed = function() {
	var speedup = 100;
	var temp = 0;
	if(tetris.Level.level >= 5) {
		speedup = 25;
		tetris.gameSpeed.num = 200 - (tetris.Level.level - 4) * speedup;
	} else {
		tetris.gameSpeed.num = 500 - (tetris.Level.level - 1) * speedup;
	};
	gameSpeed.innerHTML = tetris.gameSpeed.num;
	clearInterval(tetris.intervalInt.i);
	tetris.intervalInt.i = setInterval("tetris.Piece.move(ctx, buffer, buffer_ctx, tetromino)", tetris.gameSpeed.num);
}

tetris.Board.key = function() {
	document.onkeydown = function(event) {
	  var keyCode; 

	  if(event == null)
	  {
	    keyCode = window.event.keyCode; 
	  } else {
	    keyCode = event.keyCode; 
	  };

	  switch(keyCode)
	  {
	    // left 
	    case 37:
	      // action when pressing left key
				// tetris.Piece.changMove = function(ctx, buffer, buffer_ctx, tetromino, dx, dy);
				tetris.Piece.changMove(ctx, buffer, buffer_ctx, tetromino, -20, 0);
	      break;
	    // up 
	    case 38:
	    // action when pressing up key
				tetris.Piece.rotation(ctx, buffer, buffer_ctx, tetromino);
	      break; 

	    // right 
	    case 39:
	    // action when pressing right key
				tetris.Piece.changMove(ctx, buffer, buffer_ctx, tetromino, 20, 0);
	      break; 

	    // down
	    case 40:
	    // action when pressing down key
				tetris.Piece.changMove(ctx, buffer, buffer_ctx, tetromino, 0, 20);
	      break; 

	    default: 
	      break; 
	  }; 
	};
}