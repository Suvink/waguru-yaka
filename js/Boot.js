var Platform = Platform || {};

Platform.Boot = function(){};

//Game configuration and loading the assets
Platform.Boot.prototype = {
  preload: function() {

    this.load.image('preloadbar', 'assets/images/preloader-bar.png');
  },
  create: function() {
    this.game.stage.backgroundColor = '#000';
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.state.start('Preload');
  }
};