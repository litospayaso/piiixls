export class Preloader extends Phaser.Scene {

    constructor() {
        super({
            key: 'preloader',
        });
    }

    preload() {
        this.load.image('buttonBG', 'assets/sprites/button-bg.png');
        this.load.image('ayu', 'assets/sprites/rick.png');
        // this.load.image('ball', 'assets/sprites/pangball.png');
        this.load.image('level1-background', 'assets/levels/level1/level1-background-image.png');
        this.load.image('ground', 'assets/sprites/platform.png');
        this.load.image('spikes', 'assets/sprites/spikes.png');
        this.load.image('player', 'assets/sprites/player.png');
        this.load.image('transparent', 'assets/sprites/transparent.png');
        this.load.image('leftControl', 'assets/sprites/controllers/left.png');
        this.load.image('rightControl', 'assets/sprites/controllers/right.png');
        this.load.image('actionControl', 'assets/sprites/controllers/action.png');
        this.load.image('pause_menu', 'assets/sprites/pause_menu.png');
        this.load.spritesheet('ground_tiles', 'assets/tiles/ground-tiles.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('items_tiles', 'assets/sprites/items.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('pixelBall', 'assets/sprites/ball.png', { frameWidth: 9, frameHeight: 10 });
        this.load.spritesheet('sparkles', 'assets/sprites/sparkles.png', { frameWidth: 90, frameHeight: 76 });
        this.load.spritesheet('uiButtons', 'assets/tiles/buttonsUI.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('enemiiixls', 'assets/sprites/enemiiixls.png', { frameWidth: 20, frameHeight: 24 });
    }

    create() {
        this.scene.start('level1');
    }

}
