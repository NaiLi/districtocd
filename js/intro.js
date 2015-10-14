var tileSize = 40;
var cols = 6;
var rows = 10;

// Sprites
var tileOne;
var tileTwo;
var scoreTiles;

// Text
var textGroup;
var textStyle;
var textSprite;

// Messages
var textOne   = "I know you're scared."
var textTwo   = "But you got to\nget out at some point."
var textThree = "Just put your\nright foot on the tile..."
var textFour = "Great job!"

var Intro = {

    preload : function() {
      game.load.image('tile', 'assets/tile.png');
      game.load.image('tile_wide', 'assets/tile-wide.png');
    },

    create : function() {

      scoreTiles = game.add.group();
      textGroup = game.add.group();

  		game.stage.backgroundColor = '#000'

      // Text style
      textStyle   = { font: "14px Arial", fill: "#fff", align: "center" };

      // Texts
      textSprite  = game.add.text(game.world.centerX, 80, textOne, textStyle);
      textSprite.anchor.setTo(0.5);
      //textSprite.alpha = 0;
      textSprite.wordWrap = true;
      textSprite.wordWrapWidth = window.innerWidth - 50;
      

      textSprite2  = game.add.text(game.world.centerX, 120, textTwo, textStyle);
      textSprite2.anchor.setTo(0.5);
      textSprite2.wordWrap = true;
      textSprite2.wordWrapWidth = window.innerWidth - 50;

      textSprite  = game.add.text(game.world.centerX, 160, textThree, textStyle);
      textSprite.anchor.setTo(0.5);
      textSprite  = game.add.text(game.world.centerX, 200, textFour, textStyle);
      textSprite.anchor.setTo(0.5);




      // Add first tile.
      tileOne = game.add.sprite(cols/2*tileSize, (rows-3)*tileSize, 'tile');
      tileOne.inputEnabled = true;
      tileOne.input.pixelPerfectClick = true;
      tileTwo = game.add.sprite(cols/3*tileSize, (rows-5)*tileSize, 'tile');
      tileTwo.alpha = 0;
      tileTwo.inputEnabled = true;
      tileTwo.input.pixelPerfectClick = true;

      tileOne.name = 1;
      tileTwo.name = 0;
      tileOne.tint = colors[0];
      tileTwo.tint = colors[0];
      
      // Event when clicking on tile
      game.input.onDown.add(this.stepClicked, this);


  		// Responsiveness
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //RESIZE? (better for desktop)
			game.scale.setScreenSize(true);

    },

    stepOne : function() {

      var fade = game.add.tween(tileTwo);
      fade.to({ alpha: 1 }, 1500);
      fade.start();
    },

    stepClicked : function(tile, pointer) {

      if(tile.targetObject) {
        tile.targetObject.sprite.alpha = 0.7;
        this.stepOne();
        this.addResultTile(0, tile.targetObject.sprite.name);
      }
    },

    addResultTile : function(type, direction) { //direction: 0: left, 1: right

      var x = direction*(cols/2)*tileSize;
      var y = 0 + tileSize/2;
      var resultTile = game.add.sprite(x, y, 'tile_wide');
      resultTile.tint = colors[type];
      resultTile.name = type;
      scoreTiles.add(resultTile);

      var fall = game.add.tween(resultTile);
      fall.to({ y: 0 }, 300);

      if(direction == 0) {
        fall.onComplete.add(this.clearScoreTiles, this);
      }
      fall.start();

    },

    clearScoreTiles : function(tile) {
      console.log("clearScoreTiles");
    
      // Check for tiles to remove, make them glow
      for (var i = 0; i < scoreTiles.children.length; i++) {

        var s = scoreTiles.children[i];
        var glow = game.add.tween(s);

        glow.to({ tint : 0xffffff }, 500)
            .to({ alpha : 0.0 }, 1000);
        glow.onComplete.add(this.removeTiles, this);
        glow.start();
      }
    },

    removeTiles : function(tile) {

      // Remove tiles 
      for (var i = 0; i < scoreTiles.children.length; i++) {
        scoreTiles.remove(scoreTiles.children[i]);
        i--;
      }
    },

    startGame: function () {

        // Change the state to the actual game.
        this.state.start('Game');

    }
}