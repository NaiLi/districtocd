var title = "Scoreboard";
var scores;

var Scoreboard = {

	preload: function() {
		game.load.image('menu', './assets/menuBtn.png');
	},

  create: function () {

		game.stage.backgroundColor = '#ffff88'

    // Vars
    scores = this.getData();
    if(scores) 
      console.log(scores)

    // Texts
    var textStyle   = { font: "20px Arial", fill: "#68327A", align: "center" };
    var worldWrapWidth = game.world.width - 40;
    var text = "Scores:\n\n";
    if(scores) {
      scores.forEach(function(score) {
        text += score + "\n";
      });
    }

    // Sprites
    var textSprite  = game.add.text(game.world.centerX, 120, text, textStyle);
    textSprite.anchor.setTo(0.5);
    textSprite.wordWrap = true;
    textSprite.wordWrapWidth = worldWrapWidth;
    
    var menuBtn = this.add.button(game.world.centerX, game.world.centerY+50, 'menu', this.toMenu, this); //CHANGE WHAT HAPPENS
    menuBtn.anchor.setTo(0.5);


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
