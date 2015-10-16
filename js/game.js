
var tileSize = 40;
var cols = 6;
var rows = 10;
var rowIndex = rows;

// Game vars
var score;
var numberOfTypes = 2;
var steppedTiles;
var noSteppedTiles;
var speed;
var level;
var levelTime = 400;
var levelTimeIncrease = 400;
var time;
var pause;
var steps;
var leftStep;
var rightStep;
var gameoverReason = 1;

// Texts
var scoreText;
var lvlText;
var flashText;
var barStyle;
var flashStyle;
var boxStyle;
var textSprite;

// Text styles
var barStyle 					= { font: "14px Arial", fill: "#fff", align: "center" };
var flashStyle 				= { font: "30px Arial", fill: "#fff", stroke: "black", strokeThickness: 3, align: "center" };
var boxStyle					= { font: "14px Arial", fill: "#fff", stroke: "black", strokeThickness: 1, align: "center" };

// Sprite groups
var footSteps;
var scoreTiles;
var groundTiles;
var barGroup;
//var tileCollisionGroup;
//var shadow;

// Game over stuff
var transbox;
var retryBtn;
var menuBtn;
var gotitBtn;

// Messages
var message = ["Take as many steps with each foot on the same color.", "Mind your steps,\ndon't walk too slow!", "Maybe we have to send you back to the hospital..."];
var messageNo = 0;

