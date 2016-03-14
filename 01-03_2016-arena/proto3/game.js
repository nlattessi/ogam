var Proto3 = {};

Proto3.Boot = function (game) {

  console.log("%cStarting my proto3 game", "color:white; background:red");

};

Proto3.Boot.prototype = {

  init : function () {

    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

  },

  preload : function () {

    this.load.path = 'assets/';
    this.load.image('loading');

  },

  create : function () {

    this.state.start('Proto3.Preloader');

  }

};

Proto3.Preloader = function () {};

Proto3.Preloader.prototype = {

  init : function () {},

  preload : function () {

    //this.stage.backgroundColor = '#2d2d2d';
    this.stage.backgroundColor = '#3498db';

    this.preloadBar = this.add.sprite(this.game.width / 2, this.game.height / 2, 'loading');
    this.preloadBar.anchor.set(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.path = 'assets/';

    this.load.bitmapFont('fat-and-tiny');

    this.load.images([ 'coin', 'dust', 'enemy', 'exp', 'ground', 'wall' ]);

    this.load.spritesheet('player', null, 28, 22);

  },

  create : function () {

    this.state.start('Proto3.MainMenu');

  }

};

Proto3.MainMenu = function () {};

Proto3.MainMenu.prototype = {

  init : function () {},

  preload : function () {},

  create : function () {

    var start = this.add.bitmapText(this.world.centerX, this.world.centerY, 'fat-and-tiny', 'CLICK TO PLAY', 64);
    start.anchor.set(0.5);
    start.smoothed = false;
    start.tint = 0xff0000;

    this.input.onDown.addOnce(this.start, this);

  },

  start : function () {

    this.state.start('Proto3.Game');

  }

};

Proto3.Game = function () {

  this.showDebug = null;

};

Proto3.Game.prototype = {

  init : function () {

    this.showDebug = false;

  },

  preload : function () {},

  create : function () {

    this.player = this.add.sprite(250, 50, 'player');
    this.player.anchor.set(0.5);
    this.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 600;
    this.player.animations.add('idle', [3, 4, 5, 4], 5, true);
		this.player.body.setSize(20, 20, 0, 0);
		this.player.anchor.set(0.5);

    this.level = this.add.group();
		this.level.enableBody = true;
		this.add.sprite(90, 200/2 -50, 'wall', 0, this.level);
		this.add.sprite(390, 200/2 -50, 'wall', 0, this.level);
		this.add.sprite(500/2 - 160, 200/2 +30, 'ground', 0, this.level);
		this.level.setAll('body.immovable', true);

		this.enemy = this.add.sprite(360, 120, 'enemy');
		this.physics.arcade.enable(this.enemy);
		this.enemy.anchor.setTo(0.5, 0.5);
    this.player.body.gravity.y = 600;

    if (!this.coins) {
			this.coins = this.add.group();
			this.coins.enableBody = true;
		}
		else {
			this.coins.forEachAlive(function(e){
				e.kill();
			}, this);
		}

		this.add.sprite(140, 120, 'coin', 0, this.coins);
		this.add.sprite(170, 120, 'coin', 0, this.coins);
		this.add.sprite(200, 120, 'coin', 0, this.coins);

		this.coins.forEachAlive(function(e){
			e.isTaken = false;
			e.scale.setTo(0,0);
			e.anchor.setTo(0.5);
			this.add.tween(e.scale).to({x:1, y:1}, 200).start();
		}, this);

  },

  update : function () {

    this.physics.arcade.collide(this.player, this.level);

  }

};


var game = new Phaser.Game(500, 200, Phaser.CANVAS, 'game');

game.state.add('Proto3.Boot', Proto3.Boot);
game.state.add('Proto3.Preloader', Proto3.Preloader);
game.state.add('Proto3.MainMenu', Proto3.MainMenu);
game.state.add('Proto3.Game', Proto3.Game);

game.state.start('Proto3.Boot');
