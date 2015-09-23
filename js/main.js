var tileSize = 40;
var cols = 6;
var rows = 10;

var game = new Phaser.Game(tileSize*cols, tileSize*rows, Phaser.AUTO, '');

//game.state.add('Menu', Menu);

game.state.add('Game', Game);

game.state.start('Game');