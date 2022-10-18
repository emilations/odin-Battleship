const { shipFactory, gameboardFactory } = require("../src/logic");

// ----------------------------------------------------------------------------
// Ship factory ---------------------------------------------------------------
describe("Ship factory", () => {
  test("Create a Patrol boat", () => {
    let obj = {
      shipId: "S2",
      type: "Patrol Boat",
      shipLength: 2,
      getFuselage: expect.anything(),
      setCoor: expect.anything(),
      hit: expect.anything(),
      isSunk: expect.anything(),
    };
    expect(shipFactory(2, "S2")).toMatchObject(obj);
  });

  test("Create a carrier", () => {
    let obj = {
      shipId: "S5",
      type: "Carrier",
      shipLength: 5,
      getFuselage: expect.anything(),
      setCoor: expect.anything(),
      hit: expect.anything(),
      isSunk: expect.anything(),
    };
    expect(shipFactory(5, "S5")).toMatchObject(obj);
  });

  test("Ships longer than 5 are not allowed", () => {
    expect(() => shipFactory(6)).toThrow("Length must be between 2 and 5");
  });

  test("Ships smaller than 2 are not allowed", () => {
    expect(() => shipFactory(1)).toThrow("Length must be between 2 and 5");
  });

  test("Hit the ship at location 0", () => {
    let shipA = shipFactory(3);
    shipA.setCoor({ x: 1, y: 1, dir: "x" });
    shipA.hit({ x: 1, y: 1 });
    expect(shipA.getFuselage()).toEqual([false, true, true]);
  });

  test("Hit the ship at location 4", () => {
    let shipA = shipFactory(5);
    shipA.setCoor({ x: 5, y: 1, dir: "y" });
    shipA.hit({ x: 5, y: 5 });
    expect(shipA.getFuselage()).toEqual([true, true, true, true, false]);
  });


  test("Test if ship can be sunken", () => {
    let shipA = shipFactory(3);
    shipA.setCoor({ x: 5, y: 1, dir: "y" });
    shipA.hit({ x: 5, y: 1 });
    shipA.hit({ x: 5, y: 2 });
    shipA.hit({ x: 5, y: 3 });
    expect(shipA.isSunk()).toBe(true);
  });
});

