const {shipFactory} = require('./logic');

// ----------------------------------------------------
test('Create a ship', () => {
  let obj = {
    length: 2,
    getFuselage: expect.anything(),
    isSunk: expect.anything(),
    hit: expect.anything(),
  };
  expect(shipFactory(2)).toMatchObject(obj);
});

test('Test if ship can be hit', () => {
  expect(shipFactory(4).hit(2)).toBe("hit successful")
});

test('Test if hit fails', () => {
  expect(shipFactory(4).hit(5)).toBe("hit not successful")
});

test('Test if ship can be sank', () => {
  let shipA = shipFactory(2);
  shipA.hit(0);
  shipA.hit(1);
  expect(shipA.isSunk()).toBe(true);
});

test('Is ship sonken', () => {})


// Begin your app by creating the Ship factory function.

    // Your ‘ships’ will be objects that include their length, where they’ve been hit and whether or not they’ve been sunk.
    // REMEMBER you only have to test your object’s public interface. Only methods or properties that are used outside of your ‘ship’ object need unit tests.
    // Ships should have a hit() function that takes a number and then marks that position as ‘hit’.
    // isSunk() should be a function that calculates it based on their length and whether all of their positions are ‘hit’.