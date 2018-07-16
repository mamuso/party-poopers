const Shuffle = require("shuffle-array");
const Roll = require("roll");

// Warm the dice
roll = new Roll();

// Defining the deck
const goodiesCards = 18;
const supergoodiesCards = 2;
const poopersCards = 10;
const superpoopersCards = 10;

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
let statCurrentCoins = 0;
let statMaxCoins = 0;

let globalStatHands = [];
let globalMaxCoins = [];

// Let's define all the game rules
class Game {
  constructor(players, deck, birdiewirdies) {
    statHands = 0;
    statCurrentCoins = 0;
    statMaxCoins = 0;

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

      // Setting up potential maximum coins
      this.setMaxCoins(cardFromPile);

      // If I have the dice, I only can add or remove to the card with the number
      if (deckPlayer === this.players[this.nextPlayer]) {
        this.rulesApplyToMe(cardFromPile, diceSays, deckPlayer);
      } else {
        this.rulesApplyToOthers(cardFromPile, diceSays, deckPlayer);
      }

      // Adjust the array available cards of the player
      this.hasCoins(deckPlayer);

      // If the card is +-2, then we return it to the pile and shuffle
      this.returnCard(cardFromPile);

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
    this.players.forEach((row, i) => {
      if (row.length === 1) {
        this.players.splice(i, 1);
      }
    });
  }

  setMaxCoins(cardFromPile) {
    if (statCurrentCoins == 0) {
      statCurrentCoins = statMaxCoins = this.players.length * 3 * 3;
    }

    statCurrentCoins = statCurrentCoins + cardFromPile;

    if (statCurrentCoins > statMaxCoins) {
      statMaxCoins = statCurrentCoins;
    }
  }

  playerHasCard(diceSays) {
    return this.players[this.nextPlayer].some(row => row.includes(diceSays));
  }

  returnCard(cardFromPile) {
    if (Math.abs(cardFromPile) > 1) {
      this.deck.push(cardFromPile);
      Shuffle(this.deck);
    }
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
    if (this.players.length > 1) {
      return true;
    } else {
      this.printStats();
      return false;
    }
  }

  // Tell me how we did
  printStats() {
    globalStatHands.push(statHands);
    globalMaxCoins.push(statMaxCoins);

    console.log("THIS GAME:");
    console.log("-----------------------");
    console.log(`- ${statHands} turns`);
    console.log(`- ${statMaxCoins} coins needed to play the game`);
    console.log("-----------------------");
    console.log(" ");
  }
}

j = 0;

while (j < 1000) {
  const game = new Game(3, deck, birdiewirdiesdeck);
  j++;
}
