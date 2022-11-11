// Shared variables
let shipClasses = {
  2: "Patrol Boat",
  3: "Submarine",
  3: "Destroyer",
  4: "Battleship",
  5: "Carrier",
};
// Used to create S1 S2 S3 names in the gameboard grid

// Ship factory ---------------------------------------------------------------
function shipFactory(shipLength, shipId) {
  // Ships can only range from size 2 to 5 as specified in the classes
  if (!shipLength || shipLength > 5 || shipLength <= 1) {
    throw new Error("Length must be between 2 and 5");
  }
  // Initialize ship
  let type = shipClasses[shipLength];
  let fuselage = Array(shipLength).fill(true);
  let allCoor = Array();
  let getFuselage = function () {
    return [...fuselage];
  };
  let getCoor = function () {
    return [...allCoor];
  };
  // Save coordinates of ship
  // coor is an object {x, y}
  let setCoor = function (coor) {
    allCoor.push({ x: coor.x, y: coor.y });
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
  let shipIdCounter = 1;
  let shipList = [];
  // '0' was chosen to represent an empty slot
  // grid[x][y]
  // grid legend 0: Empty
  //             SX: Ship ID
  //             H: Ship is hit
  //             M: Missed shot
  let grid = Array(10)
    .fill("0")
    .map(() => Array(10).fill("0"));
  let getPrivateGrid = function () {
    return JSON.parse(JSON.stringify(grid));
  };
  // Create the grid from an enemy point of view
  let getPublicGrid = function () {
    let publicGrid = grid.map((element) => {
      return element.map((elem) => {
        return elem[0] == "H" || elem[0] == "M" ? elem[0] : "0";
      });
    });
    return JSON.parse(JSON.stringify(publicGrid));
  };
  let placeShip = function (coor, shipLength) {
    if (coor.dir == "x" && coor.x + shipLength > 10) {
      throw new Error("Outside of grid");
    } else if (coor.dir == "y" && coor.y + shipLength > 10) {
      throw new Error("Outside of grid");
    }
    // -----------------------------------------------------------------------------------------2
    // Check if no overlap with other ship
    if (coor.dir == "x") {
      for (let i = 0; i < shipLength; i++) {
        if (grid[coor.x + i][coor.y][0] == "S") {
          throw new Error("Interference")
        }
      }
    } else if (coor.dir == "y") {
      for (let i = 0; i < shipLength; i++) {
        if (grid[coor.x][coor.y + i][0] == "S") {
          throw new Error("Interference")
        }
      }
    } 
    let shipId = `S${shipIdCounter}`;
    shipIdCounter++;
    let ship = shipFactory(shipLength, shipId);
    shipList.push(ship);
    if (coor.dir == "x") {
      for (let i = 0; i < shipLength; i++) {
        grid[coor.x + i][coor.y] = shipId;
        ship.setCoor({ x: coor.x + i, y: coor.y });
      }
    } else if (coor.dir == "y") {
      for (let i = 0; i < shipLength; i++) {
        grid[coor.x][coor.y + i] = shipId;
        ship.setCoor({ x: coor.x, y: coor.y + i });
      }
    }
    return ship;
    // add ship to gameboard array
  };
  let attack = function (coor) {
    if (coor.x < 0 || coor.x > 9 || coor.y < 0 || coor.y > 9) {
      throw new Error("Outside of grid");
    }
    if (grid[coor.x][coor.y][0] == "S") {
      grid[coor.x][coor.y] = grid[coor.x][coor.y].replace("S", "H");
      shipList.find((item, index, array) => {
        return item.hit(coor);
      });
      return "Hit";
    } else if (grid[coor.x][coor.y][0] == "H") {
      return "Already hit";
    } else {
      grid[coor.x][coor.y] = "M";
      return "Miss";
    }
  };
  let isAllHit = function () {
    return shipList.every((elem) => elem.isSunk());
  };
  return {
    shipList,
    getPrivateGrid,
    getPublicGrid,
    placeShip,
    attack,
    isAllHit,
  };
}

// Player factory -------------------------------------------------------------
let playerFactory = function (type) {
  if (type == "Human") {
    let gameboard = gameboardFactory();
    return {
      type: "Human",
      score: 0,
      gameboard,
      placeShip: function (coor, shipLength) {
        return this.gameboard.placeShip(coor, shipLength);
      },
      receiveHit: function (coor) {
        return this.gameboard.attack(coor);
      },
    };
  } else if (type == "Computer") {
    let gameboard = gameboardFactory();
    return {
      type: "Computer",
      score: 0,
      gameboard,
      placeShip: function () {
        // randomly places ships into the gameboard grip
        console.log("Computer placing ship")
        let shipLength = [5,4,3,3,2];
        let i = 0;
        do {
          let x = Math.floor(Math.random()*9);
          let y = Math.floor(Math.random()*9);
          let dir = Math.floor(Math.random()*2) == 0 ? "x" : "y";
          console.log(`Coor: ${x}:${y} and dir: ${dir} and ship size: ${shipLength[i]}`)
          try {
            gameboard.placeShip({x,y,dir},shipLength[i])
          } catch (error) {
            i--;
            console.log(error.message)
          }
          i++;
        } while (i < 5);
      },
      receiveHit: function (coor) {
        return this.gameboard.attack(coor);
      },
    };
  } else {
    throw new Error("Unsupported type");
  }
};

export { playerFactory, gameboardFactory, shipFactory };