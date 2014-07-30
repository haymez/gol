/*
 * This file contains all the JavaScript necessary to run this game of life app.
 * Author: James Miltenberger 
 */

/* newGame - Initializes a new game of life
 * @param  {Number} rows        - 
 * @param  {Number} cols        - 
 * @param  {Number} delay       - delay in milliseconds
 * @return {[type]}             - 
 */
var debug = false;

var newGame = function(rows, cols, delay, canvasId, playId, clearId) {
	return {
		matrix: [],
		rows: rows,
		cols: cols,
		delay: delay,
		loop: false,
		canvas: $("#" + canvasId),
		playButton: $("#" + playId),
		clearButton: $("#" + clearId),
		colWidth: canvas.width / cols,
		rowHeight: canvas.height / rows,
		currGen: 0,
		init: function () {
			for(var i = 0; i < this.rows; i++) {
				this.matrix.push(new Array(this.cols));
				for(var j = 0; j < this.cols; j++) this.matrix[i][j] = false;
			}
			this.bindEvents();
			this.updateCanvas();
		},
		bindEvents: function() {
			this.canvas.on('click', $.proxy(this.setMatrixValues, this));
			this.playButton.on('click', $.proxy(this.togglePlay, this));
			this.clearButton.on('click', $.proxy(this.clearCanvas, this));
		},
		setMatrixValues: function(evt) {
			var ctx = this.canvas[0].getContext('2d');
			var rect = this.canvas[0].getBoundingClientRect();
			var x = Math.floor(evt.clientX - rect.left-3);
			var y = Math.floor(evt.clientY - rect.top-3);
			if(x >= 0 && y >= 0) {
				if(debug) console.log(Math.floor(x/this.colWidth), ", ", Math.floor(y/this.rowHeight));
				x = Math.floor(x/this.colWidth);
				y = Math.floor(y/this.rowHeight);
				if(x < this.rows && y < this.cols)
					this.matrix[x][y] = !this.matrix[x][y];
				this.updateCanvas();
			}
		},
		clearCanvas: function() {
			for(var i = 0; i < this.rows; i++) {
				for(var j = 0; j < this.cols; j++) this.matrix[i][j] = false;
			}
			this.pauseAnimation();
			this.playButton.html("Play");
			this.currGen = 0;
			this.updateCanvas();
		},
		togglePlay: function(evt) {
			if(this.playButton.text() == "Play") {
				this.startAnimation();
				this.playButton.html("Pause");
			} else {
				game.pauseAnimation();
				this.playButton.html("Play");
			}
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
			var tempMatrix = [];
			for(var i = 0; i < this.rows; i++) {
				tempMatrix.push(new Array(this.cols));
				for(var j = 0; j < this.cols; j++) tempMatrix[i][j] = this.matrix[i][j];
			}

			for(var i = 0; i < this.cols; i++) {
				for(var j = 0; j < this.rows; j++) {
					var livingNeighbours = 0;
					if(this.matrix[i-1] != null && this.matrix[i-1][j-1] != null) livingNeighbours += this.matrix[i-1][j-1];
					if(this.matrix[i-1] != null) livingNeighbours += this.matrix[i-1][j];
					if(this.matrix[i-1] != null && this.matrix[i-1][j+1] != null) livingNeighbours += this.matrix[i-1][j+1];
					if(this.matrix[i][j-1] != null) livingNeighbours += this.matrix[i][j-1];
					if(this.matrix[i][j+1] != null) livingNeighbours += this.matrix[i][j+1];
					if(this.matrix[i+1] != null && this.matrix[i+1][j-1] != null) livingNeighbours += this.matrix[i+1][j-1];
					if(this.matrix[i+1] != null) livingNeighbours += this.matrix[i+1][j];
					if(this.matrix[i+1] != null && this.matrix[i+1][j+1] != null) livingNeighbours += this.matrix[i+1][j+1];
					
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
			this.currGen++;
			this.updateCanvas();
		},
		updateCanvas: function() {
			for(var i = 0; i < this.cols; i++) {
				for(var j = 0; j < this.rows; j++) {
					var ctx = this.canvas[0].getContext('2d');
					if(this.matrix[i][j]) ctx.fillStyle = 'black';
					else ctx.fillStyle = 'white';
					ctx.fillRect(Math.round(i*this.colWidth), Math.round(j*this.rowHeight), Math.round((i+1)*this.colWidth), Math.round((j+1)*this.rowHeight));
				}
			}
			var ctx = this.canvas[0].getContext('2d');
			ctx.textAlign = 'right';
	        ctx.font = '12pt Calibri';
	        ctx.fillStyle = 'rgba(0,0,0, .5)';
	        //ctx.globalAlpha = .5; //Weird stuff happens when this is uncommented..
	        ctx.fillText("Gen: " + this.currGen, this.canvas[0].width-1, 15);
		},
		insertListener: function(subMatrix) {
			this.canvas.on("click.insert", $.proxy(function(evt) {
				var rect = this.canvas[0].getBoundingClientRect();
				var X = Math.floor(evt.clientX - rect.left - 3);
				var Y = Math.floor(evt.clientY - rect.top - 3);
				X = Math.floor(X/this.colWidth);
				Y = Math.floor(Y/this.rowHeight);
				this.loadMatrix(subMatrix, {x: X, y: Y})
				this.canvas.off(".insert");
			}, this));
		},
		loadMatrix: function(subMatrix, offset) {
			// var xOffset = this.matrix.length - subMatrix.length;
			// var yOffset = this.matrix[0].length - subMatrix[0].length;
			for(var i = offset.x; i < (subMatrix.length + offset.x); i++) {
				for (var j = offset.y; j < (subMatrix[0].length + offset.y); j++) {
					if(this.matrix[i] != null && this.matrix[i][j] != null) {
						this.matrix[i][j] = subMatrix[i - offset.x][j - offset.y];
					}
				}
			}
			this.updateCanvas();
		}
	}
}

var game = newGame(100, 100, 30, "canvas", "play", "clear");
game.init();

$("#glider").click(function() {
	game.insertListener(gliderGun);
})
