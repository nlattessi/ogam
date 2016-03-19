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

    this.state.start('Proto3.Game');

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

  this.player = null;
  this.enemies = null;

  this.showDebug = null;

};

Proto3.Game.prototype = {

  init : function () {
    this.showDebug = false;
  },

  create : function () {
    this.enemies = this.add.physicsGroup();
    this.enemies.alpha = 0.8;

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

    /*if (!this.coins) {
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
		}, this);*/

    this.spawnPlayer();

    this.cursors = this.game.input.keyboard.createCursorKeys();

    //  Press P to pause and resume the game
    this.pauseKey = this.input.keyboard.addKey(Phaser.Keyboard.P);
    this.pauseKey.onDown.add(this.togglePause, this);

    //  Press D to toggle the debug display
    this.debugKey = this.input.keyboard.addKey(Phaser.Keyboard.D);
    this.debugKey.onDown.add(this.toggleDebug, this);

    this.releaseEnemy();
  },

  update : function () {
    this.physics.arcade.collide(this.player, this.level);
    this.physics.arcade.collide(this.enemies, this.level);

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -200;
      this.player.frame = 2;
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 200;
      this.player.frame = 1;
    } else {
      this.player.body.velocity.x = 0;
    }

    if (this.player.body.velocity.x == 0) {
      this.player.animations.play('idle');
    }

    if (this.cursors.up.isDown) {
      this.playerJump();
    }

    this.physics.arcade.overlap(this.player, this.enemies, this.checkEnemy, null, this);
  },

  render : function () {
    if (this.showDebug) {
        this.game.debug.body(this.player);
        this.game.debug.body(this.enemy);
    }
  },

  toggleDebug : function () {
    this.showDebug = (this.showDebug) ? false : true;
  },

  togglePause : function () {
    this.game.paused = (this.game.paused) ? false : true;
  },

  spawnPlayer : function () {
    this.player.scale.setTo(0, 0);
    this.game.add.tween(this.player.scale).to({ x: 1, y: 1}, 300).start();
    this.player.reset(250, 50);
  },

  releaseEnemy : function () {
    var enemy = this.enemies.getFirstDead(true, 0, 0, 'enemy');
    var position = this.rnd.between(1, 2);

    if (position === Phaser.LEFT) {
      enemy.x = 120;
      enemy.y = 20;
      enemy.body.velocity.x = 100;
    } else if (position === Phaser.RIGHT) {
      enemy.x = 360;
      enemy.y = 20,
      enemy.body.velocity.x = -100;
    }

    enemy.anchor.set(0.5);
    enemy.body.gravity.y = 600;
    enemy.body.bounce.x = 1;

    this.time.events.add(1500, this.releaseEnemy, this);
  },

  spawnEnemy : function () {
    this.enemy = this.add.sprite(360, 20, 'enemy');
		this.physics.arcade.enable(this.enemy);
		this.enemy.anchor.setTo(0.5, 0.5);
    this.enemy.body.gravity.y = 600;
  },

  checkEnemy : function () {
    var move = 5;
    var time = 20;

    this.game.add.tween(this.level)
      .to({ y: "-" + move }, time).to({ y: "+" + move * 2 }, time * 2).to({ y: "-" + move }, time)
      .to({ y: "-" + move }, time).to({ y: "+" + move * 2 }, time * 2).to({ y: "-" + move }, time)
      .to({ y: "-" + move / 2 }, time).to({ y: "+" + move }, time * 2).to({ y: "-" + move / 2 }, time)
      .start()
    ;

    this.game.add.tween(this.level)
      .to({ x: "-" + move }, time).to({ x: "+" + move * 2 }, time * 2).to({ x: "-" + move }, time)
      .to({ x: "-" + move }, time).to({ x: "+" + move * 2 }, time * 2).to({ x: "-" + move }, time)
      .to({ x: "-" + move / 2 }, time).to({ x: "+" + move }, time * 2).to({ x: "-" + move / 2 }, time)
      .start()
    ;

    this.enemies.forEachAlive(function(e){
      this.game.add.tween(e)
        .to({ y: "-" + move }, time).to({ y: "+" + move * 2 }, time * 2).to({ y: "-" + move }, time)
        .to({ y: "-" + move }, time).to({ y: "+" + move * 2 }, time * 2).to({ y: "-" + move }, time)
        .to({ y: "-" + move / 2 }, time).to({ y: "+" + move }, time * 2).to({ y: "-" + move / 2 }, time)
        .start()
      ;

      this.game.add.tween(e)
        .to({ x: "-" + move }, time).to({ x: "+" + move * 2 }, time * 2).to({ x: "-" + move }, time)
        .to({ x: "-" + move }, time).to({ x: "+" + move * 2 }, time * 2).to({ x: "-" + move }, time)
        .to({ x: "-" + move / 2 }, time).to({ x: "+" + move }, time * 2).to({ x: "-" + move / 2 }, time)
        .start()
      ;
    }, this);

    this.spawnPlayer ();
  },

  playerJump : function () {
    if (this.player.body.touching.down && this.player.y > 100) {
      this.player.body.velocity.y = -220;
    }
  },

};


var game = new Phaser.Game(500, 200, Phaser.CANVAS, 'game');

game.state.add('Proto3.Boot', Proto3.Boot);
game.state.add('Proto3.Preloader', Proto3.Preloader);
game.state.add('Proto3.MainMenu', Proto3.MainMenu);
game.state.add('Proto3.Game', Proto3.Game);

game.state.start('Proto3.Boot');
