
var tileSize = 40;
var cols = 6;
var rows = 10;
var rowIndex = rows;

var score = 0;

var numberOfTypes = 4;
var groundTiles;
var scoreTiles;
var steppedTiles = [];
var noSteppedTiles = [];
var tileCollisionGroup;
var speed = 1;
var steps = 0;
var leftStep; // y coordinates
var rightStep;

var shadow;

var colors = {
					0:0x32687A,
					1:0x68327A,
					2:0x7A4432,
					3:0x327A75
				}

var Game = {

	preload : function() {
		game.load.image('tile', 'assets/tile.png');
		game.load.image('shadow', 'assets/shadow.png');
		game.load.image('tile_wide', 'assets/tile-wide.png');
	},

	create : function () {

		// Physics
		game.physics.startSystem(Phaser.Physics.P2JS);
		tileCollisionGroup = game.physics.p2.createCollisionGroup();
		game.physics.p2.updateBoundsCollisionGroup();
		game.physics.p2.setImpactEvents(true);
		game.physics.p2.gravity.y = -900;
		game.physics.p2.restitution = 10;

		groundTiles = game.add.group();
		scoreTiles = game.add.group();

		scoreTiles.enableBody = true;
    scoreTiles.physicsBodyType = Phaser.Physics.P2JS;

		steppedTiles[0] = [];
		steppedTiles[1] = [];
		noSteppedTiles[0] = 0;
		noSteppedTiles[1] = 0;

		// Set no steps taken on each type
		for(var i=0; i < numberOfTypes; i++) {
			steppedTiles[0][i] = 0;
			steppedTiles[1][i] = 0;
		}

		// Add all tiles
		for(; rowIndex >= 0; rowIndex--) {
			this.createNewRow(rowIndex);
		}
		//Create some dead tiles
		this.createNewRow(-1);
		
		// Steps taken in y coordinates
		leftStep = 0;
		rightStep = 0;

		//shadow = game.add.sprite(0, -tileSize/2-360, 'shadow');

		game.input.onDown.add(this.stepClicked, this);

		this.scale.setScreenSize = true;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;


	},

	update : function() {
		
		groundTiles.y += speed;
		leftStep += speed;
		rightStep += speed;

		if(groundTiles.y%tileSize == 0) {
			this.newRow(rowIndex--);
		}

		//Check if gameover
		if(leftStep > game.height || leftStep < 0) {
			console.log("you died : " + leftStep + " > "  + game.height);	
			leftStep = 0;
		}
		if(rightStep > game.height || rightStep < 0) {
			console.log("you died : " + rightStep + " > "  + game.height);	
			rightStep = 0;
		}
	},

	stepClicked : function(tile, pointer) {

		tile.targetObject.sprite.alpha = 0.7;
		this.takeStep(tile.targetObject.sprite.name, Math.ceil(pointer.y/tileSize)*tileSize);

	},

	takeStep : function (type, stepY) {

		steps++;

		if(steps%2 == 0) { 						// If left foot
			steppedTiles[0][type]++;
			noSteppedTiles[0]++;
			this.addResultTile(type, 0);
			leftStep = stepY;
		} else {											// If right foot
			steppedTiles[1][type]++;
			noSteppedTiles[1]++;
			this.addResultTile(type, 1);
			rightStep = stepY;
		}

		this.checkEvenSteps();
	},

	addResultTile : function(type, direction) { //direction: 0: left, 1: right
		//var x = direction*(cols/2)*tileSize;
		var x = direction*(cols/2)*tileSize + 60;// + (cols/2)*tileSize;
		var y = ((noSteppedTiles[direction]-1)*tileSize/2);
		var resultTile = game.add.sprite(x, y, 'tile_wide');
		resultTile.tint = colors[type];
		resultTile.name = type;

		scoreTiles.add(resultTile);

		resultTile.body.setCollisionGroup(tileCollisionGroup);
		resultTile.body.collides(tileCollisionGroup);

		//shadow.y = (Math.ceil(steps/2)-1)*tileSize/2-360;
	},

	checkGameOver : function() {
		console.log("check game over");
	},

	checkEvenSteps : function() {
		for(var type = 0; type < numberOfTypes; type++) {
			if(steppedTiles[0][type] != 0 && steppedTiles[1][type] != 0 && steppedTiles[0][type] == steppedTiles[1][type]) {
				console.log("yey! Stepped " + steppedTiles[0][type] + " on " + type);
				score += steppedTiles[0][type]*1000;
				steppedTiles[0][type] = 0;
				steppedTiles[1][type] = 0;
				this.clearScoreTiles(type);
			}
		}
	},

	clearScoreTiles : function(type) {
		
		console.log("l : " + scoreTiles.children.length);
		var length = scoreTiles.children.length;
		var toRemove = [];

		// Check for tiles to remove
		for (var i = 0; i < scoreTiles.children.length; i++) {
			if(scoreTiles.children[i].name == type) {
				var s = scoreTiles.children[i];
				scoreTiles.remove(s);
				s.destroy();
				i--;
			}
		}
	},

	createNewRow : function(i) {
		
		if(i == -1) { // create a set of dead sprites
			for(var j=0; j < cols*4; j++) {
				var newTile = game.add.sprite(0, 0, 'tile');
				groundTiles.add(newTile);
				newTile.kill();
			}
		} else { // create all initial rows
			for(var j=0; j < cols; j++) {
				var randomValue = Math.floor(Math.random()*numberOfTypes);
				var newTile = game.add.sprite(j*tileSize, (i-1)*tileSize, 'tile');
				newTile.inputEnabled = true;
				newTile.input.pixelPerfectClick = true;
				newTile.tint = colors[randomValue];
				newTile.name = randomValue;
				newTile.checkWorldBounds = true;
				newTile.outOfBoundsKill = true;
				groundTiles.add(newTile);
			}
		}
	},

	newRow : function(i) {
		for(var j=0; j < cols; j++) {

			var randomValue = Math.floor(Math.random()*numberOfTypes);

			// Revive old tile
			var newTile = groundTiles.getFirstExists(false);

			// if dead --> revive
			if(newTile) {

				newTile.revive();
				newTile.x = j*tileSize;
				newTile.y = (i-1)*tileSize;
				newTile.tint = 0xffffff;
				newTile.alpha = 1;
		
			} else { // if there is no dead tile --> create one

				newTile = game.add.sprite(j*tileSize, (i-1)*tileSize, 'tile');
				newTile.checkWorldBounds = true;
				newTile.outOfBoundsKill = true;
				groundTiles.add(newTile);
			}

			newTile.inputEnabled = true;
			newTile.input.pixelPerfectClick = true;
			newTile.tint = colors[randomValue];
			newTile.name = randomValue;
			groundTiles.add(newTile);
		}
	}
};
