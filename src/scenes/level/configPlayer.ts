import { LevelProperties } from '@/core/LevelProperties';
import { colorWheel, Piiixls } from '@/core/Piiixls';

export const ConfigPlayer = function(props: LevelProperties) {

    Piiixls.init(props);
    props.player = this.physics.add.sprite(props.levelData.player.initialPosition.x, props.levelData.player.initialPosition.y, 'piiixls');
    props.player.piiixls = Piiixls;
    props.player.playerHitted = false;
    props.player.blockPlayer = false;
    props.player.isInAPlatform = false;
    props.player.piiixls.paint(colorWheel[Math.floor((Math.random() * colorWheel.length))]);

    props.player.on('animationcomplete', (anim, frame) => {
        if (anim.key === 'piiixlsDie') {
            props.player.disableBody(true);
            this.cameras.main.fadeOut(1500);
    }
    }, props.player);
};
