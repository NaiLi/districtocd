
var Information = {

	preload: function() {
		game.load.image('menu', './assets/leftIcon.png');
	},

  create: function () {

		game.stage.backgroundColor = '#ffff88'

    // Vars
    scores = this.getData();

    // Texts
    var textStyle         = { font: "20px Arial", fill: "#68327A", align: "center" };
    var textSmallStyle    = { font: "14px Arial", fill: "#68327A", align: "center" };
    var worldWrapWidth = game.world.width - 40;
    
    var text = "Game by\nLinnéa Nåbo\n\nRead more at:\nnaili.github.io";

    // Sprites
    var textSprite  = game.add.text(game.world.centerX, 120, text, textStyle);
    textSprite.anchor.setTo(0.5);
    textSprite.wordWrap = true;
    textSprite.wordWrapWidth = worldWrapWidth;
    
    var menuBtn = this.add.button(game.world.centerX, game.world.centerY+game.world.centerY/2, 'menu', this.toMenu, this); //CHANGE WHAT HAPPENS
    menuBtn.anchor.setTo(0.5);
    menuBtn.scale.setTo(0.5);
    
    credits = "Title image by Freepic";
    var credits  = game.add.text(game.world.centerX, game.world.height-5, credits, textSmallStyle);
    credits.anchor.x = 0.5;
    credits.anchor.y = 1;
    credits.wordWrap = true;
    credits.wordWrapWidth = worldWrapWidth;


		// Responsiveness
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //RESIZE? (better for desktop)
		game.scale.setScreenSize(true);

  },

  getData: function() {
    var data = JSON.parse(localStorage.getItem('scoreboard'));
    if(data && data.score) {
      return data.score;
    } else {
      return null;
    }
  },

  startGame: function () {
    game.state.start("Game");
  },

  toMenu: function() {
  	game.state.start("Menu");
  }
}
