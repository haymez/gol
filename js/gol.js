/*
 * This file contains all the JavaScript necessary to run this game of life app
 * Author: James Miltenberger 
 */

/* newGame - Data model for gol implimentation
 * @param  {Number} rows        - 
 * @param  {Number} cols        - 
 * @param  {Number} delay       - delay in milliseconds
 * @return {[type]}             - 
 */
var newGame = function(rows, cols, delay, canvasId, playId, clearId) {
	return {
		living: [],
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
			this.bindEvents();
			this.updateCanvas();
		},
		bindEvents: function() {
			this.canvas.on('click', $.proxy(this.setCellValues, this));
			this.playButton.on('click', $.proxy(this.togglePlay, this));
			this.clearButton.on('click', $.proxy(this.clearCanvas, this));
		},
		setCellValues: function(evt) {
			var ctx = this.canvas[0].getContext('2d');
			var rect = this.canvas[0].getBoundingClientRect();
			var x = Math.floor(evt.clientX - rect.left-3);
			var y = Math.floor(evt.clientY - rect.top-3);
			if(x >= 0 && y >= 0) {
				x = Math.floor(x/this.colWidth);
				y = Math.floor(y/this.rowHeight);
				if(x < this.rows && y < this.cols) {
					var index = this.inArray({x:x, y:y}, this.living);
					if(index > -1) {
						this.living.splice(index, 1);
					} else {
						this.living.push({x:x, y:y});
					}
				}
				this.updateCanvas();
			}
		},
		inArray: function(obj, arr) {
			for(var i = 0; i < arr.length; i++) {
				if(obj.x == arr[i].x && obj.y == arr[i].y)
					return i;
			}
			return -1;
		},
		clearCanvas: function() {
			this.living = [];
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
			var checkedAlready = [];
			var tempArray = [];
			for(var i = 0; i < this.living.length; i++) {
				var curr = this.living[i];
				var above = {x:curr.x, y:curr.y+1};
				var below = {x:curr.x, y:curr.y-1};
				var left = {x:curr.x-1, y:curr.y};
				var right = {x:curr.x+1, y:curr.y};
				var topRight = {x:curr.x+1, y:curr.y+1};
				var topLeft = {x:curr.x-1, y:curr.y+1};
				var bottomRight = {x:curr.x+1, y:curr.y-1};
				var bottomLeft = {x:curr.x-1, y:curr.y-1};
				
				if(this.inArray(curr, checkedAlready) == -1) {
					if(this.liveToNextGen(this.findNeighbours(curr), this.inArray(curr, this.living))) {
						if(this.inArray(curr, tempArray) == -1) tempArray.push(curr);
					}
				}
				if(this.inArray(above, checkedAlready) == -1) {
					if(this.liveToNextGen(this.findNeighbours(above), this.inArray(above, this.living))) {
						if(this.inArray(above, tempArray) == -1) tempArray.push(above);
					}
				}
				if(this.inArray(below, checkedAlready) == -1) {
					if(this.liveToNextGen(this.findNeighbours(below), this.inArray(below, this.living))) {
						if(this.inArray(below, tempArray) == -1) tempArray.push(below);
					}
				}
				if(this.inArray(left, checkedAlready) == -1) {
					if(this.liveToNextGen(this.findNeighbours(left), this.inArray(left, this.living))) {
						if(this.inArray(left, tempArray) == -1) tempArray.push(left);
					}
				}
				if(this.inArray(right, checkedAlready) == -1) {
					if(this.liveToNextGen(this.findNeighbours(right), this.inArray(right, this.living))) {
						if(this.inArray(right, tempArray) == -1) tempArray.push(right);
					}
				}
				if(this.inArray(topRight, checkedAlready) == -1) {
					if(this.liveToNextGen(this.findNeighbours(topRight), this.inArray(topRight, this.living))) {
						if(this.inArray(topRight, tempArray) == -1) tempArray.push(topRight);
					}
				}
				if(this.inArray(topLeft, checkedAlready) == -1) {
					if(this.liveToNextGen(this.findNeighbours(topLeft), this.inArray(topLeft, this.living))) {
						if(this.inArray(topLeft, tempArray) == -1) tempArray.push(topLeft);
					}
				}
				if(this.inArray(bottomRight, checkedAlready) == -1) {
					if(this.liveToNextGen(this.findNeighbours(bottomRight), this.inArray(bottomRight, this.living))) {
						if(this.inArray(bottomRight, tempArray) == -1) tempArray.push(bottomRight);
					}
				}
				if(this.inArray(bottomLeft, checkedAlready) == -1) {
					if(this.liveToNextGen(this.findNeighbours(bottomLeft), this.inArray(bottomLeft, this.living))) {
						if(this.inArray(bottomLeft, tempArray) == -1) tempArray.push(bottomLeft);
					}
				}
				checkedAlready.push(curr, above, below, left, right, topLeft, topRight, bottomLeft, bottomRight);
			}
			this.living = tempArray.slice();
			this.currGen++;
			this.updateCanvas();
		},
		liveToNextGen: function(neighbours, index) {
			if(index > -1) {
				if(neighbours > 3 || neighbours < 2) {
					return false;
				}
				else return true;
			}
			else if(neighbours == 3) return true;
			return false;
		},
		findNeighbours: function(coor) {
			var livingNeighbours = 0;
			if(this.inArray({x:coor.x-1, y:coor.y-1}, this.living) > -1) livingNeighbours++;
			if(this.inArray({x:coor.x-1, y:coor.y}, this.living) > -1) livingNeighbours++;
			if(this.inArray({x:coor.x-1, y:coor.y+1}, this.living) > -1) livingNeighbours++;
			if(this.inArray({x:coor.x, y:coor.y-1}, this.living) > -1) livingNeighbours++;
			if(this.inArray({x:coor.x, y:coor.y+1}, this.living) > -1) livingNeighbours++;
			if(this.inArray({x:coor.x+1, y:coor.y-1}, this.living) > -1) livingNeighbours++;
			if(this.inArray({x:coor.x+1, y:coor.y}, this.living) > -1) livingNeighbours++;
			if(this.inArray({x:coor.x+1, y:coor.y+1}, this.living) > -1) livingNeighbours++;
			return livingNeighbours;
		},
		updateCanvas: function() {
			var ctx = this.canvas[0].getContext('2d');
			ctx.clearRect(0, 0, this.canvas[0].width, this.canvas[0].height);
			for(var i = 0; i < this.living.length; i++) {
				var ctx = this.canvas[0].getContext('2d');
				var x = this.living[i].x;
				var y = this.living[i].y;
				ctx.fillStyle = 'black';
				ctx.fillRect(Math.floor(x*this.colWidth), Math.floor(y*this.rowHeight), Math.round(this.colWidth), Math.round(this.rowHeight));
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
				if(this.inArray({x:X,y:Y}, this.living) > -1)
					this.living.splice(this.inArray({x:X,y:Y}, this.living), 1)
				this.loadMatrix(subMatrix, {x: X, y: Y})
				this.canvas.off(".insert");
			}, this));
		},
		loadMatrix: function(subMatrix, offset) {
			for(var i = 0; i < subMatrix.length; i++) {
				var x = subMatrix[i].x+offset.x;
				var y = subMatrix[i].y+offset.y;
				if(this.inArray({x:x, y:y}, this.living == -1))
					this.living.push({x:x, y:y});
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