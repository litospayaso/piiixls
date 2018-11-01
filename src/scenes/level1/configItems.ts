import { LevelProperties } from '../../core/LevelProperties';
import { colorWheel } from '../../core/PaintPiiixls';

export const ConfigItems = function(props: LevelProperties) {
    for (let index = 12; index < 2400; index += 70) {
        const item = props.items.create(index, 0, 'star');
        item.color = colorWheel[Math.floor((Math.random() * 12))];
        item.setTint(parseInt(item.color.slice(0, 6), 16));
    }
    const bucket = props.items.create(300, 600, 'bucket');
    bucket.color = colorWheel[Math.floor((Math.random() * 12))];
    bucket.setTint(parseInt(bucket.color.slice(0, 6), 16));
};
