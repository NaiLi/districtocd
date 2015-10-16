
var w = window.innerWidth;
var h = window.innerHeight;

var tileSize = 40;//w/6;//40;
var cols = 6;
var rows = 10;


setTimeout(function() {
	window.scrollTo(0,1);	
}, 0);
var game = new Phaser.Game(tileSize*cols, tileSize*rows, Phaser.AUTO, '');

game.state.add('Intro', Intro);
game.state.add('Menu', Menu);
game.state.add('Game', Game);
game.state.add('GameOver', GameOver);

game.state.start('Menu');