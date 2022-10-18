// Shared variables
let shipClasses = {
  2: "Patrol Boat",
  3: "Submarine",
  3: "Destroyer",
  4: "Battleship",
  5: "Carrier",
};
// USed to create S1 S2 S3 in the gameboard grid
let shipIdCounter = 0;

// Ship factory ---------------------------------------------------------------
function shipFactory(shipLength, shipId) {
  // Ships can only range from size 2 to 5 as specified in the classes
  if (shipLength > 5 || shipLength <= 1) {
    throw new Error("Length must be between 2 and 5");
  }

  // Initialize ship
  let type = shipClasses[shipLength];
  let fuselage = Array(shipLength).fill(true);
  let allCoor = Array(shipLength);

  let getFuselage = function () {
    return [...fuselage];
  };

  let getCoor = function () {
    return [...allCoor];
  };

  // Save coordinates of ship
  // coor is an object {x, y, dir}
  let setCoor = function (coor) {
    allCoor[0] = {
      x: coor.x,
      y: coor.y,
    };

    // Generate the rest of the coordinates based on initial allCoor[0]
    if (coor.dir == "x") {
      for (let i = 1; i < shipLength; i++) {
        allCoor[i] = {
          x: coor.x + i,
          y: coor.y,
        };
      }
    } else if (coor.dir == "y") {
      for (let i = 1; i < shipLength; i++) {
        allCoor[i] = {
          x: coor.x,
          y: coor.y + i,
        };
      }
    }
  };

  // Use coordinates to locate index and then change fuselage state
  let hit = function (coor) {
    let hitSuccess = false;
    allCoor.forEach((elem, index) => {
      if (JSON.stringify(elem) == JSON.stringify(coor)) {
        fuselage[index] = false;
        hitSuccess = true;
      }
    });
    return hitSuccess;
  };

  // Evaluate if the ship is all filled with hits
  let isSunk = function () {
    if (fuselage.every((elem) => !elem)) {
      return true;
    }
    return false;
  };

  return {
    shipId,
    type,
    shipLength,
    getFuselage,
    setCoor,
    getCoor,
    hit,
    isSunk,
  };
}

// Gameboard factory ----------------------------------------------------------
function gameboardFactory() {
  // '0' was chosen to represent an empty slot
  // grid[x][y]
  // grid legend 0: Empty
  //             SX: Ship ID
  //             H: Ship is hit
  //             M: Missed shot

  let grid = Array(10)
    .fill(0)
    .map(() => Array(10).fill("0"));

  let placeShip = function (coor, shipLength) {
    let shipId = `S${shipIdCounter}`;
    shipIdCounter++;
    let ship = shipFactory(shipLength, shipId, coor);
    grid[coor.x][coor.y] = "shipId";
    if (coor.dir == 'x'){
      for (let i = 0; i < shipLength; i++){
        grid[coor.x + i][coor.y] = shipId;
      }
    } else if (coor.dir == 'y'){
      for (let i = 0; i < shipLength; i++){
        grid[coor.x][coor.y + i] = shipId;
      }
    }
    return 'success'
  };

  let attack = function (coor) {
    // if ((coor.x < 0 && coor.x > 9) || (coor.y < 0 && coor.y > 9)) {
    //   throw new Error("out of bounds array");
    // }
    // if (grid[coor.x][coor.y] == "S") {
    //   grid[coor.x][coor.y] = "H";
    //   return "hit";
    // } else {
    //   grid[coor.x][coor.y] = "M";
    //   return "miss";
    // }
  };

  let isAllHit = function () {
    let allHit = true;
    grid.forEach((elem) => {
      if (elem.includes("S")) {
        console.log("one more S");
        allHit = false;
      }
    });
    return allHit;
  };

  return {
    grid,
    placeShip,
    attack,
    isAllHit,
  };
}

let player = {
  type: "human",
  score: 0,
  takeTurn: function () {},
};

let computer = {
  type: "ai",
  score: 0,
  takeTurn: function () {},
};

let game = function () {
  player.gameboard = gameboardFactory();
  computer.gameboard = gameboardFactory();
};

// Create Gameboard factory.

// Note that we have not yet created any User Interface. We should know our code is coming together by running the tests. You shouldn’t be relying on console.logs or DOM methods to make sure your code is doing what you expect it to.
// Gameboards should be able to place ships at specific coordinates by calling the ship factory function.
// Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
// Gameboards should keep track of missed attacks so they can display them properly.
// Gameboards should be able to report whether or not all of their ships have been sunk.

// ----------------------------------------------------------------------------
module.exports = { shipFactory, gameboardFactory };
