// General data ---------------------------------------------------------------
let shipClasses = {
  'Carrier': 5,
  'Battleship': 4,
  'Destroyers': 3,
  'Submarine': 3,
  'Patrol Boat': 2,
}

// Ship factory ---------------------------------------------------------------
function shipFactory(length, name) {
  let _sank = false;
  // Hardcoded ship class names
  let _name = name;
  
  // Ships can only range from size 2 to 5 as specified in the classes
  if (length > 5 || length <= 1) {
    throw new Error("Length must be between 2 and 5")
  }

  // 0 is no hits while a 1 represets a hit
  let fuselage = [];
  fuselage.length = length;
  fuselage.fill('S');

  // Return the grid of the ship
  let getFuselage = function () {
    return [...fuselage];
  };

  // Location is uses array index
  let hit = function (location) {
    if (location > length - 1) {
      throw new Error("hit not successful");
    }
    fuselage[location] = 'H';
    return "hit successful";
  };

  // Evaluate if the ship is all filled with hits
  let isSunk = function () {
    if (fuselage.every((elem) => elem == 'H')) {
      _sank = true;
    }
    return _sank;
  };

  return {
    length,
    getFuselage,
    isSunk,
    hit,
  };
}

// Gameboard factory ----------------------------------------------------------
function gameboardFactory() {
  // '0' was chosen to represent an empty slot
  let grid = Array(10)
  .fill(0)
  .map(() => Array(10).fill('0'));;

  let placeShip = function(coor, shipSize){
    return 
  }

  return {
    grid,
    placeShip,
  };
}

// Create Gameboard factory.

// Note that we have not yet created any User Interface. We should know our code is coming together by running the tests. You shouldn’t be relying on console.logs or DOM methods to make sure your code is doing what you expect it to.
// Gameboards should be able to place ships at specific coordinates by calling the ship factory function.
// Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
// Gameboards should keep track of missed attacks so they can display them properly.
// Gameboards should be able to report whether or not all of their ships have been sunk.

// ----------------------------------------------------------------------------
module.exports = { shipFactory, gameboardFactory };