import Phaser from "phaser";
import Game from "./scenes/game"

// think about scenes as individual screens. We can import multiple of these scenes into. To create multiple scenes, create multiple JS scripts that live in the scenes folder
// and then import them into this index.js, which acts as our game launcher



const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1280,
  height: 780,
  scene: [
    Game
  ]
};

const game = new Phaser.Game(config);


