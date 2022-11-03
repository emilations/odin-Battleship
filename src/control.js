const { playerFactory } = require("./factory");
const { placeShip } = require("./view");

let game = (function () {
  let currentPlayer;
  let gameStatus;
  let human = playerFactory("Human");
  let computer = playerFactory("Computer");

  let startGame = function () {
    gameStatus = "on";
    currentPlayer = "Human";
    placeShip(3);
    return gameStatus;
  };

  let endGame = function () {
    gameStatus = "end"
    return gameStatus;
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