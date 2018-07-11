const Shuffle = require("shuffle-array");
const Roll = require("roll");

// Warm the dice
roll = new Roll();

// Defining the deck
const goodiesCards = 18;
const supergoodiesCards = 2;
const poopersCards = 15;
const superpoopersCards = 5;

const goodies = Array(goodiesCards).fill(1);
const supergoodies = Array(supergoodiesCards).fill(2);
const poopers = Array(poopersCards).fill(-1);
const superpoopers = Array(superpoopersCards).fill(-2);

const deck = [...goodies, ...supergoodies, ...poopers, ...superpoopers];

// We have a set of 12 Birdie Wirdies, with numbers on top (1 to 6).
// Each player will get 3 during the game set up (max 4 players)
const birdiewirdiesdeck = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];

// Stats
let statHands = 0;
let statMaxCoins = 0;

// Let's define all the game rules
class Game {
  constructor(players, deck, birdiewirdies) {
    // Get all the game ingredients
    this.players = Array(players);
    this.deck = Shuffle(deck);
    this.birdiewirdies = Shuffle(birdiewirdies);
    this.nextPlayer = 0;

    // Set up the game: 3 birds per player, 3 energy coins per bird
    for (let i = 0; i < players; i++) {
      let j = 0;
      this.players[i] = Array();
      while (j < 3) {
        this.players[i][j] = [this.birdiewirdies.pop(), 3];
        j++;
      }
    }

    this.play();
  }

  play() {
    console.log(this.players);
    while (this.keepPlaying()) {
      // Roll the dice
      const diceSays = roll.roll("d6").result;

      // Check if the player has a card with the dice result

      // Setting the turn of the next player
      this.setTurn();
      statHands++;
      this.players = 0;
    }
  }

  hasCard(diceSays) {}

  // Who plays next
  setTurn() {
    this.nextPlayer++;
    if (this.nextPlayer >= this.players.length) {
      this.nextPlayer = 0;
    }
    return this.nextPlayer;
  }

  // Should we keep playing
  keepPlaying() {
    if (this.players.length > 1) {
      return true;
    } else {
      return false;
    }
  }

  // Tell me how we did
  printStats() {}
}

const game1 = new Game(2, deck, birdiewirdiesdeck);
