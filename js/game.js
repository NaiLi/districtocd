
var tileSize = 40;
var cols = 6;
var rows = 10;
var rowIndex = rows;

// Game vars
var score = 0;
var numberOfTypes = 2;
var steppedTiles = [];
var noSteppedTiles = [];
var speed = 1;
var level = 1;
var levelTime = 500;
var time = 0;
var pause = false;
var steps = 0;
var leftStep;
var rightStep;

// Texts
var scoreText;
var lvlText;
var flashText;
var barStyle;
var flashStyle;

// Sprite groups
var footSteps;
var scoreTiles;
var groundTiles;
//var tileCollisionGroup;
//var shadow;

var colors = {
					0:0x68327A, //purple (2:0x7A4432, //brown)
					1:0xffff88, //yellow (3:0x327A75	//greenish)
					2:0x32687A,	//blueish
					3:0x999999	//grey
				}

var Game = {

	preload : function() {
		game.load.image('tile', 'assets/tile.png');
		//game.load.image('shadow', 'assets/shadow.png');
		game.load.image('tile_wide', 'assets/tile-wide.png');
		//game.load.image('transbox', 'assets/blackbox.png');
		game.load.image('shoeprint_right', 'assets/shoeprint_right.png');
		game.load.image('shoeprint_left', 'assets/shoeprint_left.png');
	},

	create : function () {

		// Physics
		/*
		game.physics.startSystem(Phaser.Physics.P2JS);
		tileCollisionGroup = game.physics.p2.createCollisionGroup();
		game.physics.p2.updateBoundsCollisionGroup();
		game.physics.p2.setImpactEvents(true);
		game.physics.p2.gravity.y = -1200;
		game.physics.p2.restitution = 10;*/

		// Create all tiles
		groundTiles = game.add.group();
		footSteps = game.add.group();
		scoreTiles = game.add.group();

		//scoreTiles.enableBody = true;
    //scoreTiles.physicsBodyType = Phaser.Physics.P2JS;

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
		//Create some dead tiles for recycling
		this.createNewRow(-1);
		
		// y coordinates of steps taken
		// TODO might be possible to have only one var and check which one is lowest
		leftStep = 0;
		rightStep = 0;

		// Feet
		leftFoot 	= game.add.sprite(0, -1000, 'shoeprint_left');
		rightFoot = game.add.sprite(0, -1000, 'shoeprint_right');
		/*
		leftFoot.anchor.setTo(0.5);
		rightFoot.anchor.setTo(0.5);
		footSteps.add(leftFoot);
		footSteps.add(rightFoot);*/

    // Top bar
		var topBarOne = game.add.sprite(0, 0, 'tile_wide');
		var topBarTwo = game.add.sprite(tileSize*cols/2, 0, 'tile_wide');
		topBarOne.tint = 0x000000;
		topBarTwo.tint = 0x000000;

		// Text styles
    barStyle 					= { font: "14px Arial", fill: "#fff" };
    flashStyle 				= { font: "30px Arial", fill: "#fff", stroke: "black", strokeThickness: 3, align: "center" };

    // Score text
    scoreText 	= game.add.text(5, 2, "Score: 0", barStyle);
    lvlText 		= game.add.text(170, 2, "Level: 1", barStyle);
    flashText 	= game.add.text(game.world.centerX, game.world.centerY-(game.world.centerY/4), "" ,flashStyle);
			flashText.anchor.setTo(0.5);
    flashText.wordWrap 			= true;
    flashText.wordWrapWidth = window.innerWidth - 50;

		//shadow = game.add.sprite(0, -tileSize/2-360, 'shadow');

		// Event when clicking on tile
		game.input.onDown.add(this.stepClicked, this);

		// Responsiveness
		game.scale.pageAlignHorizontally		= true;
		game.scale.pageAlignVertically			= true;
		game.scale.scaleMode								= Phaser.ScaleManager.SHOW_ALL; //RESIZE? (better for desktop)
		game.scale.setScreenSize(true);

	},

	update : function() {

		time++;
		
		if(!pause) {

			//console.log("time " + time);
			groundTiles.y 	+= speed;
			leftStep 				+= speed;
			rightStep 			+= speed;
			leftFoot.y 			+= speed;
			rightFoot.y 		+= speed;

			// Create new top row 
			if(groundTiles.y%tileSize < speed) {
				this.newRow(rowIndex--);
			}

			// Check if gameover
			this.checkGameOver();

			// Check if won
			this.checkWon();
		}
	},

	stepClicked : function(tile, pointer) {

		if(!pause) {
			if(tile.targetObject) {
				tile.targetObject.sprite.alpha = 0.7;
				//tile.targetObject.sprite.inputEnabled = false;
				this.takeStep(tile.targetObject.sprite.name, tile.y, tile.targetObject.sprite.x);//tile.targetObject.sprite.initialYPosition+groundTiles.y+tileSize, tile.targetObject.sprite.x);
			}
		}
	},

	takeStep : function (type, stepY, stepX) {

		steps++;

		if(steps%2 == 0) { 						// If left foot
			steppedTiles[0][type]++;
			noSteppedTiles[0]++;
			this.addResultTile(type, 0);
			leftStep = stepY;

			leftFoot.destroy();
			leftFoot 	= game.add.sprite(stepX+tileSize/2, stepY+tileSize/2, 'shoeprint_left');
			leftFoot.anchor.setTo(0.5);


			//leftFoot.x = stepX+tileSize/2;
			//leftFoot.y = stepY-tileSize/2;
		} else {											// If right foot
			steppedTiles[1][type]++;
			noSteppedTiles[1]++;
			this.addResultTile(type, 1);
			rightStep = stepY;

			rightFoot.destroy();
			rightFoot 	= game.add.sprite(stepX+tileSize/2, stepY+tileSize/2, 'shoeprint_right');
			rightFoot.anchor.setTo(0.5);

			//rightFoot.x = stepX+tileSize/2;
			//rightFoot.y = stepY+tileSize/2;
		}
		this.checkEvenSteps();
	},

	addResultTile : function(type, direction) { //direction: 0: left, 1: right

		var x = direction*(cols/2)*tileSize;// + tileSize*1.5;// + 60;
		var y = noSteppedTiles[direction]*(tileSize/2)+(tileSize/2); //TODO remove frome nosteppedtiles when removing score tile
		var resultTile = game.add.sprite(x, y, 'tile_wide');
		resultTile.tint = colors[type];
		resultTile.name = type;

		scoreTiles.add(resultTile);

		var fall = game.add.tween(resultTile);

    fall.to({ y: y-(tileSize/2) }, 300);
    fall.start();


		//resultTile.body.setCollisionGroup(tileCollisionGroup);
		//resultTile.body.collides(tileCollisionGroup);

/*
		resultTile.body.angularVelocity = 0;
		resultTile.body.setZeroDamping();
		resultTile.body.mass = 1;
*/
		//shadow.y = (Math.ceil(steps/2)-1)*tileSize/2-360;
	},

	checkGameOver : function() {

		if(leftStep > game.height || leftStep < 0) {
			leftStep = 0;
			this.pauseGame(true);
			this.createFlashMessage("Game over");
		}
		if(rightStep > game.height || rightStep < 0) {
			rightStep = 0;
			this.pauseGame(true);
			this.createFlashMessage("Game over");
		}
	},

	checkWon : function() { // TODO level up on time or score?
		//if(groundTiles.y > levelTime) {
		if(score >= level*3000) {
			//this.pauseGame(true); // TODO should it freeze for a moment?
			this.createFlashMessage(score + "!\nLevel up!", 2000);
			level++;
			speed += 0.1; //TODO make better progression, solve this
			levelTime += 700;
			lvlText.text = "Level " + level;

			if(level == 5) {
				steppedTiles[0][numberOfTypes] = 0;
				steppedTiles[1][numberOfTypes] = 0;
				numberOfTypes++;
			}

		}
	},

	pauseGame : function(bool) {
		pause = bool;
	},

	checkEvenSteps : function() {
		for(var type = 0; type < numberOfTypes; type++) {
			if(steppedTiles[0][type] != 0 && steppedTiles[1][type] != 0 && steppedTiles[0][type] == steppedTiles[1][type]) {
				
				var addedScore = steppedTiles[0][type]*1000; // TODO make this more awesome
				score += addedScore;
				scoreText.text = "Score: " + score;

				this.createFlashMessage(addedScore, 1000);

				steppedTiles[0][type] = 0;
				steppedTiles[1][type] = 0;
				this.clearScoreTiles(type);
			}
		}
	},

	createFlashMessage : function(text, duration) {

		flashText.alpha = 1.0;
		flashText.text = text;
		game.add.tween(flashText).to( { alpha: 0.0 }, duration).start();

	},

	clearScoreTiles : function(type) {
		
		// Check for tiles to remove, make them glow
		for (var i = 0; i < scoreTiles.children.length; i++) {
			if(scoreTiles.children[i].name == type) {

				var s = scoreTiles.children[i];
				var glow = game.add.tween(s);

				glow.to({ tint : 0xffffff }, 500)
					  .to({ alpha : 0.0 }, 1000);
				glow.onComplete.add(this.removeTiles, this);
	    	glow.start();
			}
		}
	},

	removeTiles : function(tile) {

		var type = tile.name;

		// Remove tiles 
		for (var i = 0; i < scoreTiles.children.length; i++) {
			if(scoreTiles.children[i].name == type) {
				var s = scoreTiles.children[i];

				var directionReduce = (s.x < 100) ? 0 : 1; // Which side to remove from
				noSteppedTiles[directionReduce]--;
				scoreTiles.remove(s);
				//s.destroy();
				i--;
			}
		}
		// Let the other tiles fall down ones the other ones are removed
		this.scoreTilesFall();
	},

	scoreTilesFall : function() {

		var left = 1;
		var right = 1;

		for (var i = 0; i < scoreTiles.children.length; i++) {

			var s = scoreTiles.children[i];
			var directionReduce = (s.x < 100) ? 0 : 1; // Which side to remove from
			
			if(directionReduce == 0) { // if left side
				var fall = game.add.tween(s);

				fall.to({ y: left*(tileSize/2) }, 300);
	    	fall.start();
	    	left++;

			} else {
				var fall = game.add.tween(s);

				fall.to({ y: right*(tileSize/2) }, 300);
	    	fall.start();
	    	right++;
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
				newTile.initialYPosition = (i-1)*tileSize;
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
	},
};
