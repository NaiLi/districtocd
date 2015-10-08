var title = "District OCD";
var greeting = "Welcome to your everyday nightmare";
var play = "Play";
var settings = "Settings";

var Menu = {

    preload : function() {
        //game.load.image('urban', './assets/urban_lilac_big.png');
        game.load.image('urban', './assets/urban-menu.png');
        game.load.image('start', './assets/button-start.png');
        game.load.image('score', './assets/button-score.png');
    },

    create: function () {

  		game.stage.backgroundColor = '#ffff88'

      // Add menu screen.
      var menuPic = game.add.sprite(game.world.centerX, game.world.centerY-20, 'urban');
      menuPic.anchor.setTo(0.5);
      
      // It will act as a button to start the game.
      var startBtn = this.add.button(game.world.centerX, game.world.centerY+90, 'start', this.startGame, this);
      startBtn.anchor.setTo(0.5);
      var scoreBtn = this.add.button(game.world.centerX, game.world.centerY+140, 'score', this.startGame, this); //CHANGE WHAT HAPPENS
      scoreBtn.anchor.setTo(0.5);


  		// Responsiveness
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //RESIZE? (better for desktop)
			game.scale.setScreenSize(true);

    },

    startGame: function () {

        // Change the state to the actual game.
        this.state.start('Game');

    }
}