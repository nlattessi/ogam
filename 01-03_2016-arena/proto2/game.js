var Proto2 = {};

Proto2.Preloader = function() {};

Proto2.Preloader.prototype = {

  init : function () {

    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignHorizontally = true;

  },

  preload : function () {

    this.load.path = 'assets/';

    this.load.bitmapFont('fat-and-tiny');

    this.load.images([ 'logo', 'fish', 'hook', 'worm1', 'worm2', 'undersea', 'back', 'cave', 'wallH', 'bones' ]);

  },

  create : function () {

    //this.state.start('Proto2.MainMenu');
    this.state.start('Proto2.Game');

  }
};

Proto2.MainMenu = function () {};

Proto2.MainMenu.prototype = {

  create : function () {

    //var logo = this.add.image(this.world.centerX, 140, 'logo');
    //logo.anchor.x = 0.5;

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

  this.floor = null;

  this.player = null;
  this.worms = null;

  this.cursors = null;

  this.pauseKey = null;
  this.debugKey = null;
  this.showDebug = false;

  this.wormReleaseRate = 1500;

};

Proto2.Game.prototype = {

  init : function () {

    this.showDebug = false;

  },

  create : function () {

    //cathis.add.image(0, 0, 'undersea');
    //this.physics.startSystem(Phaser.Physics.ARCADE);

    this.worms = this.add.physicsGroup();
    this.worms.alpha = 0.8;

    this.player = this.add.sprite(360, 236, 'fish');
    this.player.anchor.set(0.5);
    this.player.eating = Phaser.LEFT;

    this.physics.arcade.enable(this.player);

    //this.player.body.setSize(16, 16, 0, 0);
    this.player.body.collideWorldBounds = true;
    this.player.body.gravity.y = 500;

    //this.physics.arcade.gravity.y = 500;

    this.floor = this.add.physicsGroup();
    //game.add.sprite(-100, 160, 'wallH', 0, this.floor); // Middle left
    game.add.sprite(0, 280, 'wallH', 0, this.floor); // Middle right
    game.add.sprite(200, 280, 'wallH', 0, this.floor); // Middle right
    game.add.sprite(400, 280, 'wallH', 0, this.floor); // Middle right
    game.add.sprite(600, 280, 'wallH', 0, this.floor); // Middle right
    game.add.sprite(800, 280, 'wallH', 0, this.floor); // Middle right
    this.floor.setAll('body.immovable', true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.releaseItem();

    // P for pause and resume
    this.pauseKey = this.input.keyboard.addKey(Phaser.Keyboard.P);
    this.pauseKey.onDown.add(this.togglePause, this);

    // D for debug display
    this.debugKey = this.input.keyboard.addKey(Phaser.Keyboard.D);
    this.debugKey.onDown.add(this.toggleDebug, this);

  },

  togglePause : function () {

    this.game.paused = (this.game.paused) ? false : true;

  },

  toggleDebug : function () {

    console.log(this.showDebug);

    this.showDebug = (this.showDebug) ? false : true;

  },

  update : function () {

    this.physics.arcade.collide(this.player, this.floor);
    this.physics.arcade.collide(this.worms, this.floor);

    this.player.body.velocity.x = 0;

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -300;
      this.faceLeft();
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 300;
      this.faceRight();
    }

    // if (this.cursors.up.isDown && this.player.body.touching.down) {
    //   this.player.body.velocity.y = -320;
    // }

    this.physics.arcade.overlap(this.player, this.worms, this.checkWorm, null, this);

  },

  faceLeft : function () {

    this.player.angle = 0;
    this.player.scale.set(-1, 1);
    this.player.facing = Phaser.RIGHT;

  },

  faceRight : function () {

    this.player.angle = 0;
    this.player.scale.set(1, 1);
    this.player.facing = Phaser.LEFT;

  },

  checkWorm : function (fish, worm) {

    if (fish.facing === worm.body.facing) {
      worm.kill();
    } else {
      this.killPlayer();
    }

  },

  killPlayer : function () {
    var bones = this.add.sprite(this.player.x, this.player.y, 'bones');

    bones.anchor.set(0.5);
    bones.angle = this.player.angle;
    bones.scale.copyFrom(this.player.scale);

    this.add.tween(bones).to( { y: 200, alpha: 0 }, 3000, "Linear", true);

    this.player.kill();

    this.time.events.add(3000, this.gameOver, this);

  },

  gameOver : function () {

    this.state.start('Proto2.Game');

  },

  releaseItem : function () {

    if (Phaser.Utils.chanceRoll(20)) {
      var item = this.worms.getFirstDead(true, 0, 0, 'worm1');
    } else {
      var item = this.worms.getFirstDead(true, 0, 0, 'worm2');
    }

    var direction = this.rnd.between(1, 2);

    if (direction === Phaser.LEFT) {
      item.x = 0;
      item.y = 248;
      //item.body.gravity.y = 500;
      item.body.velocity.x = 150;
    } else if (direction === Phaser.RIGHT) {
      item.x = 968;
      item.y = 248;
      //item.body.gravity.y = 500;
      item.body.velocity.x = -150;
    }

    this.time.events.add(this.wormReleaseRate, this.releaseItem, this);

    if (this.wormReleaseRate > 250) {
        this.wormReleaseRate -= 20;
    }

  },

  render : function () {

    if (this.showDebug) {
      this.game.debug.body(this.player);
    }

  }

};

var game = new Phaser.Game(1000, 300, Phaser.AUTO, 'game');

game.state.add('Proto2.Preloader', Proto2.Preloader);
game.state.add('Proto2.MainMenu', Proto2.MainMenu);
game.state.add('Proto2.Game', Proto2.Game);

game.state.start('Proto2.Preloader');
