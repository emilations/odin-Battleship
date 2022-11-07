import { playerFactory } from "./factory";
import { displayGrid, message } from "./view";

let game = (function () {
  let currentPlayer;
  let gameMode;
  let placeShipCounter;
  let human;
  let computer;
  const shipSizes = [5, 4, 3, 3, 2];
  const shipClasses = {
    Carrier: 5,
    Battleship: 4,
    Destroyers: 3,
    Submarine: 3,
    "Patrol Boat": 2,
  };
  let startGame = function () {
    human = playerFactory("Human");
    computer = playerFactory("Computer");
    placeShip();
  };

  let placeShip = function () {
    message("Place your carrier Captain", "add")
    displayGrid.configure("placeShip")
    displayGrid.cacheDOM()
    displayGrid.highlightCell("placeShip")
    // ------------------------------------------------------------------------------------------3
    human.gameboard.placeShip({x:1, y:1, dir: "x"}, 3)
    human.gameboard.attack({x:1, y:1})
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
  let getGrid = function (player) {
    if (player == "human") {
      return JSON.parse(JSON.stringify(human.gameboard.getPrivateGrid()));
    } else if (player == "computer") {
      return JSON.parse(JSON.stringify(human.computer.getPrivateGrid()));
    }
  };
  let endGame = function () {};
  return {
    startGame,
    endGame,
    placeShip,
    getGrid,
  };
})();

export { game };