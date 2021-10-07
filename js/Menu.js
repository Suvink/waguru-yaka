var Platform = Platform || {};

Platform.Menu = function (game) { };

Platform.Menu.prototype = {
    create: function() {
        this.menuBg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'menu-bg');
        this.menuBg.anchor.setTo(0.5);
    },

    init: function() {

      this.game.canvas.style['display'] = 'none';
      pixel.canvas = Phaser.Canvas.create((window.innerHeight / (this.game.height / this.game.width)), window.innerHeight);
      pixel.context = pixel.canvas.getContext('2d');
      Phaser.Canvas.addToDOM(pixel.canvas);
      pixel.canvas.setAttribute('id', 'scaled');
      Phaser.Canvas.setSmoothingEnabled(pixel.context, false);
      pixel.width = pixel.canvas.width;
      pixel.height = pixel.canvas.height;
    },

    render: function() {
      pixel.context.drawImage(this.game.canvas, 0, 0, this.game.width, this.game.height, 0, 0, pixel.width, pixel.height);
    },

    update: function() {
        this.game.input.keyboard.onDownCallback = function() {
            if (this.game.input.keyboard.event.keyCode === 13) {
                    this.game.state.start('Game');
            };   
        };
    }
};
