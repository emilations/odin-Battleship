import { playerFactory } from "./factory";
import { displayGrid } from "./view";


let game = (function () {
  let currentPlayer;
  let gameMode;
  let placeShipCounter;
  let human = playerFactory("Human");
  let computer = playerFactory("Computer");
  let startGame = function () {
    let shipSize = 5;
    gameMode = "placeship";
    currentPlayer = "Human";
    placeShipCounter = 1;
    displayGrid.cacheDOM("placeShip");
    displayGrid.addListener("placeShip", shipSize);
    return gameMode;
  };
  let endGame = function () {
    gameMode = "end";
    return gameMode;
  };
  let getGameMode = function () {
    return gameMode;
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
    human,
    computer,
    getGameMode,
  };
})();

export { game };