// used for help
//https://www.youtube.com/watch?v=7cpZ5Y7THmo&t=79s
//https://www.youtube.com/watch?v=88DS3Z8nOdY&t=7s
//one other im working on locating

//Game by Joel Hockin 2020 for Gaming Frameworks For Web
//Use Arrow Keys to Move


//Starting Variables
let game;
let cursors;
let spaceBar;
let jump = 0;
let spawnX = 60;
let spawnY = 1170;
let spawnSlot = 0;
let zoom = 200;
let canDoubleJump = false;
let gameOptions = {
    // player gravity
    playerGravity: 900,
    // player friction when on wall
    playerGrip: 100,
    // player jump force
    playerJump: 400,
    // player double jump force
    playerDoubleJump: 300,
    // player dash
    playerDash:3000,
    // trampoline tile impulse
    trampolineImpulse: 500
}
// constants to index interactable blocks
const STOP_TILE = 2;
const SPAWN_TILE = 11;
const DIE_TILE = 6;
const DJUMP_TILE = 8;
const TRAMPOLINE_TILE = 3;

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        width: 1280,
        height: 860,
        backgroundColor: 0x000000,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
       scene: [preloadGame, playGame]
    }
    game = new Phaser.Game(gameConfig);
}
class preloadGame extends Phaser.Scene{
    constructor(){
        super("PreloadGame");
    }
    preload(){
        this.load.tilemapTiledJSON("level", "level.json");
        this.load.image("tile", "tile.png");
        this.load.image("hero", "hero.png");
    }
    create(){
        this.scene.start("PlayGame");
    }
}
class playGame extends Phaser.Scene{
    constructor(){
        super("PlayGame");
    }
    
    
    //Jump Function
    handleJump(){
        if(this.canJump == true){
             if(jump == 1){
                // applying jump force
                this.hero.body.velocity.y = -gameOptions.playerJump, this;
                jump = 2;
            }
            
            if(canDoubleJump == true){
                if(jump == 3){
                        this.hero.body.velocity.y =-gameOptions.playerDoubleJump, this;
                        // the hero can't double jump anymore
                    jump = 4;
                }
            }
        }
    }
    
    //Death Function which resets position based on the last interacted with checkpoint
    death(){
        if(spawnSlot == 1){
            spawnX = 1100;
            spawnY = 900;
        }
        if(spawnSlot == 2){
            spawnX = 1416;
            spawnY = 830;
        }
        if(spawnSlot == 3){
            spawnX = 1800;
            spawnY = 400;
        }
        if(spawnSlot == 4){
            spawnX = 1189;
            spawnY = 260;
        }
        
        if(spawnSlot == 5){
            spawnX = 553;
            spawnY = 950;
        }
        
        if(spawnSlot == 6){
            spawnX = 328;
            spawnY = 300;
        }
        this.hero = this.physics.add.sprite(spawnX, spawnY, "hero");
        this.cameras.main.startFollow(this.hero);
    }
    
    //Setup for game
    create(){
         cursors = this.input.keyboard.createCursorKeys();
        // creation of "level" tilemap
        this.map = this.make.tilemap({
            key: "level"
        });
        // adding tiles to tilemap
        let tile = this.map.addTilesetImage("tileset01", "tile");
        // which layers should we render? That's right, "layer01"
        this.layer = this.map.createStaticLayer("layer01", tile);
        this.layer.setCollisionBetween(1, 3);
        this.layer.setCollisionBetween(6, 6);
        this.layer.setCollisionBetween(9,11);
        // adding the hero sprite and enabling ARCADE physics for the hero
        this.hero = this.physics.add.sprite(spawnX, spawnY, "hero"); //home is 60 1180
        // setting hero horizontal speed
        //this.hero.body.velocity.x = gameOptions.playerSpeed;
        // the hero is not on the wall 
        this.onWall = false;
        // waiting for player input
        //this.input.keyboard.on("keydown-S", this.handleJump, this);
        // set workd bounds to allow camera to follow the player
        this.cameras.main.setZoom(1.75);
        // making the camera follow the player
        this.cameras.main.startFollow(this.hero);
    }
    