// Instructions
var showInstruction = 1;

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
		game.load.image('transbox', 'assets/blackbox.png');
		game.load.image('shoeprint_right', 'assets/shoeprint_right.png');
		game.load.image('shoeprint_left', 'assets/shoeprint_left.png');
		game.load.image('up', 'assets/upArrow.png');
		game.load.image('retry', './assets/retryBtn.png');
		game.load.image('menu', './assets/menuBtn.png');
		game.load.image('gotit', './assets/gotitBtn.png');
	},

	create : function () {

		// Reset game values
		this.resetAll();

		// Create all tiles
		this.createGroups();
    this.renderStartTiles();
    this.createFeet();
		this.createBar();
		this.createFlash();


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
			//game.state.start("GameOver");
			
			this.pauseGame(true);
			//this.createFlashMessage("Game over");
			this.displayInstruction(2);
		}
		if(rightStep > game.height || rightStep < 0) {
			rightStep = 0;
			//game.state.start("GameOver");
			
			this.pauseGame(true);
			//this.createFlashMessage("Game over");
			this.displayInstruction(-1);
		}

		// If not game over, check if any instructions
		if(noSteppedTiles[0] == 3 && showInstruction == 1) {
			this.displayInstruction(showInstruction);
			showInstruction = 2;
		} else if(steps == 16 && noSteppedTiles[0] < 2 && showInstruction == 2)  {
			this.displayInstruction(showInstruction);
			showInstruction = 0;
		}
	},

	checkWon : function() { // TODO level up on time or score?
		
		if(time > levelTime) {
		//if(score >= level*3000) {
			//this.pauseGame(true); // TODO should it freeze for a moment?
			this.createFlashMessage(score + "!\nLevel up!", 2000);
			level++;
			speed += 0.1; //TODO make better progression, solve this
			levelTime += levelTimeIncrease;
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
		//game.paused = bool; //TODO use this instead
	},

	checkEvenSteps : function() {

		for(var type = 0; type < numberOfTypes; type++) {

			if(steppedTiles[0][type] != 0 && steppedTiles[1][type] != 0 && steppedTiles[0][type] == steppedTiles[1][type]) {

				var addedScore = steppedTiles[0][type]*steppedTiles[0][type]*1000; // TODO make this more awesome
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

	displayInstruction : function(number) {

		switch(number) {

			case 0:
				break;
			case 1: // First instruction
				this.pauseGame(true);
				transbox = game.add.sprite(game.world.centerX, game.world.centerY, 'transbox');
				transbox.anchor.setTo(0.5);
				transbox.alpha = 0.85;
				textSprite  = game.add.text(game.world.centerX, game.world.centerY, "Remember:\nKeep as many tiles of the same color in each column.", barStyle);
      	textSprite.anchor.x = 0.5;
      	textSprite.anchor.y = 1;
      	textSprite.wordWrap = true;
      	textSprite.wordWrapWidth = game.world.width - 50;

    		gotitBtn = this.add.button(game.world.centerX, game.world.centerY+30, 'gotit', this.resumeGame, this);
    		gotitBtn.anchor.x = 0.5;
    		gotitBtn.anchor.y = 0;

				break;

			case 2: 
				this.pauseGame(true);
				transbox = game.add.sprite(game.world.centerX, game.world.centerY, 'transbox');
				transbox.anchor.setTo(0.5);
				transbox.alpha = 0.85;
				textSprite  = game.add.text(game.world.centerX, game.world.centerY, "Remember:\nYou get higher scores for removing more tiles at a time.", barStyle);
      	textSprite.anchor.x = 0.5;
      	textSprite.anchor.y = 1;
      	textSprite.wordWrap = true;
      	textSprite.wordWrapWidth = game.world.width - 50;

    		gotitBtn = this.add.button(game.world.centerX, game.world.centerY+30, 'gotit', this.resumeGame, this);
    		gotitBtn.anchor.x = 0.5;
    		gotitBtn.anchor.y = 0;
				break;

			case -1: // Gameover
				transbox = game.add.sprite(game.world.centerX, game.world.centerY, 'transbox');
				transbox.anchor.setTo(0.5);
				transbox.alpha = 0.85;
				text = (message[messageNo]) ? message[messageNo] : "you lost your mind...";
      	messageNo++;
				textSprite  = game.add.text(game.world.centerX, game.world.centerY, "Game over...\n" + text + "\n" + score + " points!\n", boxStyle);
      	textSprite.anchor.x = 0.5;
      	textSprite.anchor.y = 1;
      	textSprite.wordWrap = true;
      	textSprite.wordWrapWidth = game.world.width - 50;

  	    // It will act as a button to start the game.
    		retryBtn = this.add.button(game.world.centerX, game.world.centerY, 'retry', this.restartGame, this);
    		retryBtn.anchor.x = 0.5;
    		retryBtn.anchor.y = 0;
    
				menuBtn = this.add.button(game.world.centerX, game.world.centerY+70, 'menu', this.toMenu, this); //CHANGE WHAT HAPPENS
    		menuBtn.anchor.setTo(0.5);
				break;

			default:
				break;

		}
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

	removeAllTiles : function() {

		groundTiles.destroy();
		scoreTiles.destroy();
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

	restartGame: function() {

		this.resetAll();

		this.removeAllTiles();

		this.createGroups();

		this.renderStartTiles();
		this.createBar();
		this.createFlash();

		transbox.destroy();
		retryBtn.destroy();
		menuBtn.destroy();
		textSprite.destroy();

		this.pauseGame(false);
	},

	resumeGame: function() {
		
		transbox.destroy();
		textSprite.destroy();
		//retryBtn.destroy();
		//menuBtn.destroy();

		gotitBtn.destroy();
		
		this.pauseGame(false);
	},

  toMenu: function() {
  	game.state.start("Menu");
  },

  resetAll: function() {
  	
		score = 0;
		steppedTiles = [];
		noSteppedTiles = [];
		speed = 1;
		level = 1;
		time = 0;
		pause = false;
		steps = 0;
		numberOfTypes = 2;

		steppedTiles[0] = [];
		steppedTiles[1] = [];
		noSteppedTiles[0] = 0;
		noSteppedTiles[1] = 0;

		// Set no steps taken on each type
		for(var i=0; i < numberOfTypes; i++) {
			steppedTiles[0][i] = 0;
			steppedTiles[1][i] = 0;
		}

		// y coordinates of steps taken
		// TODO might be possible to have only one var and check which one is lowest
		leftStep = 0;
		rightStep = 0;
  },

  createGroups: function() {
		groundTiles = game.add.group();
		footSteps = game.add.group();
		scoreTiles = game.add.group();
		barGroup = game.add.group();
  },

  renderStartTiles: function() {

		// Add all tiles
		rowIndex = rows;
		for(; rowIndex >= 0; rowIndex--) {
			this.createNewRow(rowIndex);
		}
		//Create some dead tiles for recycling
		this.createNewRow(-1);
  },

  createFeet: function() {
		// Feet
		leftFoot 	= game.add.sprite(0, -1000, 'shoeprint_left');
		rightFoot = game.add.sprite(0, -1000, 'shoeprint_right');
		footSteps.add(leftFoot);
		footSteps.add(rightFoot);
  },

  createBar: function() {
  	    // Top bar
		topBarOne = game.add.sprite(0, 0, 'tile_wide');
		topBarTwo = game.add.sprite(tileSize*cols/2, 0, 'tile_wide');
		topBarOne.tint = 0x000000;
		topBarTwo.tint = 0x000000;
		barGroup.add(topBarOne);
		barGroup.add(topBarTwo);
    // Score text
    scoreText 	= game.add.text(5, 2, "Score: 0", barStyle);
    lvlText 		= game.add.text(170, 2, "Level: 1", barStyle);
    barGroup.add(scoreText);
    barGroup.add(lvlText);
  },

  createFlash: function() {
    flashText 	= game.add.text(game.world.centerX, game.world.centerY-(game.world.centerY/4), "" ,flashStyle);
			flashText.anchor.setTo(0.5);
    flashText.wordWrap 			= true;
    flashText.wordWrapWidth = window.innerWidth - 50;
  }
};
