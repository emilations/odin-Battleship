const { shipFactory, gameboardFactory, playerFactory } = require("../src/factory");
const { game } = require("../src/control");


// ----------------------------------------------------------------------------
// Ship factory ---------------------------------------------------------------
describe("Game module", () => {
  test("Start game", () => {
    expect(game.startGame()).toBe("Game started");
  })

  test("Start game", () => {
    expect(game.startGame()).toBe("Game started");
  })
});