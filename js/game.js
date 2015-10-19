
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
var levelTime = 300;
var levelTimeIncrease = 400;
var time;
var pause;
var steps;
var leftStep;
var rightStep;
var gameoverReason = 1;
var highscore;

// Texts
var scoreText;
var lvlText;
var flashText;
var barStyle;
var flashStyle;
var boxStyle;
var textSprite;

// Text styles
var barStyle;
var flashStyle;
var boxStyle;

// Sprite groups
var footSteps;
var scoreTiles;
var groundTiles;
var barGroup;
var leftFootGO;
var rightFootGO;
//var tileCollisionGroup;
//var shadow;

// Game over stuff
var transbox;
var retryBtn;
var menuBtn;
var gotitBtn;
var gameoverSprite;

// Messages
var message = ["Mind your steps,\ndon't walk too slow!", "Take as many steps with each foot on the same color.", "You get higher scores for removing more tiles at a time.", "Keep as many tiles of the same color in each column.", "Maybe we have to send you back to the hospital..."];
var messageNo = 0;

// Instructions
var showInstruction = 1;
var instructionsShown = [];

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
		game.load.image('gameover', 'assets/gameover.png');
		game.load.image('retry', './assets/retryIcon.png');
		game.load.image('menu', './assets/menuIcon.png');
		game.load.image('gotit', './assets/gotitBtn.png');
	},

	create : function () {

		this.pauseGame(true);

		game.stage.backgroundColor = '#000';
		// Text styles
		barStyle 					= { font: "14px Arial", fill: "#fff", align: "center" };
		flashStyle 				= { font: "30px Arial", fill: "#fff", stroke: "black", strokeThickness: 3, align: "center" };
		boxStyle					= { font: "14px Arial", fill: "#000", stroke: "black", strokeThickness: 1, align: "center" };

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

		if(!pause) {
			
			time++;

			groundTiles.y 	+= speed;
			leftStep 				+= speed;
			rightStep 			+= speed;
			leftFoot.y 			+= speed;
			rightFoot.y 		+= speed;

			// Create new top row 
			if(groundTiles.y%tileSize < speed) {
				this.newRow(rowIndex--);
			}

			this.displayInstruction(showInstruction);


			// Check if gameover
			this.checkGameOver();

			// Check if won
			this.checkLevelUp();
		}
	},

	stepClicked : function(tile, pointer) {

		if(!tile.targetObject || tile.targetObject.sprite.key != "tile")
			return;

		if(!pause) {
			tile.targetObject.sprite.alpha = 0.5;
			var y = groundTiles.y+tile.targetObject.sprite.y;
			this.takeStep(tile.targetObject.sprite.name, y, tile.targetObject.sprite.x);
		}
	
		// Check if any instructions
		this.checkInstructions();
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

		} else {											// If right foot
			steppedTiles[1][type]++;
			noSteppedTiles[1]++;
			this.addResultTile(type, 1);
			rightStep = stepY;

			rightFoot.destroy();
			rightFoot 	= game.add.sprite(stepX+tileSize/2, stepY+tileSize/2, 'shoeprint_right');
			rightFoot.anchor.setTo(0.5);

		}
		this.checkEvenSteps();
	},

	addResultTile : function(type, direction) { //direction: 0: left, 1: right

		var x = direction*(cols/2)*tileSize;// + tileSize*1.5;// + 60;
		var y = noSteppedTiles[direction]*(tileSize/2)+(tileSize/2); //TODO remove frome nosteppedtiles when removing score tile
		var resultTile = game.add.sprite(x, y, 'tile_wide');
		resultTile.tint = colors[type];
		resultTile.name = type;
		resultTile.inputEnabled = true;
		resultTile.input.pixelPerfectClick = true;

		scoreTiles.add(resultTile);

		var fall = game.add.tween(resultTile);

    fall.to({ y: y-(tileSize/2) }, 300);
    fall.start();
	},

	checkGameOver : function() {

		if(leftStep > game.height-tileSize || leftStep < 0) {
			leftStep = 0;
			this.displayInstruction(-1, "left");
			this.saveScore();
		}
		if(rightStep > game.height-tileSize || rightStep < 0) {
			rightStep = 0;
			this.displayInstruction(-1, "right");
			this.saveScore();
		}
	},

	checkInstructions: function() {

		// If player has not collected many of the same kind (show instruction 3)
		if(noSteppedTiles[0] == 5) {
			this.displayInstruction(showInstruction);
			showInstruction = 2;
		} 
		// If player has too many in the same pile (show instruction 2)
		else if(steps == 16 && noSteppedTiles[0] < 2)  {
			this.displayInstruction(showInstruction);
			showInstruction = 3;
		}
	},

	checkLevelUp : function() { // TODO level up on time or score?
		
		if(time > levelTime) {
		//if(score >= level*3000) {
			//this.pauseGame(true); // TODO should it freeze for a moment?
			this.createFlashMessage(score + " p!\nLevel up!", 2000);
			level++;
			speed += 0.1; //TODO make better progression, solve this
			levelTime += levelTimeIncrease;
			lvlText.text = "Level " + level;

			if(level == 3) {
				steppedTiles[0][numberOfTypes] = 0; // Set to zero the for the new color
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

	displayInstruction : function(number, foot) {

		// make sure the instruction hasn't already been shown
		if(number != -1) {
			if(instructionsShown[number])
				return;
		}

		switch(number) {

			case 0:
				break;
			case 1: // Intro instruction

				this.pauseGame(true);
				instructionsShown[number] = true;
				showInstruction = 0;

				transbox = game.add.sprite(game.world.centerX, game.world.centerY, 'transbox');
				transbox.anchor.setTo(0.5);
				transbox.alpha = 0.9;
				textSprite  = game.add.text(game.world.centerX, game.world.centerY, "Start walking on the tiles,\nmake sure to have both feet within the screen.", barStyle);
      	textSprite.anchor.x = 0.5;
      	textSprite.anchor.y = 1;
      	textSprite.wordWrap = true;
      	textSprite.wordWrapWidth = game.world.width - 50;

    		gotitBtn = this.add.button(game.world.centerX, game.world.centerY+30, 'gotit', this.resumeGame, this);
    		gotitBtn.anchor.x = 0.5;
    		gotitBtn.anchor.y = 0;
				break;

			case 2: // First instruction
				if(introduced)
					break;
				this.pauseGame(true);
				showInstruction = 0;
				instructionsShown[number] = true;

				transbox = game.add.sprite(game.world.centerX, game.world.centerY, 'transbox');
				transbox.anchor.setTo(0.5);
				transbox.alpha = 0.85;
				textSprite  = game.add.text(game.world.centerX, game.world.centerY, "Remember:\nKeep as many tiles of the same color in each column.", barStyle);
      	textSprite.anchor.x = 0.5;
      	textSprite.anchor.y = 1;
      	textSprite.wordWrap = true;
      	textSprite.wordWrapWidth = game.world.width - 50;

    		var buttonsTween = game.add.tween(textSprite);

				buttonsTween.to({ alpha : 1 }, 800);
				buttonsTween.onComplete.add(function() {

	    		gotitBtn = this.add.button(game.world.centerX, game.world.centerY+30, 'gotit', this.resumeGame, this);
	    		gotitBtn.anchor.x = 0.5;
	    		gotitBtn.anchor.y = 0;
					gotitBtn.alpha = 0;

					game.add.tween(gotitBtn).to({ alpha: 1}, 500).start();

	    	},this);
	    	buttonsTween.start();

				break;

			case 3: 
				if(introduced)
					break;
				this.pauseGame(true);
				showInstruction = 0;
				instructionsShown[number] = true;

				transbox = game.add.sprite(game.world.centerX, game.world.centerY, 'transbox');
				transbox.anchor.setTo(0.5);
				transbox.alpha = 0.85;
				textSprite  = game.add.text(game.world.centerX, game.world.centerY, "Remember:\nYou get higher scores for removing more tiles at a time.", barStyle);
      	textSprite.anchor.x = 0.5;
      	textSprite.anchor.y = 1;
      	textSprite.wordWrap = true;
      	textSprite.wordWrapWidth = game.world.width - 50;

    		var buttonsTween = game.add.tween(textSprite);

				buttonsTween.to({ alpha : 1 }, 800);
				buttonsTween.onComplete.add(function() {

	    		gotitBtn = this.add.button(game.world.centerX, game.world.centerY+30, 'gotit', this.resumeGame, this);
	    		gotitBtn.anchor.x = 0.5;
	    		gotitBtn.anchor.y = 0;
					gotitBtn.alpha = 0;

					game.add.tween(gotitBtn).to({ alpha: 1}, 500).start();

	    	},this);
	    	buttonsTween.start();

				break;

			case -1: // Gameover

				this.pauseGame(true);

				transbox = game.add.sprite(game.world.centerX, game.world.centerY, 'transbox');
				transbox.anchor.setTo(0.5);
				transbox.alpha = 0.85;

				gameoverSprite = game.add.sprite(game.world.centerX, game.world.centerY, 'gameover');
				gameoverSprite.scale.setTo(0.5, 0.5);
				gameoverSprite.anchor.setTo(0.5);

				var trans = 1500;
				// Animate feet
				if(foot == "left") {
					var x = leftFoot.x;
					var y = leftFoot.y;
					//leftFoot.destroy();
					leftFootGO 	= game.add.sprite(x, y, 'shoeprint_left');
					leftFootGO.anchor.setTo(0.5);
					game.add.tween(leftFootGO).to({alpha: 0}, trans+300).start();
					game.add.tween(leftFootGO.scale).to({ x: 10, y: 10}, trans, Phaser.Easing.Linear.None, true).start();
				} else if(foot == "right") {
					var x = rightFoot.x;
					var y = rightFoot.y;
					//rightFoot.destroy();
					rightFootGO 	= game.add.sprite(x, y, 'shoeprint_right');
					rightFootGO.anchor.setTo(0.5);
					game.add.tween(rightFootGO).to({alpha: 0}, trans+300).start();
					game.add.tween(rightFootGO.scale).to({ x: 10, y: 10}, trans, Phaser.Easing.Linear.None, true).start();
				}

      	messageNo++;
				
				text = "";      	
      	// TODO if new highscore (score > highscore)
      	if(score > highscore) {
      		text += "New highscore!\n";
      	}
      	text += "Highscore: " + highscore + "\n" + "Your score: " + score + "\n\n";
				text += (message[messageNo]) ? message[messageNo] : "you lost your mind...";
				textSprite  = game.add.text(game.world.centerX, game.world.centerY, text, boxStyle);
      	textSprite.anchor.x = 0.5;
      	textSprite.anchor.y = 0.7;
      	textSprite.wordWrap = true;
      	textSprite.wordWrapWidth = game.world.width - 70;


    		var buttonsTween = game.add.tween(textSprite);

				buttonsTween.to({ alpha : 1 }, 1000);
				buttonsTween.onComplete.add(function() {
			    // It will act as a button to start the game.
					retryBtn = this.add.button(game.world.centerX-5, game.world.centerY+game.world.centerY/4, 'retry', this.restartGame, this);
					retryBtn.scale.setTo(0.5, 0.5);
					retryBtn.anchor.x = 1;
					retryBtn.anchor.y = 0;
					retryBtn.alpha = 0;

					menuBtn = this.add.button(game.world.centerX+5, game.world.centerY+game.world.centerY/4, 'menu', this.toMenu, this); //CHANGE WHAT HAPPENS
					menuBtn.scale.setTo(0.5, 0.5);
					menuBtn.anchor.x = 0;
					menuBtn.anchor.y = 0;
					menuBtn.alpha = 0;

					game.add.tween(retryBtn).to({ alpha: 1}, 500).start();
					game.add.tween(menuBtn).to({ alpha: 1}, 500).start();

				}, this);
				buttonsTween.start();

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
				s.destroy();
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

	// Make all remaining score tiles fall up
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

	// Create initial ground tiles, both visible and dead
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
				newTile.alpha = 0.85;
				groundTiles.add(newTile);
			}
		}
	},

	// Create a new row of ground tiles (used during game)
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

			newTile.alpha = 0.85;
			newTile.inputEnabled = true;
			newTile.input.pixelPerfectClick = true;
			newTile.tint = colors[randomValue];
			newTile.name = randomValue;
			groundTiles.add(newTile);
		}
	},

	// Restart game
	restartGame: function() {

		transbox.destroy();
		retryBtn.destroy();
		menuBtn.destroy();
		textSprite.destroy();
		gameoverSprite.destroy();
		leftFootGO.destroy();
		rightFootGO.destroy();

		this.resetAll();

		this.removeAllTiles();

		this.createGroups();

		this.renderStartTiles();
		this.createBar();
		this.createFlash();


		leftFoot.y = 1000;
		rightFoot.y = 1000;

	},

	// Remove instruction objects and unpause
	resumeGame: function() {
		
		transbox.destroy();
		textSprite.destroy();
		gotitBtn.destroy();
		this.pauseGame(false);
	},

	// Switch to menu state
  toMenu: function() {
  	game.state.start("Menu");
  },

  // Reset all game variables
  resetAll: function() {
  	
		score = 0;
		steppedTiles = [];
		noSteppedTiles = [];
		speed = 1;
		level = 1;
		levelTime = 300;
		time = 0;
		pause = false;
		steps = 0;
		numberOfTypes = 2;
		highscore = this.getHighscore();
		firstStep = true;

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

  // Create sprite groups
  createGroups: function() {
		groundTiles = game.add.group();
		footSteps = game.add.group();
		scoreTiles = game.add.group();
		barGroup = game.add.group();
  },

  // Create all initial ground tiles
  renderStartTiles: function() {

		// Add all tiles
		rowIndex = rows;
		for(; rowIndex >= 0; rowIndex--) {
			this.createNewRow(rowIndex);
		}
		//Create some dead tiles for recycling
		this.createNewRow(-1);
  },

  // Create feet
  createFeet: function() {
		// Feet
		leftFoot 	= game.add.sprite(0, -1000, 'shoeprint_left');
		rightFoot = game.add.sprite(0, -1000, 'shoeprint_right');
		footSteps.add(leftFoot);
		footSteps.add(rightFoot);

		leftFootGO 	= game.add.sprite(0, -1000, 'shoeprint_left');
		rightFootGO = game.add.sprite(0, -1000, 'shoeprint_right');
  },

  // Create top bar
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

  // Create empty flash text
  createFlash: function() {
    flashText 	= game.add.text(game.world.centerX, game.world.centerY-(game.world.centerY/4), "" ,flashStyle);
			flashText.anchor.setTo(0.5);
    flashText.wordWrap 			= true;
    flashText.wordWrapWidth = window.innerWidth - 50;
  },

  // Save score when game over, if higher score than 0
  saveScore: function() {

  	if(score == 0) {
  		return;
  	}

  	// Get local storage
  	var data = JSON.parse(localStorage.getItem('scoreboard'));

  	// Save in score array
  	if(data && data.score) {

  		// Push and sort, save only top 5
  		data.score.push(score);
  		data.score.sort(function(a,b) {
  			return a > b;
  		});
  		var temp = [];
  		var count = 0;
  		for(var i = data.score.length-1; i >= 0; i--) {
  			if(count == 5)
					break;
  			temp.push(data.score[i]);
  			count ++;
  		}
  		data.score = temp;

  		// Store highest score
  		if(score > data.highscore)
				data.highscore = score;
    	
    	// Save all to local storage
    	localStorage.setItem('scoreboard', JSON.stringify(data));

  	} 
  	else { // If there is no local storage, create new data
  		data = {};
  		data.score = [];
  		data.score.push(score);
  		data.highscore = score;
  		localStorage.setItem('scoreboard', JSON.stringify(data));
  	}
  },

  // Get all highscores from local storage
  getHighscore: function() {

  	var data = JSON.parse(localStorage.getItem('scoreboard'));
  	if(data && data.highscore) {
  		return data.highscore;
  	} else {
  		return 0;
  	}
  }
};