    // Game Loop
    update(){
        
        //for controlling double jump unlock
            //console.log(canDoubleJump);
        
        //for finding state of jump during developement
            //console.log(jump);
        
        //For finding position of hero in devellopement
            //console.log(this.hero.body.position.x, this.hero.body.position.y );
        
        this.canJump = true;
        this.setDefaultValues();
        
        
        // handling collision between the hero and the tiles
        this.physics.world.collide(this.hero, this.layer, function(hero, layer){
            // should the player stop?
            let shouldStop = false;
            // some temporary variables to determine if the player is blocked only once
            let blockedUp = hero.body.blocked.up;
            let blockedDown = hero.body.blocked.down;
            let blockedLeft = hero.body.blocked.left;
            let blockedRight = hero.body.blocked.right;
            // hero on the ground
            if(blockedDown){
                // hero can jump
                this.canJump = true;
                jump = 0;
                // if we are on tile 2 stop
                if(layer.index == STOP_TILE){
                    // player should stop
                    shouldStop = true;
                    this.canJump = false;
                } else {this.canJump = true;
                       }
                //if on death tile, die
                 if(layer.index == DIE_TILE){
                     this.death();
                 }
                // if we are on a trampoline and previous player velocity was greater than zero
                if(layer.index == TRAMPOLINE_TILE && this.previousYVelocity > 0){
                    // trampoline jump
                    jump = 1;
                    hero.body.velocity.y = -gameOptions.trampolineImpulse;
                    jump = 2
                }
            }
            //death tile upwards check
            else if(blockedUp){
                if(layer.index == DIE_TILE){
                     this.death();
                 } 
            }
            //Checkoint Block check and reasignment of spawn based on relative position to that checkpoint
            if(blockedDown){
                if(layer.index == SPAWN_TILE){
                    if(this.hero.body.position.x > 900 && this.hero.body.position.x < 1158 && this.hero.body.position.y > 900 && this.hero.body.position.y < 1200){
                        spawnSlot = 1;
                    }
                    else if(this.hero.body.position.x > 1200 && this.hero.body.position.x < 1600 && this.hero.body.position.y > 700 && this.hero.body.position.y < 1000){
                        spawnSlot = 2;
                    }
                    else if(this.hero.body.position.x > 1700 && this.hero.body.position.x < 1900 && this.hero.body.position.y > 300 && this.hero.body.position.y < 500){
                        spawnSlot = 3;
                    }
                    else if(this.hero.body.position.x > 1092 && this.hero.body.position.x < 1350 && this.hero.body.position.y > 230 && this.hero.body.position.y < 430){
                        spawnSlot = 4;
                        //unlock double jump
                        canDoubleJump = true;
                    }
                     else if(this.hero.body.position.x > 490 && this.hero.body.position.x < 680 && this.hero.body.position.y > 900 && this.hero.body.position.y < 1120){
                        spawnSlot = 5;
                    }
                    else if(this.hero.body.position.x > 270 && this.hero.body.position.x < 390 && this.hero.body.position.y > 280 && this.hero.body.position.y < 380){
                        spawnSlot = 6;
                         //unlock double jump
                        canDoubleJump = true;
                    }
                }  
            }
            
            // hero NOT on the ground and touching a wall
            else if((blockedRight || blockedLeft) && !blockedDown){
                // hero on a wall
                hero.scene.onWall = true;
                // remove gravity
                hero.body.gravity.y = 600;
                // setting new y velocity
                hero.body.velocity.y = gameOptions.playerGrip;
            }
        }, null, this);
        // saving current vertical velocity
        this.previousYVelocity = this.hero.body.velocity.y;
        
        
        
     //----------------------walking controls
            if (Phaser.Input.Keyboard.JustDown(cursors.up)){ 
                if(jump == 2){
                jump = 3;
                this.handleJump();
                 }
                 else if (jump == 0){   
                jump = 1;
                this.handleJump();
                 } 
            }
            if (cursors.left.isDown){
                this.hero.flipX = true;
                this.hero.body.setVelocityX(-200);
                }
            if (cursors.right.isDown){
                this.hero.flipX = false;
                this.hero.body.setVelocityX(200);
                }
            if ( cursors.up.isUp && cursors.right.isUp && cursors.left.isUp ){
                this.hero.body.setVelocityX(0);
            }
        }
    // default values to be set at the beginning of each update cycle,
    // which may be changed according to what happens into "collide" callback function
    setDefaultValues(){
        this.hero.body.gravity.y = gameOptions.playerGravity;
        this.onWall = false;
    }
 }
