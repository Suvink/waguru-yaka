var Platform = Platform || {};

//Load assets
Platform.Preload = function(){};

Platform.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    //TileMap
    this.load.tilemap('map', 'assets/tilemaps/map.json', null, Phaser.Tilemap.TILED_JSON);
    
    //Images
    this.load.image('menu-bg', 'assets/images/menu-bg.png');
    this.load.image('bg', 'assets/images/bg.png');
    this.load.image('tiles', 'assets/images/swamptex.png');

    //Sprites
    this.load.spritesheet('rain', 'assets/images/rain.png', 8, 8);
    this.load.spritesheet('player', 'assets/images/run.png', 16, 16);
    this.load.spritesheet('gem', 'assets/images/gem.png', 7, 7);
    
    //Audio
    this.load.audio('jump', ['assets/audio/jump.mp3']);
    this.load.audio('gem', ['assets/audio/pickup.mp3']);
    this.load.audio('bg', ['assets/audio/bg.mp3']);
    this.load.audio('death', ['assets/audio/lose.wav']);
    this.load.audio('win', ['assets/audio/win.wav']);
  },
  create: function() {
    this.state.start('Menu');
  }
};