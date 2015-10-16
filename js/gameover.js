var title = "So sorry,\n";
//var message = ["you were too slow...", "you lost your mind..."];

var GameOver = {

	preload: function() {
		game.load.image('retry', './assets/retryBtn.png');
		game.load.image('menu', './assets/menuBtn.png');
	},

  create: function () {

		game.stage.backgroundColor = '#ffff88'
    //BG
    //var menuBG = game.add.sprite(0, 0, 'bg');

    // Texts
    var textStyle   = { font: "20px Arial", fill: "#68327A", align: "center" };
    var worldWrapWidth = game.world.width - 40;
    var text = title + message[gameoverReason];

    var textSprite  = game.add.text(game.world.centerX, 80, text, textStyle);
    textSprite.anchor.setTo(0.5);
    textSprite.wordWrap = true;
    textSprite.wordWrapWidth = worldWrapWidth;
    
    // It will act as a button to start the game.
    var retryBtn = this.add.button(game.world.centerX, game.world.centerY, 'retry', this.startGame, this);
    retryBtn.anchor.setTo(0.5);
    
    var menuBtn = this.add.button(game.world.centerX, game.world.centerY+50, 'menu', this.toMenu, this); //CHANGE WHAT HAPPENS
    menuBtn.anchor.setTo(0.5);


		// Responsiveness
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //RESIZE? (better for desktop)
		game.scale.setScreenSize(true);

  },

  startGame: function () {
    game.state.start("Game");
  },

  toMenu: function() {
  	game.state.start("Menu");
  }
}
