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

    // Set up the game: 3 birds per player, 3 energy coins per bird (🎉)
    for (let i = 0; i < players; i++) {
      let j = 0;
      this.players[i] = Array();
      while (j < 3) {
        this.players[i][j] = [this.birdiewirdies.pop(), "🎉", "🎉", "🎉"];
        j++;
      }
    }

    this.play();
  }

  play() {
    while (this.keepPlaying()) {
      // Roll the dice
      const diceSays = roll.roll("d6").result;

      // Check if the player has a card with the dice result, if not, choose a different player
      const deckPlayer = this.playerHasCard(diceSays)
        ? this.players[this.nextPlayer]
        : this.players[this.pickSomeoneButMe()];

      // player draws a card from the goodies/poopers pile and adds or subtract the value to energy coins
      const cardFromPile = this.deck.pop();

      // If I have the dice, I only can add or remove to the card with the number
      if (deckPlayer === this.players[this.nextPlayer]) {
        this.rulesApplyToMe(cardFromPile, diceSays, deckPlayer);
      } else {
        this.rulesApplyToOthers(cardFromPile, diceSays, deckPlayer);
      }

      // Adjust the array available cards of the player
      this.hasCoins(deckPlayer);
      // Setting the turn of the next player
      this.setTurn();
      statHands++;
      // this.players = 0;
    }
  }

  rulesApplyToMe(cardFromPile, diceSays, deckPlayer) {
    // We add or remove as many coins as the card says
    for (var i = 0; i < Math.abs(cardFromPile); i++) {
      deckPlayer.forEach(row => {
        if (row.includes(diceSays)) {
          // cards can be more than +-1
          if (cardFromPile < 0) {
            row.splice(row.indexOf("🎉"), 1);
          } else {
            row.push("🎉");
          }
          return;
        }
      });
    }
  }

  rulesApplyToOthers(cardFromPile, diceSays, deckPlayer) {
    // We add or remove as many coins as the card says, but we pick random rows
    // In the game you might want to take a different strategy, but for simulation purposes seems fine
    for (var i = 0; i < Math.abs(cardFromPile); i++) {
      let row = deckPlayer[Math.floor(Math.random() * deckPlayer.length)];
      if (cardFromPile < 0) {
        row.splice(row.indexOf("🎉"), 1);
      } else {
        row.push("🎉");
      }
    }
  }

  hasCoins(deckPlayer) {
    deckPlayer.forEach((row, i) => {
      if (row.length === 1) {
        deckPlayer.splice(i, 1);
      }
    });
  }

  playerHasCard(diceSays) {
    return this.players[this.nextPlayer].some(row => row.includes(diceSays));
  }

  pickSomeoneButMe() {
    // Array with all players
    const whoIsPlaying = Array.from(Array(this.players.length).keys());
    const me = whoIsPlaying.indexOf(this.nextPlayer);
    whoIsPlaying.splice(me, 1);

    return whoIsPlaying[Math.floor(Math.random() * whoIsPlaying.length)];
  }

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
    this.players.forEach((row, i) => {
      if (row.length === 1) {
        this.players.splice(i, 1);
      }
    });
    if (this.players.length > 1) {
      return true;
    } else {
      this.printStats();
      return false;
    }
  }

  // Tell me how we did
  printStats() {
    console.log("yay");
    console.log(statHands);
  }
}

const game1 = new Game(2, deck, birdiewirdiesdeck);
