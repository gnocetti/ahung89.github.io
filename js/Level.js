// Indices of tile types that represent empty space
var EMPTY_SPACE_TILES = [21];

Level = function(game) {
	this.game = game;
    this.stars = null;
 
    this.map = null;
    this.layer = null;
    this.collisionLayer = null;
    this.movingPlatforms = null;

    this.movingPlatformCoordinates = [{x:8, y:10}];
}

Level.prototype = {
	preload: function() {
		this.game.load.image('star', 'assets/star.png');
		this.game.load.tilemap('levelOne', 'assets/levelOne.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('levelOneTiles', 'assets/platformer_tiles_doubled.png');
		this.game.load.image('platform', 'assets/paddle-small.png');
	},

	create: function() {
		this.game.stage.backgroundColor = '#787878';

		this.game.physics.arcade.setBoundsToWorld();

		this.map = this.game.add.tilemap('levelOne');
		this.map.addTilesetImage('platformer_tiles_doubled', 'levelOneTiles');

		this.setTileCollisions();

		//	The argument must match the layers.name field in your json file.
		//	Creates a TilemapLayer - a TilemapLayer is a set of map data combined with a Tileset.
		this.layer = this.map.createLayer('World');

		this.createPaddles();

		this.layer.resizeWorld();
	},

	createPaddles: function() {
		 this.movingPlatforms = game.add.group();
		 platform = this.movingPlatforms.create(8 * TILE_SIZE, 10 * TILE_SIZE, 'platform');
		 platform.name = 'platformOne';
		 this.game.physics.arcade.enable(platform);
		 platform.leftBounds = platform.body.x;
		 platform.rightBounds = platform.body.x + 80;
		 platform.body.velocity.x = 100;
		 platform.body.immovable = true;
	},

	setTileCollisions: function() {
		//	setCollisionBetween - this method sets collision on a range of tiles by tile ID
		//	These numbers refer to the gid, or the index of the tile in the tileset (where the first tile is 1)
		this.map.setCollisionBetween(4, 7);
		this.map.setCollisionBetween(8, 12);
		this.map.setCollisionBetween(26, 35);
		this.map.setCollisionBetween(41, 53);
		this.map.setCollisionBetween(59, 72);
		this.map.setCollisionBetween(78, 84);
		this.map.setCollisionBetween(102, 103);
		this.map.setCollisionBetween(105, 108);
	},

	update: function() {
		game.physics.arcade.collide(this.stars, this.layer);
		game.physics.arcade.collide(enemies.enemies, this.layer);
		game.physics.arcade.collide(enemies.enemies, this.collisionLayer);
		this.movePlatform(platform);
		game.physics.arcade.collide(player.sprite, this.movingPlatforms);
		game.physics.arcade.collide(enemies.enemies, this.movingPlatforms);
	},

	movePlatform: function(platform) {
		if(platform.body.position.x < platform.leftBounds
			|| platform.body.position.x > platform.rightBounds) {
			platform.body.velocity.x *= -1;
		} 
	}
}