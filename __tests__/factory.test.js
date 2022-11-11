import { playerFactory, gameboardFactory, shipFactory } from "./../src/factory";

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
    shipA.setCoor({ x: 1, y: 1 });
    shipA.setCoor({ x: 2, y: 1 });
    shipA.setCoor({ x: 3, y: 1 });
    shipA.hit({ x: 1, y: 1 });
    expect(shipA.getFuselage()).toEqual([false, true, true]);
  });

  test("Hit the ship at location 4", () => {
    let shipA = shipFactory(5);
    shipA.setCoor({ x: 5, y: 1 });
    shipA.setCoor({ x: 5, y: 2 });
    shipA.setCoor({ x: 5, y: 3 });
    shipA.setCoor({ x: 5, y: 4 });
    shipA.setCoor({ x: 5, y: 5 });
    shipA.hit({ x: 5, y: 5 });
    expect(shipA.getFuselage()).toEqual([true, true, true, true, false]);
  });

  test("Test if ship can be sunken", () => {
    let shipA = shipFactory(3);
    shipA.setCoor({ x: 5, y: 1 });
    shipA.setCoor({ x: 5, y: 2 });
    shipA.setCoor({ x: 5, y: 3 });
    shipA.hit({ x: 5, y: 1 });
    shipA.hit({ x: 5, y: 2 });
    shipA.hit({ x: 5, y: 3 });
    expect(shipA.isSunk()).toBe(true);
  });
});

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Gameboard factory ----------------------------------------------------------
describe("Gameboard Factory", () => {
  test("Create a gameboard", () => {
    let arrayResult = Array(10)
      .fill(0)
      .map(() => Array(10).fill("0"));
    let gameboardA = gameboardFactory();
    expect(gameboardA.getPrivateGrid()).toEqual(arrayResult);
  });

  test("Place ship size 3 at 2:6 in x direction", () => {
    // Create mockup board
    let arrayResult = Array(10)
      .fill(0)
      .map(() => Array(10).fill("0"));
    arrayResult[2][6] = "S1";
    arrayResult[3][6] = "S1";
    arrayResult[4][6] = "S1";
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
    expect(gameboardA.getPrivateGrid()).toEqual(arrayResult);
  });

  test("Place two ships size 3 @ 5:1 y and size 5 at 1:9 in x", () => {
    // Create mockup board
    let arrayResult = Array(10)
      .fill(0)
      .map(() => Array(10).fill("0"));
    // Place ship S1
    arrayResult[5][1] = "S1";
    arrayResult[5][2] = "S1";
    arrayResult[5][3] = "S1";
    // Place ship S2
    arrayResult[1][9] = "S2";
    arrayResult[2][9] = "S2";
    arrayResult[3][9] = "S2";
    arrayResult[4][9] = "S2";
    arrayResult[5][9] = "S2";
    // coordonates X, Y, direction
    let coorA = {
      x: 5,
      y: 1,
      dir: "y",
    };
    let coorB = {
      x: 1,
      y: 9,
      dir: "x",
    };
    // Create a gameboard
    let gameboardA = gameboardFactory();
    gameboardA.placeShip(coorA, 3);
    gameboardA.placeShip(coorB, 5);
    // Launch test
    expect(gameboardA.getPrivateGrid()).toEqual(arrayResult);
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

  test("Prevent to place ship on existing ship", () => {
    // coordonates X, Y, direction
    let coorA = {
      x: 1,
      y: 1,
      dir: "x",
    };
    let coorB = {
      x: 5,
      y: 5,
      dir: "y",
    };
    // Create a gameboard
    let gameboardA = gameboardFactory();
    // Launch test
    gameboardA.placeShip(coorA, 3);
    gameboardA.placeShip(coorB, 3);
    expect(() => gameboardA.placeShip(coorA, 3)).toThrow("Interference");
    expect(() => gameboardA.placeShip(coorB, 3)).toThrow("Interference");
  });

  test("Attack ship", () => {
    // Create mockup board
    let arrayResult = Array(10)
      .fill(0)
      .map(() => Array(10).fill("0"));
    arrayResult[1][1] = "S1";
    arrayResult[1][2] = "H1";
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
    expect(gameboardA.attack(coorHit)).toBe("Hit");
    expect(gameboardA.getPrivateGrid()).toEqual(arrayResult);
    expect(gameboardA.shipList[0].getFuselage()).toEqual([true, false]);
  });

  test("Attack third ship", () => {
    // Create mockup board
    let arrayResult = Array(10)
      .fill(0)
      .map(() => Array(10).fill("0"));
    arrayResult[1][1] = "S1";
    arrayResult[1][2] = "S1";
    arrayResult[3][6] = "S2";
    arrayResult[4][6] = "S2";
    arrayResult[5][6] = "S2";
    arrayResult[6][6] = "S2";
    arrayResult[7][6] = "S2";
    arrayResult[7][3] = "H3";
    arrayResult[7][4] = "S3";
    arrayResult[7][5] = "H3";
    let coorShipA = {
      x: 1,
      y: 1,
      dir: "y",
    };
    let coorShipB = {
      x: 3,
      y: 6,
      dir: "x",
    };
    let coorShipC = {
      x: 7,
      y: 3,
      dir: "y",
    };
    let coorHitA = {
      x: 7,
      y: 3,
    };
    let coorHitB = {
      x: 7,
      y: 5,
    };
    // Create gameboard and place ship
    let gameboardA = gameboardFactory();
    gameboardA.placeShip(coorShipA, 2);
    gameboardA.placeShip(coorShipB, 5);
    gameboardA.placeShip(coorShipC, 3);
    gameboardA.attack(coorHitA);
    gameboardA.attack(coorHitB);
    expect(gameboardA.getPrivateGrid()).toEqual(arrayResult);
    expect(gameboardA.shipList[2].getFuselage()).toEqual([false, true, false]);
  });

  test("Attack on already hit ship", () => {
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
    expect(gameboardA.attack(coorHit)).toBe("Hit");
    expect(gameboardA.attack(coorHit)).toBe("Already hit");
  });

  test("Attack on emppty water", () => {
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
    expect(gameboardA.attack(coorHit)).toBe("Miss");
  });

  test("keep track of missed shots", () => {
    // Create mockup board
    let arrayResult = Array(10)
      .fill(0)
      .map(() => Array(10).fill("0"));
    arrayResult[1][1] = "S1";
    arrayResult[1][2] = "S1";
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
    expect(gameboardA.attack(coorHit)).toBe("Miss");
    expect(gameboardA.getPrivateGrid()).toEqual(arrayResult);
  });

  test("Attack outside grid #1", () => {
    let coorShip = {
      x: 1,
      y: 1,
      dir: "y",
    };
    let coorHit = {
      x: 9,
      y: 10,
    };
    // Create gameboard and place ship
    let gameboardA = gameboardFactory();
    gameboardA.placeShip(coorShip, 2);
    expect(() => gameboardA.attack(coorHit)).toThrow("Outside of grid");
  });

  test("Attack outside grid #2", () => {
    let coorShip = {
      x: 1,
      y: 1,
      dir: "y",
    };
    let coorHit = {
      x: -1,
      y: 5,
    };
    // Create gameboard and place ship
    let gameboardA = gameboardFactory();
    gameboardA.placeShip(coorShip, 2);
    expect(() => gameboardA.attack(coorHit)).toThrow("Outside of grid");
  });

  test("Recieve enemy view of grid", () => {
    // Create mockup board
    let arrayResult = Array(10)
      .fill(0)
      .map(() => Array(10).fill("0"));
    arrayResult[1][1] = "H";
    arrayResult[1][2] = "H";
    arrayResult[4][4] = "M";
    arrayResult[5][5] = "M";
    arrayResult[7][3] = "H";
    // Create gameboard and place ship
    let gameboardA = gameboardFactory();
    gameboardA.placeShip({ x: 1, y: 1, dir: "y" }, 2);
    gameboardA.placeShip({ x: 7, y: 3, dir: "y" }, 3);
    gameboardA.attack({ x: 1, y: 1 });
    gameboardA.attack({ x: 1, y: 2 });
    gameboardA.attack({ x: 4, y: 4 });
    gameboardA.attack({ x: 5, y: 5 });
    gameboardA.attack({ x: 7, y: 3 });
    expect(gameboardA.getPublicGrid()).toEqual(arrayResult);
  });

  test("Report if all ships have been sunk", () => {
    // Create mockup board
    let arrayResult = Array(10)
      .fill(0)
      .map(() => Array(10).fill("0"));
    arrayResult[1][1] = "H1";
    arrayResult[1][2] = "H1";
    arrayResult[7][3] = "H2";
    arrayResult[7][4] = "H2";
    arrayResult[7][5] = "H2";
    let coorShipA = {
      x: 1,
      y: 1,
      dir: "y",
    };
    let coorShipB = {
      x: 7,
      y: 3,
      dir: "y",
    };
    let coorHitA = {
      x: 1,
      y: 1,
    };
    let coorHitB = {
      x: 1,
      y: 2,
    };
    let coorHitC = {
      x: 7,
      y: 3,
    };
    let coorHitD = {
      x: 7,
      y: 4,
    };
    let coorHitE = {
      x: 7,
      y: 5,
    };
    // Create gameboard and place ship
    let gameboardA = gameboardFactory();
    gameboardA.placeShip(coorShipA, 2);
    gameboardA.placeShip(coorShipB, 3);
    gameboardA.attack(coorHitA);
    gameboardA.attack(coorHitB);
    gameboardA.attack(coorHitC);
    gameboardA.attack(coorHitD);
    gameboardA.attack(coorHitE);
    expect(gameboardA.getPrivateGrid()).toEqual(arrayResult);
    expect(gameboardA.isAllHit()).toEqual(true);
  });
});

describe("Player Factory", () => {
  test("Create unsupported player", () => {
    expect(() => playerFactory("Alien")).toThrow("Unsupported type");
  });

  test("Create human player", () => {
    let obj = {
      type: "Human",
      score: 0,
      gameboard: expect.anything(),
      receiveHit: expect.anything(),
    };
    expect(playerFactory("Human")).toMatchObject(obj);
  });

  test("Create computer player", () => {
    let obj = {
      type: "Computer",
      score: 0,
      gameboard: expect.anything(),
      receiveHit: expect.anything(),
    };
    expect(playerFactory("Computer")).toMatchObject(obj);
  });

  test("Human take turn and hit", () => {
    let human = playerFactory("Human");
    human.placeShip({ x: 2, y: 5, dir: "x" }, 3);
    expect(human.receiveHit({ x: 3, y: 5 })).toBe("Hit");
  });
});
