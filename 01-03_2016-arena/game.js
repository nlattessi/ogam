var gameState = {
  preload: function() {
    game.load.spritesheet('player1', 'enemy.png', 32, 32);
    game.load.image('bullet1', 'bullet.png');
    game.load.spritesheet('player2', 'shooting-enemy.png', 32, 32);
    game.load.image('bullet2', 'enemy-bullet.png');
  },

  create: function() {
    game.stage.backgroundColor = '#3498db';
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.player1 = game.add.sprite(game.world.centerX, game.world.centerY - 50, 'player1');
    this.player1.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this.player1);
    this.player1.speed = 300;
    this.player1.body.collideWorldBounds = true;
    this.player1.moveLeft = false;
    this.player1.moveRight = false;
    this.player1.moveUp = false;
    this.player1.moveDown = true;

    this.player2 = game.add.sprite(game.world.centerX, game.world.centerY + 50, 'player2');
    this.player2.angle += 180;
    this.player2.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this.player2);
    this.player2.speed = 300;
    this.player2.body.collideWorldBounds = true;
    this.player2.moveLeft = false;
    this.player2.moveRight = false;
    this.player2.moveUp = true;
    this.player2.moveDown = false;

    this.bullet1Pool = this.add.group();
    this.bullet1Pool.enableBody = true;
    this.bullet1Pool.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullet1Pool.createMultiple(100, 'bullet1');
    this.bullet1Pool.setAll('anchor.x', 0.5);
    this.bullet1Pool.setAll('anchor.y', 0.5);
    this.bullet1Pool.setAll('outOfBoundsKill', true);
    this.bullet1Pool.setAll('checkWorldBounds', true);
    this.nextShot1At = 0;
    this.shot1Delay = Phaser.Timer.SECOND * 0.5;

    this.bullet2Pool = this.add.group();
    this.bullet2Pool.enableBody = true;
    this.bullet2Pool.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullet2Pool.createMultiple(100, 'bullet2');
    this.bullet2Pool.setAll('anchor.x', 0.5);
    this.bullet2Pool.setAll('anchor.y', 0.5);
    this.bullet2Pool.setAll('outOfBoundsKill', true);
    this.bullet2Pool.setAll('checkWorldBounds', true);
    this.nextShot2At = 0;
    this.shot2Delay = Phaser.Timer.SECOND * 0.5;

    this.cursor = game.input.keyboard.createCursorKeys();

    this.wasd = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D),
      fire: game.input.keyboard.addKey(Phaser.Keyboard.F)
    };
  },

  update: function() {
    game.physics.arcade.overlap(this.player1, this.bullet2Pool, this.playerHit, null, this);
    game.physics.arcade.overlap(this.player2, this.bullet1Pool, this.playerHit, null, this);

    this.player1.body.velocity.x = 0;
    this.player1.body.velocity.y = 0;

    if (this.cursor.left.isDown) {
      this.player1.body.velocity.x = -this.player1.speed;
      this.player1.moveLeft = true;
      this.player1.moveRight = false;
      this.player1.moveUp = false;
      this.player1.moveDown = false;
    } else if (this.cursor.right.isDown) {
      this.player1.body.velocity.x = this.player1.speed;
      this.player1.moveLeft = false;
      this.player1.moveRight = true;
      this.player1.moveUp = false;
      this.player1.moveDown = false;
    }

    if (this.cursor.up.isDown) {
      this.player1.body.velocity.y = -this.player1.speed;
      this.player1.moveLeft = false;
      this.player1.moveRight = false;
      this.player1.moveUp = true;
      this.player1.moveDown = false;
    } else if (this.cursor.down.isDown) {
      this.player1.body.velocity.y = this.player1.speed;
      this.player1.moveLeft = false;
      this.player1.moveRight = false;
      this.player1.moveUp = false;
      this.player1.moveDown = true;
    }

    if (this.input.keyboard.isDown(Phaser.Keyboard.M)) {

      if (this.nextShot1At > game.time.now) {

      } else {
        this.nextShot1At = game.time.now + this.shot1Delay;

        var bullet1 = this.bullet1Pool.getFirstExists(false);
        bullet1.reset(this.player1.x, this.player1.y);
        bullet1.body.velocity.x = this.player1.moveLeft ? -150 : this.player1.moveRight ? 150 : 0;
        bullet1.body.velocity.y = this.player1.moveUp ? -150 : this.player1.moveDown ? 150 : 0;
      }

    }

    this.player2.body.velocity.x = 0;
    this.player2.body.velocity.y = 0;

    if (this.wasd.left.isDown) {
      this.player2.body.velocity.x = -this.player2.speed;
      this.player2.moveLeft = true;
      this.player2.moveRight = false;
      this.player2.moveUp = false;
      this.player2.moveDown = false;
    } else if (this.wasd.right.isDown) {
      this.player2.body.velocity.x = this.player2.speed;
      this.player2.moveLeft = false;
      this.player2.moveRight = true;
      this.player2.moveUp = false;
      this.player2.moveDown = false;
    }

    if (this.wasd.up.isDown) {
      this.player2.body.velocity.y = -this.player2.speed;
      this.player2.moveLeft = false;
      this.player2.moveRight = false;
      this.player2.moveUp = true;
      this.player2.moveDown = false;
    } else if (this.wasd.down.isDown) {
      this.player2.body.velocity.y = this.player1.speed;
      this.player2.moveLeft = false;
      this.player2.moveRight = false;
      this.player2.moveUp = false;
      this.player2.moveDown = true;
    }

    if (this.wasd.fire.isDown) {

      if (this.nextShot2At > game.time.now) {

      } else {
        this.nextShot2At = game.time.now + this.shot2Delay;

        var bullet2 = this.bullet2Pool.getFirstExists(false);
        bullet2.reset(this.player2.x, this.player2.y);
        bullet2.body.velocity.x = this.player2.moveLeft ? -150 : this.player2.moveRight ? 150 : 0;
        bullet2.body.velocity.y = this.player2.moveUp ? -150 : this.player2.moveDown ? 150 : 0;
      }

    }
  },

  playerHit: function(player, bullet) {
    bullet.kill();
    player.kill();
  },

};

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'gameDiv');
game.state.add('game', gameState);
game.state.start('game');
