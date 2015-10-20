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
var textSprite2;
var textSprite3;
var textSprite4;
var textSprite5;

// Tweens
var textTween1;
var textTween2;
var textTween3;
var textTween4;
var textTween5;

var tileTween1;
var tileTween2;

var duration = 1000;
var durationSlow = 2000;
var durationSuperslow = 2500;


// Messages
var textOne   = "I know you're scared."
var textTwo   = "But you got to\nget out at some point."
var textThree = "Just put your\nright foot on the tile..."
var textFour = "\nGreat job!\nNow the only way to lose that uncomfortable feeling in your foot is to step with the left foot on the same color";
var textFive = "See? It all works out if you just give in to your OCD.\nMake sure to have as many tiles of the same color in each column.\nNow go get that milk for me!";

var Intro = {

    preload : function() {
      game.load.image('tile', 'assets/tile.png');
      game.load.image('tile_wide', 'assets/tile-wide.png');
      game.load.image('ready_btn', 'assets/readyBtn.png');
      game.load.image('skip_btn', 'assets/skipBtn.png');
    },

    create : function() {

      scoreTiles = game.add.group();
      textGroup = game.add.group();

  		game.stage.backgroundColor = '#000';
      var worldWrapWidth = game.world.width - 40;

      // Text style
      textStyle   = { font: "14px Arial", fill: "#fff", align: "center" };

      // Texts
      textSprite  = game.add.text(game.world.centerX, 80, textOne, textStyle);
      textSprite.anchor.setTo(0.5);
      textSprite.wordWrap = true;
      textSprite.wordWrapWidth = worldWrapWidth;
      textSprite.alpha = 0;
      textSprite.name = 1;
      textTween1 = game.add.tween(textSprite);
      textTween1.to( { alpha: 1.0 }, durationSuperslow);
      textTween1.onComplete.add(this.nextInstruction, this);
      textTween1.start();
      

      textSprite2  = game.add.text(game.world.centerX, 120, textTwo, textStyle);
      textSprite2.anchor.setTo(0.5);
      textSprite2.wordWrap = true;
      textSprite2.wordWrapWidth = worldWrapWidth;
      textSprite2.alpha = 0;
      textSprite2.name = 2;

      textSprite3  = game.add.text(game.world.centerX, 170, textThree, textStyle);
      textSprite3.anchor.setTo(0.5);
      textSprite3.wordWrap = true;
      textSprite3.wordWrapWidth = worldWrapWidth;
      textSprite3.alpha = 0;
      textSprite3.name = 4;

      textSprite4  = game.add.text(game.world.centerX, 80, textFour, textStyle);
      textSprite4.anchor.setTo(0.5);
      textSprite4.wordWrap = true;
      textSprite4.wordWrapWidth = worldWrapWidth;
      textSprite4.alpha = 0;
      textSprite4.name = 6;

      textSprite5  = game.add.text(game.world.centerX, 80, textFive, textStyle);
      textSprite5.anchor.setTo(0.5);
      textSprite5.wordWrap = true;
      textSprite5.wordWrapWidth = worldWrapWidth;
      textSprite5.alpha = 0;
      textSprite5.name = 7;


      // Add first tile.
      tileOne = game.add.sprite(cols/2*tileSize, (rows-3)*tileSize, 'tile');
      tileOne.alpha = 0;
      tileTwo = game.add.sprite(cols/3*tileSize, (rows-5)*tileSize, 'tile');
      tileTwo.alpha = 0;

      tileOne.name = 3;
      tileTwo.name = 5;
      tileOne.direction = 1;
      tileTwo.direction = 0;
      tileOne.tint = colors[0];
      tileTwo.tint = colors[0];

      //var skipBtn = this.add.button(game.width-20, game.height-20, 'skip_btn', this.startGame, this); //CHANGE WHAT HAPPENS
      //skipBtn.anchor.setTo(1);
      
      // Event when clicking on tile
      game.input.onDown.add(this.stepClicked, this);


  		// Responsiveness
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //RESIZE? (better for desktop)
			game.scale.setScreenSize(true);

      // Set local storage that the intro is watched
      var introPlayed = true;
      localStorage.setItem('intro_played', JSON.stringify(introPlayed));
    },

    nextInstruction : function(tween) {

      var number = (tween.name) ? tween.name : tween;

      switch (number) { 
        case 1: // Fade text one and fade in text two (But you got to...)
          
          textTween1.to( {alpha: 0 }, durationSlow);

          textTween2 = game.add.tween(textSprite2);
          textTween2.to( { alpha: 1.0 }, durationSlow);
          textTween2.onComplete.add(this.nextInstruction, this);
          textTween2.start();

          break;

        case 2: // Fade out text two and fade in text 3 and tile 1

          textTween2.to( {alpha: 0 }, durationSuperslow);

          textTween3 = game.add.tween(textSprite3);
          textTween3.to( { alpha: 1.0 }, durationSuperslow);
          textTween3.start();

          tileTween1 = game.add.tween(tileOne);
          tileTween1.to( { alpha: 1.0 }, durationSuperslow);
          tileTween1.onComplete.add(this.enableTile, this);
          tileTween1.start();
          
          break;

        case 3: // Fade out text 3 (wait for click on first tile)
          textSprite3.alpha = 0;                  // Out: "just put your..."
          this.nextInstruction(textSprite3.name);
          break;

        case 4: // Clicked on first tile. Fade in tile 2 and fade in text 4 (Great job...)
        
          textTween4 = game.add.tween(textSprite4);   // In: "Great job.."
          textTween4.to( { alpha: 1.0 }, duration);
          textTween4.start();
          
          tileTween2 = game.add.tween(tileTwo);
          tileTween2.to( { alpha: 1.0 }, duration);   // In: Tile two
          tileTween2.onComplete.add(this.enableTile, this);
          tileTween2.start();

          break;

        case 5: // Clicked on tile two, fade out text 4

          textTween4.to( {alpha: 0 }, duration);
          textTween4.onComplete.add(this.nextInstruction, this);
          textTween4.start();
          break;

        case 6: // Fade in text 5 (See!..)
          textTween5 = game.add.tween(textSprite5);   // In: "See.. "
          textTween5.to( { alpha: 1.0 }, duration);   
          textTween5.onComplete.add(this.nextInstruction, this);
          textTween5.start();
          break;

        case 7:

          tileTween1.to( { alpha: 0 }, duration);
          tileTween1.start();
          tileTween2.to( { alpha: 0 }, duration);
          tileTween2.onComplete.add(this.selectInstruction, this);
          tileTween2.start();
          break;

        case 8:
          var readyBtn = this.add.button(game.world.centerX, game.world.centerY-20, 'ready_btn', this.startGame, this); //CHANGE WHAT HAPPENS
          readyBtn.anchor.setTo(0.5);
          readyBtn.alpha = 0;
          game.add.tween(readyBtn).to( { alpha: 1 }, durationSuperslow).start();
          game.add.tween(readyBtn.scale).to( {x: 0.83, y: 0.83}, 2000, Phaser.Easing.Linear.In, true, 0, 1500, true).start();

          break;

        default:
          break;
      }
    },

    selectInstruction : function(number) {
      number = 8; //TODO Omg this is horrible
      this.nextInstruction(number);
    },

    startGame: function () {

      // Change the state to the actual game.
      this.state.start('Game');

    },

    stepClicked : function(tile, pointer) {


      if(tile.targetObject) {
      
        if(tile.targetObject.sprite.key == "tile") {
          tile.targetObject.sprite.inputEnabled = false;
  //        tile.targetObject.sprite.alpha = 0.7;
          this.nextInstruction(tile.targetObject.sprite.name);
          this.addResultTile(0, tile.targetObject.sprite.direction);
        }
      }
    },

    addResultTile : function(type, direction) { //direction: 0: left, 1: right

      var x = direction*(cols/2)*tileSize;
      var y = tileSize*3;
      var resultTile = game.add.sprite(x, y, 'tile_wide');
      resultTile.tint = colors[type];
      resultTile.name = type;
      scoreTiles.add(resultTile);

      var fall = game.add.tween(resultTile);
      fall.to({ y: 0 }, 1000);

      if(direction == 0) {
        fall.onComplete.add(this.clearScoreTiles, this);
      }
      fall.start();

    },

    clearScoreTiles : function(tile) {
    
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

    enableTile : function(tile) {
      tile.inputEnabled = true;
      tile.input.pixelPerfectClick = true;
    },

    startGame: function () {
      game.state.start("Game");
    }
}