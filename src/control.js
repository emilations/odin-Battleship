import { playerFactory } from "./factory";
import { displayGrid, message } from "./view";

let game = (function () {
  let currentPlayer;
  let gameMode;
  let placeShipCounter;
  let human = playerFactory("Human");
  let computer = playerFactory("Computer");
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
    console.log(human)
    placeShip();
  };
  let placeShip = function () {
    message("Place your carrier Captain", "add");
    displayGrid.configure("placeShip");
    displayGrid.cacheDOM();
    displayGrid.rotateButton("on");
    displayGrid.startHighlightCell("placeShip");
    displayGrid.registerPlaceShipCell();
    // human.placeShip({x:1,y:1,dir:"y"},5)
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
      return JSON.parse(JSON.stringify(computer.gameboard.getPublicGrid()));
    }
  };
  let endGame = function () {};
  return {
    startGame,
    endGame,
    placeShip,
    getGrid,
    human,
    computer,
  };
})();

export { game };
