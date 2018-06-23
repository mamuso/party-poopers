const Shuffle = require('shuffle-array');
const Roll = require('roll');

// Deck of party goodies and party poopers 
const goodies = Array(18);
goodies.fill(1);

const supergoodies = Array(2);
supergoodies.fill(2);

const poopers = Array(15);
poopers.fill(-1);

const superpoopers = Array(5);
superpoopers.fill(-2);

const deck = [...goodies, ...supergoodies, ...poopers, ...superpoopers];
console.log(Shuffle(deck));