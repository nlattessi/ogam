var Proto2 = {};

Proto2.Preloader = function() {};

Proto2.Preloader.prototype = {

  init : function () {

    this.scale.pageAlignHorizontally = true;

  },

  preload : function () {

    this.load.path = 'assets/';

    this.load.bitmapFont('fat-and-tiny');

    this.load.images([ 'logo', 'fish', 'hook', 'worm1', 'worm2' ]);

  },

  create : function () {

    this.state.start('Proto2.MainMenu');

  }
};

Proto2.MainMenu = function () {};

Proto2.MainMenu.prototype = {

  create : function () {

    var logo = this.add.image(this.world.centerX, 140, 'logo');
    logo.anchor.x = 0.5;

    var start = this.add.bitmapText(this.world.centerX, 460, 'fat-and-tiny', 'CLICK TO PLAY', 64);
    start.anchor.x = 0.5;
    start.smoothed = false;
    start.tint = 0xff0000;

    this.input.onDown.addOnce(this.start, this);

  },

  start : function () {

    this.state.start('Proto2.Game');

  }

};


Proto2.Game = function (game) {

};

Proto2.Game.prototype = {

  init : function () {

  },

  create : function () {

  },

  update : function () {

  }

};

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

game.state.add('Proto2.Preloader', Proto2.Preloader);
game.state.add('Proto2.MainMenu', Proto2.MainMenu);
game.state.add('Proto2.Game', Proto2.Game);

game.state.start('Proto2.Preloader');
