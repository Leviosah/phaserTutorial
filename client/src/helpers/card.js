// this is the Card class that defines the render function for a card. this.render takes in three parameters. an x coordiate, a y coordate, and a sprite.text
//  a constructor function is then set to assign characteristics, and passes in the scene variable. the card is a let variable. it takes the scene (level) and adds and image, while assigning the x, y and sprite. Its also set to 
// be interactive and draggable. Return card is then stated so we can use the output, or "card"

export default class Card {
    constructor(scene) {
        this.render = (x, y, sprite) => {
            let card = scene.add.image(x, y, sprite).setScale(0.3, 0.3).setInteractive();
            scene.input.setDraggable(card);
            return card;
        }
    }
}