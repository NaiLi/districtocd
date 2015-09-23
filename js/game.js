	
var tileSize = 40;
var cols = 6;
var rows = 10;
var rowIndex = rows;

var numberOfTypes = 4;
var groundTiles;
var tileArray = [];
var steppedTilesRight = [];
var steppedTilesLeft = [];
var speed = 1;
var steps = 0;

var colors = {
					0:0x32687A,
					1:0x68327A,
					2:0x7A4432,
					3:0x327A75
				}

var Game = {

	preload : function() {
		game.load.image('tile', 'assets/tile.png');
		game.load.image('tile_wide', 'assets/tile-wide.png');
		game.load.image('gradient', 'assets/gradient.png');
	},

	create : function () {
		groundTiles = game.add.group();

		// Set no steps taken
		for(var i=0; i < numberOfTypes; i++) {
			steppedTiles[i] = 0;
		}

		// Add all tiles
		for(; rowIndex >= 0; rowIndex--) {
			//tileArray[i]=[];
			this.newRow(rowIndex);
		}
		
		game.add.sprite(0, 0, 'gradient');

		game.input.onDown.add(this.stepClicked, this);
		//game.time.events.loop(speed, this.newRow(0)); 
	},

	update : function() {
		groundTiles.y += 1 * speed;
		
		if(groundTiles.y%tileSize == 0) {
			this.newRow(rowIndex--);
		}
	},

	stepClicked : function(tile, pointer) {

		console.log(tile.targetObject.sprite.name);
		tile.targetObject.sprite.alpha = 0.7;

	},

	takeStep : function (name) {

		steps++;

		if(steps%2 == 0) { 						// If right foot
			steppedTilesRight[name]++;
		} else {											// If left foot
			steppedTilesLeft[name]++;
		}
	},

	addResultTile : function(name) {

	},

	newRow : function(i) {
		for(var j=0; j < cols; j++) {
			var randomValue = Math.floor(Math.random()*numberOfTypes);
			var newTile = game.add.sprite(j*tileSize, (i-1)*tileSize, 'tile');
			newTile.inputEnabled = true;
			newTile.input.pixelPerfectClick = true;
			newTile.tint = colors[randomValue];
			newTile.name = randomValue;
			groundTiles.add(newTile);
			//newTile.events.onInputDown.add(this.stepClicked, this);
			//tileArray[i][j]=newTile;
		}
	}
};
