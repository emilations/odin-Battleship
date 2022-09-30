const {shipFactory} = require('./logic');

// ----------------------------------------------------
// Testing the add() function



test('Create a ship', () => {
  let factory = shipFactory(2);
  let hit = jest.fn(()=>{})

  let obj = {
    length: 2,
    isSunk: "false",
    fuselage: [],
  };
  let spy = jest.spyOn((shipFactory(2)), "hit");
  expect(factory).toMatchObject(obj);
});