const { playerFactory } = require("./factory");

let game = (function () {
  let currentPlayer;
  let gameStatus;
  let human = playerFactory("Human");
  let computer = playerFactory("Computer");

  let startGame = function () {
    gameStatus = "ongoing";
    currentPlayer = "Human";

    return "Game started";
  };

  let endGame = function () {
    gameStatus = "ended"
  };

  let round = function () {
    if (currentPlayer == "Human") {
      let coor = human.receiveTurn();
    }
    if (currentPlayer == "Computer") {
      let coor = computer.receiveTurn();
    }
    currentPlayer = currentPlayer == "Human" ? "Computer" : "Human";
  };

  return {
    startGame,
    endGame,
  };
})();

module.exports = { game };
