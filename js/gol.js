/*
 * This file contains all the JavaScript necessary to run this game of life app
 * author: James Miltenberger 
 */

/* newGame - Initializes a new game of life
 * @param  {Number} rows        - 
 * @param  {Number} cols        - 
 * @param  {Number} delay       - delay in milliseconds
 * @return {[type]}             - 
 */
var debug = false;

var newGame = function(rows, cols, delay, canvasDiv) {
	return {
		matrix: [],
		rows: rows,
		cols: cols,
		delay: delay,
		loop: false,
		canvas: document.getElementById(canvasDiv),
		colWidth: canvas.width / cols,
		rowHeight: canvas.height / rows,
		init: function () {
			for(var i = 0; i < this.rows; i++) {
				this.matrix.push(new Array(this.cols));
				for(var j = 0; j < this.cols; j++) this.matrix[i][j] = false;
			}
		},
		setMatrixValues: function(x, y) {
			if(debug) console.log(Math.floor(x/this.colWidth), ", ", Math.floor(y/this.rowHeight));
			x = Math.floor(x/this.colWidth);
			y = Math.floor(y/this.rowHeight);
			if(x < this.rows && y < this.cols)
				this.matrix[x][y] = !this.matrix[x][y];
		},
		startAnimation: function() {
			this.loop = setInterval(function() {
				game.nextGeneration();
			}, this.delay);
		},
		pauseAnimation: function() {
			clearInterval(this.loop);
		},
		nextGeneration: function() {
			//1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.
			//2. Any live cell with two or three live neighbours lives on to the next generation.
			//3. Any live cell with more than three live neighbours dies, as if by overcrowding.
			//4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
			var tempMatrix = [];
			for(var i = 0; i < this.rows; i++) {
				tempMatrix.push(new Array(this.cols));
				for(var j = 0; j < this.cols; j++) tempMatrix[i][j] = this.matrix[i][j];
			}

			for(var i = 1; i < this.cols-1; i++) {
				for(var j = 1; j < this.rows-1; j++) {
					var livingNeighbours = 0;
					livingNeighbours += this.matrix[i-1][j-1];
					livingNeighbours += this.matrix[i-1][j];
					livingNeighbours += this.matrix[i-1][j+1];
					livingNeighbours += this.matrix[i][j-1];
					livingNeighbours += this.matrix[i][j+1];
					livingNeighbours += this.matrix[i+1][j-1];
					livingNeighbours += this.matrix[i+1][j];
					livingNeighbours += this.matrix[i+1][j+1];
					
					if(this.matrix[i][j] == true) {
						if(livingNeighbours > 3 || livingNeighbours < 2)
							tempMatrix[i][j] = false;
					}
					else {
						if(livingNeighbours == 3)
							tempMatrix[i][j] = true;
					}
				}
			}
			this.matrix = tempMatrix.slice();
			this.updateCanvas();
		},
		updateCanvas: function() {
			for(var i = 0; i < this.cols; i++) {
				for(var j = 0; j < this.rows; j++) {
					var ctx = this.canvas.getContext('2d');
					if(this.matrix[i][j]) ctx.fillStyle = 'black';
					else ctx.fillStyle = 'white';
					ctx.fillRect(i*this.colWidth, j*this.rowHeight, (i+1)*this.colWidth, (j+1)*this.rowHeight);
				}
			}
		},
		loadMatrix: function() {
			//Code to load a matrix in
		}
	}
}
var game = newGame(50, 50, 50, "canvas");
game.init();

$("#" + game.canvas.id).click(function(evt) {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');
	var rect = canvas.getBoundingClientRect();
	var x = Math.floor(evt.clientX - rect.left-3);
	var y = Math.floor(evt.clientY - rect.top-3);
	if(x >= 0 && y >= 0) game.setMatrixValues(x, y);
	game.updateCanvas();
});

$("#play").click(function() {
	if($(this).text() == "Play") {
		game.startAnimation();
		$(this).html("Pause");
	} else {
		game.pauseAnimation();
		$(this).html("Play");
	}
});