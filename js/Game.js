var Platform = Platform || {};
var pixel = { scale: 4, canvas: null, context: null, width: 0, height: 0 };
var isMobile = !!navigator.userAgent.match(/iphone|android|blackberry/ig) || false;
var gameOver = false;
var getAllGems = false;
var gameLevel = 1;
var button;

Platform.Game = function () { };

Platform.Game.prototype = {
  preload: function () {
    this.game.time.advancedTiming = true;
  },

  create: function () {
    gameOver = false;
    getAllGems = false;

    //Set BG
    this.bg = this.game.add.tileSprite(0, 0, 320, 160, 'bg');

    //Score
    this.score = 0;

    //TileMap
    if (gameLevel === 1) {
      this.tilemap = this.game.add.tilemap('map');
    } else {
      this.tilemap = this.game.add.tilemap('mapL2');
    }
    this.tilemap.addTilesetImage('tiles', 'tiles');

    //Tile Map Layers
    this.backgroundlayer = this.tilemap.createLayer('backgroundLayer');
    this.blockedLayer = this.tilemap.createLayer('blockedLayer');
    this.frontLayer = this.tilemap.createLayer('frontLayer');

    //Collisions
    this.tilemap.setCollisionBetween(1, 100000, true, 'blockedLayer');
    this.tilemap.setCollisionBetween(1, 100000, true, 'frontLayer');

    //Match player world
    this.blockedLayer.resizeWorld();

    //Gems
    this.gems = this.game.add.group();

    // Add gems
    for (var i = 0; i < 10; i++) {
      this.gems.create(this.game.world.randomX, this.game.world.randomY, 'gem', 0);
    }

    // Add gravity and kill the ones that are not in a visible area
    this.gems.forEach(function (gem) {
      this.game.physics.arcade.enable(gem);
      gem.anchor.setTo(0.5, 0.5);
      gem.body.gravity.y = 100;
      gem.animations.add('spin', [0, 1, 2, 3]);
      gem.play('spin', 10, true);
      gem.events.onOutOfBounds.add(this.gemOOB, this);
      gem.checkWorldBounds = true;
    }, this);

    //  Create Yaka

    this.player = this.game.add.sprite(10, 50, 'player');
    this.game.physics.arcade.enable(this.player);
    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 300;
    this.player.body.collideWorldBounds = true;
    this.game.camera.follow(this.player);

    //  Walking
    this.player.animations.add('walk', [0, 1, 2], 10, true);

    this.player.anchor.setTo(.5, .5);

    //  Keybboard map
    this.cursors = this.game.input.keyboard.createCursorKeys();

    //Audio
    this.sounds = {
      jump: this.game.add.audio('jump'),
      gem: this.game.add.audio('gem'),
      bg: this.game.add.audio('bg'),
      death: this.game.add.audio('death'),
      win: this.game.add.audio('win')
    };

    this.sounds.bg.volume = 0.9;
    this.sounds.bg.loop = true;
    this.sounds.bg.play();

    //Mobile
    if (isMobile) {
      this.initGameController();
    };
  },

  update: function () {
    var _this = this;

    //  Collision
    this.game.physics.arcade.collide(this.player, this.blockedLayer, null, null, this);
    this.game.physics.arcade.collide(this.player, this.frontLayer, this.playerHitLava, null, this);
    this.game.physics.arcade.collide(this.player, this.gems, this.playerHitGem, null, this);
    this.game.physics.arcade.collide(this.gems, this.blockedLayer);

    this.player.body.velocity.x = 0;

    if (!isMobile) {
      if (this.cursors.left.isDown) {
        this.player.scale.x = -1;
        this.player.body.velocity.x = -100;
        this.player.animations.play('walk');
      }
      else if (this.cursors.right.isDown) {
        this.player.scale.x = 1;
        this.player.body.velocity.x = 100;
        this.player.animations.play('walk');
      }
      else {
        this.player.animations.stop();
        this.player.frame = 5;
      }

      if (this.cursors.up.isDown && this.player.body.blocked.down) {
        this.player.body.velocity.y = -160;
        this.sounds.jump.play();
      }

      if (this.cursors.up.isDown) {
        this.player.animations.stop();
        this.player.frame = 4;
      }
    }
  },

  playerHitLava: function (player, lava) {
    this.sounds.death.play();
    gameOver = true;
    this.sounds.bg.destroy();
    this.game.state.start('Game');
  },

  gemOOB: function (gem) {
    gem.kill();
  },

  playerHitGem: function (player, gem) {
    gem.kill();
    this.sounds.gem.play();
    this.score++;
    if (this.gems.countLiving() == 0) {
      getAllGems = true;
    }
  },

  initLevel2: function () {
    console.log("L2")
    gameLevel++;
    gameOver = true;
    this.game.state.start('Game');
  },

  init: function () {
    this.game.canvas.style['display'] = 'none';
    if (!isMobile) pixel.canvas = Phaser.Canvas.create(window.innerWidth, this.game.height * (window.innerHeight / this.game.height));
    if (isMobile) pixel.canvas = Phaser.Canvas.create((window.innerHeight / (this.game.height / this.game.width)), window.innerHeight);
    pixel.context = pixel.canvas.getContext('2d');
    Phaser.Canvas.addToDOM(pixel.canvas);
    pixel.canvas.setAttribute('id', 'scaled');
    Phaser.Canvas.setSmoothingEnabled(pixel.context, false);
    pixel.width = pixel.canvas.width;
    pixel.height = pixel.canvas.height;
  },

  sleep: function (num) {
    var now = new Date();
    var stop = now.getTime() + num;
    while (true) {
      now = new Date();
      if (now.getTime() > stop) return;
    }
  },

  render: function () {
    this.game.debug.text('Level:' + gameLevel, 10, 14, "#fff", "Courier");
    this.game.debug.text('Score:' + this.score, 172, 14, "#fff", "Courier");
    if (gameOver) this.game.debug.text('Don\'t hit the Acid Creek!', 50, 100, "#FFA000", "Courier");
    if (getAllGems && gameLevel !== 2) {
      this.sounds.win.play();
      this.sounds.bg.destroy();
      this.game.debug.text('LEVEL COMPLETED!', 35, 50, "#0095CD", "16px Courier");
      this.game.debug.text('GET READY FOR LEVEL 2', 30, 60, "#0095CD", "11px Courier");
      this.initLevel2();
    } else if (getAllGems && gameLevel === 2) {
      this.sounds.win.play();
      this.sounds.bg.destroy();
      this.game.debug.text('YOU HAVE WON!', 50, 50, "#0095CD", "16px Courier");
    }
    pixel.context.drawImage(this.game.canvas, 0, 0, this.game.width, this.game.height, 0, 0, pixel.width, pixel.height);
  },

  initGameController: function () {
    if (!GameController.hasInitiated) {
      var _this = this;

      if (_this.player.body.velocity.x === 0) {
        this.player.frame = 5;
      };

      GameController.init({
        forcePerformanceFriendly: true,
        left: {
          type: 'dpad',
          position: { left: '30%', bottom: '20%' },
          dpad: {
            up: false,
            down: false,
            left: {
              width: '45%', height: '20%',
              touchMove: function () {
                _this.player.body.velocity.x = -100;
                _this.player.animations.play('walk');
              },
              touchStart: function () {
                _this.player.scale.x = -1;
                _this.player.animations.play('walk');
              },
              touchEnd: function () {
                _this.player.body.velocity.x = 0;
                _this.player.animations.stop('walk');
                _this.player.frame = 5;
              }
            },
            right: {
              width: '45%', height: '20%',
              touchMove: function () {
                _this.player.body.velocity.x = 100;
                _this.player.animations.play('walk');
              },
              touchStart: function () {
                _this.player.scale.x = 1;
                _this.player.animations.play('walk');
              },
              touchEnd: function () {
                _this.player.body.velocity.x = 0;
                _this.player.animations.stop('walk');
                _this.player.frame = 5;
              }
            }
          }
        },
        right: {
          type: 'buttons',
          position: { right: '15%', bottom: '45%' },
          buttons: [
            {
              label: 'jump',
              fontSize: 15,
              radius: 50,
              touchStart: function () {
                if (_this.player.body.blocked.down) {
                  _this.player.body.velocity.y = -160;
                  _this.player.animations.stop();
                  _this.player.frame = 4;
                  _this.sounds.jump.play();
                };
              },
              touchEnd: function () {
                _this.player.body.velocity.y = 0;
                _this.player.frame = 5;
              }
            },
            false, false, false
          ]
        }
      });

      GameController.hasInitiated = true;
    }
  },
};