// ----------------------------------------------------------------------------
// Gameboard factory ----------------------------------------------------------
describe("Gameboard Factory", () => {
  test("Create a gameboard", () => {
    let arrayResult = Array(10)
      .fill(0)
      .map(() => Array(10).fill("0"));
    let gameboardA = gameboardFactory();
    expect(gameboardA.grid).toEqual(arrayResult);
  });

  test("Place ship size 3 at 2:6 in x direction", () => {
    // Create mockup board
    let arrayResult = Array(10)
      .fill(0)
      .map(() => Array(10).fill("0"));
    arrayResult[2][6] = "S";
    arrayResult[3][6] = "S";
    arrayResult[4][6] = "S";

    // coordonates X, Y, direction
    let coorA = {
      x: 2,
      y: 6,
      dir: "x",
    };

    // Create a gameboard
    let gameboardA = gameboardFactory();

    // Launch test
    gameboardA.placeShip(coorA, 3);
    expect(gameboardA.grid).toEqual(arrayResult);
  });

  test("Place ship size 5 at 5:1 in y direction", () => {
    // Create mockup board
    let arrayResult = Array(10)
      .fill(0)
      .map(() => Array(10).fill("0"));
    arrayResult[5][1] = "S";
    arrayResult[5][2] = "S";
    arrayResult[5][3] = "S";
    arrayResult[5][4] = "S";
    arrayResult[5][5] = "S";

    // coordonates X, Y, direction
    let coorA = {
      x: 5,
      y: 1,
      dir: "y",
    };

    // Create ship

    // Create a gameboard
    let gameboardA = gameboardFactory();

    // Launch test
    gameboardA.placeShip(coorA, 5);
    expect(gameboardA.grid).toEqual(arrayResult);
  });

  test("Place ship size 2 at 1:8 in y direction", () => {
    // Create mockup board
    let arrayResult = Array(10)
      .fill(0)
      .map(() => Array(10).fill("0"));
    arrayResult[1][8] = "S";
    arrayResult[1][9] = "S";

    // coordonates X, Y, direction
    let coorA = {
      x: 1,
      y: 8,
      dir: "y",
    };

    // Create a gameboard
    let gameboardA = gameboardFactory();

    // Launch test
    gameboardA.placeShip(coorA, 2);
    expect(gameboardA.grid).toEqual(arrayResult);
  });

  test("Place ship size 3 at 1:8 in y direction and return error", () => {
    // coordonates X, Y, direction
    let coorA = {
      x: 1,
      y: 8,
      dir: "y",
    };

    // Create a gameboard
    let gameboardA = gameboardFactory();

    // Launch test
    expect(() => gameboardA.placeShip(coorA, 3)).toThrow("Outside of grid");
  });

  test("Place ship size 5 at 8:2 in x direction and return error", () => {
    // coordonates X, Y, direction
    let coorA = {
      x: 8,
      y: 2,
      dir: "x",
    };

    // Create a gameboard
    let gameboardA = gameboardFactory();

    // Launch test
    expect(() => gameboardA.placeShip(coorA, 5)).toThrow("Outside of grid");
  });

  test("Place ship size 3 at 8:8 in y direction and return error", () => {
    // coordonates X, Y, direction
    let coorA = {
      x: 8,
      y: 8,
      dir: "y",
    };

    // Create a gameboard
    let gameboardA = gameboardFactory();

    // Launch test
    expect(() => gameboardA.placeShip(coorA, 3)).toThrow("Outside of grid");
  });

  test("Place ship size 3 at 8:8 in y direction and return error and dont mutate grid", () => {
    // Create mockup board
    let arrayResult = Array(10)
      .fill(0)
      .map(() => Array(10).fill("0"));

    // coordonates X, Y, direction
    let coorA = {
      x: 8,
      y: 8,
      dir: "y",
    };

    // Create a gameboard
    let gameboardA = gameboardFactory();

    // Launch test
    expect(() => gameboardA.placeShip(coorA, 3)).toThrow("Outside of grid");
    expect(gameboardA.grid).toEqual(arrayResult);
  });

  test("Receive attack, call hit function on correct ship", () => {
    // Create mockup board
    let arrayResult = Array(10)
      .fill(0)
      .map(() => Array(10).fill("0"));
    arrayResult[1][1] = "S";
    arrayResult[1][2] = "H";

    let coorShip = {
      x: 1,
      y: 1,
      dir: "y",
    };

    let coorHit = {
      x: 1,
      y: 2,
    };

    // Create gameboard and place ship
    let gameboardA = gameboardFactory();
    gameboardA.placeShip(coorShip, 2);

    expect(gameboardA.attack(coorHit)).toBe("hit");
    expect(gameboardA.grid).toEqual(arrayResult);
  });

  test("keep track of missed shots", () => {
    // Create mockup board
    let arrayResult = Array(10)
      .fill(0)
      .map(() => Array(10).fill("0"));
    arrayResult[1][1] = "S";
    arrayResult[1][2] = "S";
    arrayResult[2][2] = "M";

    let coorShip = {
      x: 1,
      y: 1,
      dir: "y",
    };

    let coorHit = {
      x: 2,
      y: 2,
    };

    // Create gameboard and place ship
    let gameboardA = gameboardFactory();
    gameboardA.placeShip(coorShip, 2);

    expect(gameboardA.attack(coorHit)).toBe("miss");
    expect(gameboardA.grid).toEqual(arrayResult);
  });

  test("Report if all ships have been sunk", () => {
    // Create mockup board
    let arrayResult = Array(10)
      .fill(0)
      .map(() => Array(10).fill("0"));
    arrayResult[1][1] = "S";
    arrayResult[1][2] = "S";

    let coorShip = {
      x: 1,
      y: 1,
      dir: "y",
    };

    let coorHit1 = {
      x: 1,
      y: 1,
    };

    let coorHit2 = {
      x: 1,
      y: 2,
    };

    // Create gameboard and place ship
    let gameboardA = gameboardFactory();
    gameboardA.placeShip(coorShip, 2);
    gameboardA.attack(coorHit1);
    gameboardA.attack(coorHit2);

    expect(gameboardA.isAllHit()).toEqual(true);
  });
});

// Create Gameboard factory.
// Note that we have not yet created any User Interface. We should know our code is coming together by running the tests. You shouldn’t be relying on console.logs or DOM methods to make sure your code is doing what you expect it to.
// Gameboards should be able to place ships at specific coordinates by calling the ship factory function.
// Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
// Gameboards should keep track of missed attacks so they can display them properly.
// Gameboards should be able to report whether or not all of their ships have been sunk.
