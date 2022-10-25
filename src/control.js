const { playerFactory } = require("./factory");

let game = (function () {
  let currentPlayer;
  let human = playerFactory("Human");
  let computer = playerFactory("Computer");

  let start = function () {
    currentPlayer = "Human";
    return "Game started";
  };

  let round = function () {
    if (currentPlayer == "Human") {
      let coor = human.receiveTurn();
    }
  };

  return {
    start,
    round,
  };
})();

module.exports = { game };
