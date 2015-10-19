var greeting = "Welcome to your everyday nightmare";
var introduced = false; 

var Menu = {

    preload : function() {
        //game.load.image('urban', './assets/urban_lilac_big.png');
        game.load.image('urban', './assets/urban.png');
        game.load.image('start', './assets/playIcon.png');
        game.load.image('score', './assets/trophyIcon.png');
        game.load.image('info', './assets/infoIcon.png');
        //game.load.image('bg', './assets/yellowBG.png');
    },

    create: function () {

  		game.stage.backgroundColor = '#ffff88'
      //localStorage.clear();

      // Add menu screen.
      var menuPic = game.add.sprite(game.world.centerX, game.world.centerY, 'urban');
      menuPic.anchor.x = 0.5;
      menuPic.anchor.y = 0.85;
      menuPic.scale.setTo(1.1);
      
      // It will act as a button to start the game.
      var startBtn = this.add.button(game.world.centerX, game.world.centerY+game.world.centerY/2.5, 'start', this.startGame, this);
      startBtn.anchor.x = 0.5;
      startBtn.anchor.y = 0.5;
      startBtn.scale.setTo(0.6);
      game.add.tween(startBtn.scale).to( {x: 0.73, y: 0.73}, 2000, Phaser.Easing.Linear.In, true, 0, 1000, true).start();
      game.add.tween(startBtn).to( {alpha: 0.8}, 800, Phaser.Easing.Linear.In, true, 0, 900, true).start();

      var scoreBtn = this.add.button(game.world.centerX-10, game.world.centerY+game.world.centerY-20, 'score', this.showScoreboard, this); //CHANGE WHAT HAPPENS
      scoreBtn.anchor.x = 1;
      scoreBtn.anchor.y = 1;
      scoreBtn.scale.setTo(0.5);
      var infoBtn = this.add.button(game.world.centerX+10, game.world.centerY+game.world.centerY-20, 'info', this.showInformation, this); //CHANGE WHAT HAPPENS
      infoBtn.anchor.x = 0;
      infoBtn.anchor.y = 1;
      infoBtn.scale.setTo(0.5);


  		// Responsiveness
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //RESIZE? (better for desktop)
			game.scale.setScreenSize(true);

    },

    startGame: function () {

      var introPlayed = JSON.parse(localStorage.getItem('intro_played'));
      if(introPlayed) {
        introduced = true;
        game.state.start("Game");
      }
      else
        game.state.start("Intro");
    },

    showScoreboard: function() {
      game.state.start("Scoreboard");
    },

    showInformation: function() {
      game.state.start("Information");
    }
}
