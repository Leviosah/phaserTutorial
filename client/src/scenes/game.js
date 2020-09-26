import Card from '../helpers/card';
import Zone from '../helpers/zone';
import io from 'socket.io-client';
import Dealer from '../helpers/dealer'


export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {
        this.load.image('cyanCardFront', 'src/assets/CyanCardFront.png');
        this.load.image('cyanCardBack', 'src/assets/CyanCardBack.png');
        this.load.image('magentaCardFront', 'src/assets/MagentaCardFront.png');
        this.load.image('magentaCardBack', 'src/assets/MagentaCardBack.png');
    }


    create() {
        let self = this; 

        this.isPlayerA = false;
        this.opponentCards = [];

        this.zone = new Zone(this); //this creates the new zone class
        this.dropZone = this.zone.renderZone(); // this creates the actual dropzone
        this.outline = this.zone.renderOutline(this.dropZone) // this creates the outline of the dropzone

        this.dealer = new Dealer(this);

        this.socket = io('http://localhost:3080');
        this.socket.on('connect', function() {
            console.log('Connected');
        });

        this.socket.on('isPlayerA', function() {
            self.isPlayerA = true; //this means when I client logs in, their id will be sent to player array and the program will check if it's the first player. If so, will emit 'isplayera'. This assigns playera to first player.
        })

        this.socket.on('dealCards', function() {
            self.dealer.dealCards();
            self.dealText.disableInteractive();
        })

        this.socket.on('cardPlayed', function (gameObject, isPlayerA) {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = gameObject.textureKey;
                self.opponentCards.shift().destroy(); //this eliminates a card when played.text
                self.dropZone.data.values.cards++
                let card = new Card(self);
                card.render(((self.dropZone.x - 350) + (self.dropZone.data.values.cards * 50)), (self.dropZone.y), sprite).disableInteractive();
            }
        })

        /// this deals cards. The cards (playerCard) is referenced from the "Card" class in card.js. The loop then iterates to create 5 hards in a hand. 
       // this.dealCards = () => {
          //  for (let i = 0; i < 5; i++) {
            //    let playerCard = new Card(this);
            //    playerCard.render(475 + (i*100), 650, 'cyanCardFront')
          //  }
      //  }

        this.dealText = this.add.text(75, 350, ['DEAL CARDS']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();

        this.dealText.on('pointerdown', function() {
           // self.dealCards();
           self.socket.emit('dealCards');
        });  

        this.dealText.on('pointerover', function() {
            self.dealText.setColor('#ff69b4')
        });

        this.dealText.on('pointerout', function() {
            self.dealText.setColor('#00ffff')
        })

        this.input.on('dragstart', function(pointer, gameObject) {
            gameObject.setTint(0xff69b4);
            self.children.bringToTop(gameObject) //this input on function tints the cards pink when dragged. self is the variable set for "this", and children are all the child elements
            //bring to top brings the cards to the front (so that they arent rendered behind the box or other text)
        })

        this.input.on('dragend', function(pointer, gameObject, dropped) {
            gameObject.setTint(); // this eliminates the tint when the card is deselected (dropped)
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            } // this means that if not dropped in derop zone, than return the card to where it was picked up last
        })

        this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            dropZone.data.values.cards++; //this means that when you drop a card in the drop zone, increment the value assigned to the drop zone by 1. Reference this to the setData attribute in zone.js
            gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
            gameObject.y = dropZone.y;
            gameObject.disableInteractive(); // at the end, if the card is not dropped send it back to its origin, but if it is dropped, increment the card value and then set x, y to -350
            // this makes the cards lay out in the zone neatly
            self.socket.emit('cardPlayed', gameObject, self.isPlayerA) // when client A drops a card, the socket/client should emit 'cardPlayed' as well as the game object and the isplayerA boolean to the server
        })
    }

    update() {

    }
}

// to get socket.io going with express, go to root, initialize npm and then type "npm install --save express socket.io nodemon"
// in package.json, change test, under scripts, to "start" and then type in nodemon server.js

// make sure to install "socket.io-client" for the client files
