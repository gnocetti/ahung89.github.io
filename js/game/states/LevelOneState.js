require('../Common');

var Player = require('../Player');
var LandDog = require('../enemies/LandDogs');

// Indices of tile types that represent empty space
var EMPTY_SPACE_TILES = [21];
var PADDLE_SPEED = 130;

LevelOneState = function() {
	this.landDogSpawnLocations = [{x:10, y:10}, {x:18, y:8}, {x:27, y:8}, {x:38, y:10},
	{x:43, y:10}, {x: 72, y:5}, {x: 126, y:5}, {x: 142, y:5}, {x: 146, y:5}];

	this.startingCameraPosX = 0;
	this.startingCameraPosY = 0;
	this.spawnPosX = 32;
	this.spawnPosY = 150;

	this.enemies = [];

	this.map = null;
    this.layer = null;
    this.movingPlatforms = null;

    //Territory size is the number of tiles that the platform will move before turning around.
    this.movingPlatformSettings = [{x:98, y:6, territorySize:6, speed:PADDLE_SPEED, initialDirection:'right'},
    {x:120, y:6, territorySize:6, speed:PADDLE_SPEED, initialDirection:'left'},
    {x:124, y:6, territorySize:6, speed:PADDLE_SPEED, initialDirection:'right'},
    {x:140, y:6, territorySize:6, speed:PADDLE_SPEED, initialDirection:'left'},
    {x:144, y:6, territorySize:6, speed:PADDLE_SPEED, initialDirection:'right'},
    {x:160, y:6, territorySize:6, speed:PADDLE_SPEED, initialDirection:'left'}];

	level = this;
}

LevelOneState.prototype = {
	preload: function() {
		this.game.load.tilemap('levelOne', 'assets/levels/levelOne.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('levelOneTiles', 'assets/tiles/platformer_tiles_doubled.png');
		this.game.load.image('platform', 'assets/sprites/paddle-small.png');
		game.load.spritesheet('baddie', 'assets/sprites/baddie.png', 32, 32);

		player = new Player(game, this.spawnPosX, this.spawnPosY);
		player.preload();
	},

	create: function() {
		player.create();

		game.physics.arcade.setBoundsToWorld();

		this.map = this.game.add.tilemap('levelOne');
		this.map.addTilesetImage('platformer_tiles_doubled', 'levelOneTiles');

		this.setTileCollisions();

		//	The argument must match the layers.name field in your json file.
		//	Creates a TilemapLayer - a TilemapLayer is a set of map data combined with a Tileset.
		this.layer = this.map.createLayer('World');

		this.createPlatforms();

		this.layer.resizeWorld();

		this.createEnemies(LandDog, this.landDogSpawnLocations);
	},

	createEnemies: function(EnemyType, spawnLocations) {
		spawnLocations.forEach(function(location) {
			this.enemies.push(new EnemyType(location.x * TILE_SIZE, location.y * TILE_SIZE));
		}, this);
	},

	createPlatforms: function() {
		this.movingPlatforms = game.add.group();

		 this.movingPlatformSettings.forEach(function(settings) {
		 	var platform = this.movingPlatforms.create(TILE_SIZE * settings.x, TILE_SIZE * settings.y, 'platform');
		 	game.physics.arcade.enable(platform);
		 	platform.enableBody = true;
		 	if(settings.initialDirection === 'right') {
		 		platform.leftBounds = platform.body.x;
		 		platform.rightBounds = platform.body.x + (TILE_SIZE * settings.territorySize);
		 		platform.body.velocity.x = settings.speed;
		 	} else if(settings.initialDirection === 'left') {
		 		platform.leftBounds = platform.body.x - (TILE_SIZE * settings.territorySize);
		 		platform.rightBounds = platform.body.x;
		 		platform.body.velocity.x = settings.speed * -1;
		 	}

		 	platform.body.immovable = true; //So that it doesn't fall when you jump on it.
		 }, this);
	},

	setTileCollisions: function() {
		//	setCollisionBetween - this method sets collision on a range of tiles by tile ID (inclusive at both ends of the range)
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
		this.movePlatforms();
		game.physics.arcade.collide(player.sprite, this.movingPlatforms);
		//game.physics.arcade.collide(this.landDogs.enemies, this.movingPlatforms);

		player.update();
		
		this.enemies.forEach(function(enemy) {
			enemy.update();
		});
	},

	movePlatforms: function() {
		this.movingPlatforms.forEach(function(platform) {
			if(platform.body.position.x < platform.leftBounds) {
				platform.body.velocity.x *= -1;
				platform.body.position.x += 1;
			}	
			if(platform.body.position.x > platform.rightBounds) {
				platform.body.velocity.x *= -1;
				platform.body.position.x -= 1;
			} 
		})
	},

	restart: function() {
		this.killAllPlatforms();
		this.createPlatforms();
	},

	killAllPlatforms: function() {
		this.movingPlatforms.forEach(function(platform) {
			platform.kill();
		});
	}
};

module.exports = LevelOneState;