import { playerFactory } from "./factory";
import { displayGrid, message } from "./view";

let game = (function () {
  let currentPlayer;
  let gameMode;
  let placeShipCounter;
  const shipSizes = [5, 4, 3, 3, 2];
  const shipClasses = {
    Carrier: 5,
    Battleship: 4,
    Destroyers: 3,
    Submarine: 3,
    "Patrol Boat": 2,
  };
  const human = playerFactory("Human");
  const computer = playerFactory("Computer");
  let startGame = function () {
    gameMode = "placeship";
    currentPlayer = "Human";
    placeShipCounter = 0;
    message("Place you carrier captain", "add")
    placeShipRound()
    return gameMode;
  };
  let endGame = function () {
    gameMode = "end";
    return gameMode;
  };
  let getGameMode = function () {
    return gameMode;
  };
  let placeShipRound = function () {
    displayGrid.cacheDOM("placeShip");
    displayGrid.placeShip("placeShip", shipSizes[placeShipCounter]);
    placeShipCounter++;
  }
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
    human,
    computer,
    getGameMode,
    placeShipRound
  };
})();

export { game };
