const { shipFactory, gameboardFactory } = require("../src/logic");

// Ship factory ---------------------------------------------------------------
describe("Ship factory", () => {
  test("Create a ship", () => {
    let obj = {
      length: 2,
      getFuselage: expect.anything(),
      isSunk: expect.anything(),
      hit: expect.anything(),
    };
    expect(shipFactory(2)).toMatchObject(obj);
  });

  test("Create ship with correct length of 3?", () => {
    let shipA = shipFactory(3);
    expect(shipA.getFuselage()).toEqual(['S', 'S', 'S']);
  });

  test("Create ship with correct length of 5?", () => {
    let shipA = shipFactory(5);
    expect(shipA.getFuselage()).toEqual(['S', 'S', 'S', 'S', 'S']);
  });

  test("Ships longer than 5 are not allowed", () => {
    expect(() => shipFactory(6)).toThrow(
      "Length must be between 2 and 5"
    );
  });

  test("Ships smaller than 2 are not allowed", () => {
    expect(() => shipFactory(1)).toThrow(
      "Length must be between 2 and 5"
    );
  });

  test("Hit the ship at location 1", () => {
    let shipA = shipFactory(3);
    shipA.hit(1);
    expect(shipA.getFuselage()).toEqual(['S', 'H', 'S']);
  });

  test("Hit the ship at location 4", () => {
    let shipA = shipFactory(5);
    shipA.hit(4);
    expect(shipA.getFuselage()).toEqual(['S', 'S', 'S', 'S', 'H']);
  });

  test("Is a ship hit successful", () => {
    let shipA = shipFactory(3);
    shipA.hit(1);
    expect(shipA.getFuselage()).toEqual(['S', 'H', 'S']);
  });

  test("Does hit fails if out of bounds?", () => {
    let shipA = shipFactory(3);
    expect(() => shipA.hit(5)).toThrow("hit not successful");
  });

  test("Test if ship can be sunken", () => {
    let shipA = shipFactory(2);
    shipA.hit(0);
    shipA.hit(1);
    expect(shipA.isSunk()).toBe(true);
  });

  test("Test if ship not sunken", () => {
    let shipA = shipFactory(2);
    shipA.hit(0);
    expect(shipA.isSunk()).toBe(false);
  });
});

// Gameboard factory ----------------------------------------------------------
describe("Gameboard Factory", () => {
  test("Create a gameboard", () => {
    let arrayResult = Array(10)
      .fill(0)
      .map(() => Array(10).fill('0'));
      console.log(arrayResult)
    let gameboardA = gameboardFactory();
    expect(gameboardA.grid).toEqual(arrayResult);
  });

  test("Create ship in specific location", () => {
    // Create mockup board
    let arrayResult = Array(10)
    .fill(0)
    .map(() => Array(10).fill('0'));
    arrayResult[2][6] = 'S';
    arrayResult[3][6] = 'S';
    arrayResult[4][6] = 'S';

    // Create ship
    let coor = { x: 2, y: 6 , dir: "x"};
    let shipA = shipFactory(3);
    console.log(shipA)
    
    // Create a gameboard
    let gameboardA = gameboardFactory()

    // Launch test
    gameboardFactory.placeShip(coor, shipA);
    let grid = gameboardFactory.getGrid;
    expect(grid).toBe(arrayResult);
  });

  test("Receive attack, call hit function on correct ship, or record the missed shot", () => {
    expect().toBe("");
  });

  test("keep tack of missed shots", () => {
    expect().toBe("");
  });

  test("Report if all ships have been sunk", () => {
    expect().toBe("");
  });
});

// Create Gameboard factory.
// Note that we have not yet created any User Interface. We should know our code is coming together by running the tests. You shouldn’t be relying on console.logs or DOM methods to make sure your code is doing what you expect it to.
// Gameboards should be able to place ships at specific coordinates by calling the ship factory function.
// Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
// Gameboards should keep track of missed attacks so they can display them properly.
// Gameboards should be able to report whether or not all of their ships have been sunk.
