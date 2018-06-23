const Shuffle = require('shuffle-array');
const Roll = require('roll');

// Deck of party goodies and party poopers 
const goodies = Array(18).fill(1);
const supergoodies = Array(2).fill(2);

const poopers = Array(15).fill(-1);
const superpoopers = Array(5).fill(-2);

const deck = [...goodies, ...supergoodies, ...poopers, ...superpoopers];

// We have a set of 12 Birdie Wirdies, with numbers on top (1 to 6). 
// Each player will get 3 during the game set up (max 4 players)
const birdiewirdiesdeck = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];


// Let's define all the game rules
class Game {
  constructor(players, deck, birdiewirdies) {
    // Get all the game ingredients
    this.payers = players;
    this.deck = Shuffle(deck);
    this.birdiewirdies = Shuffle(birdiewirdies);
  }
}

const game1 = new Game(2, deck, birdiewirdiesdeck);