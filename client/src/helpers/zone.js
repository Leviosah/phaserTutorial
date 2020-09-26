export default class Zone {
    constructor(scene) {
        //create a new renderZone method
        this.renderZone = () => {
            let dropZone = scene.add.zone(700, 375, 900, 250).setRectangleDropZone(900, 250); // set the zone borders
            dropZone.setData({cards: 0}) // this assigns data to the drop zone. Use this if you need to set data to a drop zone or object, like for instance hitpoints. In this case, it's 0
            return dropZone;
        };
        this.renderOutline = (dropZone) => {
            let dropZoneOutline = scene.add.graphics();
            dropZoneOutline.lineStyle(4, 0xff69b4);
            //check out phaser docs for the blelow
            dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width/2, dropZone.y - dropZone.input.hitArea.height/2, dropZone.input.hitArea.width, dropZone.input.hitArea.height) 
        }
    }
}