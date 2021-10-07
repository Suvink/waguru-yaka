var Platform = Platform || {};
var canvas = { width: 240, height: 140 };

Platform.game = new Phaser.Game(canvas.width, canvas.height, Phaser.CANVAS, '');

Platform.game.state.add('Boot', Platform.Boot);
Platform.game.state.add('Preload', Platform.Preload);
Platform.game.state.add('Menu', Platform.Menu);
Platform.game.state.add('Game', Platform.Game);

Platform.game.state.start('Boot');
