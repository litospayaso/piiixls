import { LevelProperties } from '@/core/LevelProperties';
import { colorWheel } from '@/core/Piiixls';

export const ConfigItems = function(props: LevelProperties) {
    for (let index = 12; index < 2400; index += 70) {
        const pixel = props.items.create(index, 0, 'items_tiles').setFrame(3);
        pixel.itemType = 'pixel';
        pixel.color = colorWheel[Math.floor((Math.random() * colorWheel.length))];
        pixel.setTint(parseInt(pixel.color.slice(0, 6), 16));
    }
    const bucket = props.items.create(300, 600, 'items_tiles').setFrame(4).setScale(1.5);
    bucket.itemType = 'bucket';
    bucket.color = colorWheel[Math.floor((Math.random() * colorWheel.length))];
    bucket.setTint(parseInt(bucket.color.slice(0, 6), 16));
    const star = props.items.create(550, 900, 'items_tiles').setFrame(0).setScale(1.5);
    star.itemType = 'star';
    // hay que volver a configurar las collision
    const book = props.items.create(450, 900, 'items_tiles').setFrame(1).setScale(1.5);
    book.itemType = 'book';
    const palette = props.items.create(650, 900, 'items_tiles').setFrame(2).setScale(1.5);
    palette.itemType = 'palette';
};
