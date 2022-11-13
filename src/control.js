import { playerFactory } from "./factory";

let human = playerFactory("Human");
let computer = playerFactory("Computer");

// This game module using to control the main event of the game
let game = (function () {
  let currentPlayer = "Human";
  let gameMode;
  let placeShipCounter;
  let initiateGame = function () {
    human = playerFactory("Human");
    computer = playerFactory("Computer");
    placeShip();
  };
  // Starts the placeship MODE
  let placeShip = function () {
    displayGrid.configure("placeShip");
    displayGrid.cacheDOM();
    displayGrid.rotateButton("on");
    displayGrid.startHighlightCell("placeShip");
    displayGrid.registerPlaceShipCell();
  };
  // Stops the placeship MODE and start Game MODE
  let startGame = function () {
    // Setup the layouts
    displayGrid.configure("gameOn");
    displayGrid.refresh("reset");
    displayGrid.refresh("populate");
    message("You can start with your first hit captain");
    // make the computer place its ship randomly
    computer.placeShip();
    // Start the rounds
    round();
  };
  // --------------------------------------------------------------------------------------------2
  let round = function () {
    if (currentPlayer == "Human") {
      currentPlayer = currentPlayer == "Human" ? "Computer" : "Human";
      console.log("human turn")
      displayGrid.cacheDOM();
      displayGrid.attackListenerCell();
    } else if (currentPlayer == "Computer") {
      currentPlayer = currentPlayer == "Human" ? "Computer" : "Human";
      console.log("computer turn")
      displayGrid.refresh("reset");
      computer.attack()
      displayGrid.refresh("populate")
    }
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
    initiateGame,
    startGame,
    endGame,
    placeShip,
    getGrid,
    round,
  };
})();

let displayGrid = (function () {
  let mouseCoor = {
    y: 0,
    x: 0,
    dir: "x",
  };
  let messages = [
    "Place your carrier captain",
    "Place your battleship captain",
    "Place your destroyer captain",
    "Place your submarine captain",
    "Place your patrol boat captain",
  ];
  let shipSizes = [5, 4, 3, 3, 2];
  let shipSizeIndex = 0;
  let gridLeftDOM;
  let gridRightDOM;
  // MOUSEOVER update cursor coordinates when hovering above grid for mouseover event
  // listeners used for startHighlightCell and attackListenerCell
  let updateCursor = function (e) {
    mouseCoor.x = parseInt(e.target.id[12]);
    mouseCoor.y = parseInt(e.target.id[6]);
  };
  let cacheDOM = function () {
    gridLeftDOM = document.querySelectorAll(
      ".grid-left > .grid-layout > .cell-p1"
    );
    gridRightDOM = document.querySelectorAll(
      ".grid-right > .grid-layout > .cell-p1"
    );
  };
  let configure = function (mode) {
    let gridLeft = document.querySelector(".grid-left");
    let gridRight = document.querySelector(".grid-right");
    if (mode == "placeShip") {
      message("", "add");
      message(`${messages[shipSizeIndex]}`);
      gridLeft.classList.add("grid-middle");
      gridRight.classList.add("grid-hide");
    } else if (mode == "gameOn") {
      message("", "del");
      gridLeft.classList.remove("grid-middle");
      gridRight.classList.remove("grid-hide");
    }
  };
  let startHighlightCell = function (mode) {
    // be able to highlight interference with already placed ships
    if (mode == "placeShip") {
      gridLeftDOM.forEach((elem) => {
        elem.addEventListener("mouseover", updateCursor);
        elem.addEventListener("mouseover", highlightCursor);
      });
      // MOUSEOVER highlight cursor and simulate ship presence
      function highlightCursor(e) {
        message(`${messages[shipSizeIndex]}`);
        refresh("highlight");
        let coorLinear = parseInt(mouseCoor.x) + parseInt(mouseCoor.y) * 10;
        // Check if ship is out of bounds
        if (
          (mouseCoor.dir == "x" &&
            shipSizes[shipSizeIndex] + parseInt(mouseCoor.x) > 10) ||
          (mouseCoor.dir == "y" &&
            shipSizes[shipSizeIndex] + parseInt(mouseCoor.y) > 10)
        ) {
          gridLeftDOM[coorLinear].classList.add("cell-hover-outBound");
          return;
        }
        // highlight red when a ship already exist
        let humanGrid = human.gameboard.getPrivateGrid();
        if (mouseCoor.dir == "x") {
          for (let i = 0; i < shipSizes[shipSizeIndex]; i++) {
            if (humanGrid[mouseCoor.x + i][mouseCoor.y][0] == "S") {
              gridLeftDOM[coorLinear + i].classList.add(
                "cell-ship-highlight-interference"
              );
            }
          }
        } else if (mouseCoor.dir == "y") {
          for (let i = 0; i < shipSizes[shipSizeIndex]; i++) {
            if (humanGrid[mouseCoor.x][mouseCoor.y + i][0] == "S") {
              gridLeftDOM[coorLinear + i * 10].classList.add(
                "cell-ship-highlight-interference"
              );
            }
          }
        }
        // Create ship highlight
        if (mouseCoor.dir == "x") {
          for (let i = 0; i < shipSizes[shipSizeIndex]; i++) {
            gridLeftDOM[coorLinear + i].classList.add("cell-hover");
          }
        } else if (mouseCoor.dir == "y") {
          for (let i = 0; i < shipSizes[shipSizeIndex]; i++) {
            gridLeftDOM[coorLinear + i * 10].classList.add("cell-hover");
          }
        }
      }
    }
  };
  let registerPlaceShipCell = function () {
    gridLeftDOM.forEach((elem) => {
      elem.addEventListener("click", registerShipLocation);
    });
    function registerShipLocation(e) {
      let humanGrid = human.gameboard.getPrivateGrid();
      // Check if any interference with another already placed ship
      if (mouseCoor.dir == "x") {
        for (let i = 0; i < shipSizes[shipSizeIndex]; i++) {
          if (humanGrid[mouseCoor.x + i][mouseCoor.y][0] == "S") {
            return;
          }
        }
      } else if (mouseCoor.dir == "y") {
        for (let i = 0; i < shipSizes[shipSizeIndex]; i++) {
          if (humanGrid[mouseCoor.x][mouseCoor.y + i][0] == "S") {
            return;
          }
        }
      }
      message(`${messages[shipSizeIndex]}`);
      human.placeShip(mouseCoor, shipSizes[shipSizeIndex]);
      human.gameboard.getPrivateGrid();
      shipSizeIndex++;
      refresh("populate");
      message(`${messages[shipSizeIndex]}`);
      if (shipSizeIndex >= 5) {
        game.startGame();
      }
    }
  };
  let attackListenerCell = function () {
    gridRightDOM.forEach((elem) => {
      elem.addEventListener("mouseover", updateCursor);
      elem.addEventListener("click", attackCell);
    });
    function attackCell() {
      computer.gameboard.attack(mouseCoor);
      refresh("populate");
      game.round();
    }
  };
  let refresh = function (mode) {
    // Reset the grid from any event listener
    if (mode == "reset") {
      // Left side
      let old_elementLeft = document.querySelector(".grid-left > .grid-layout");
      let new_elementLeft = old_elementLeft.cloneNode(true);
      old_elementLeft.parentNode.replaceChild(new_elementLeft, old_elementLeft);
      // Right side
      let old_elementRight = document.querySelector(
        ".grid-right > .grid-layout"
      );
      let new_elementRight = old_elementRight.cloneNode(true);
      old_elementRight.parentNode.replaceChild(
        new_elementRight,
        old_elementRight
      );
    } else if (mode == "populate") {
      // --------------------------------------------------------------------------------------------------------------------1
      let humanGridPrivate = human.gameboard.getPrivateGrid();
      humanGridPrivate.forEach((elemRow, indexX) => {
        elemRow.forEach((eachGrid, indexY) => {
          if (eachGrid[0] == "S") {
            let coorLinear = parseInt(indexX) + parseInt(indexY) * 10;
            gridLeftDOM[coorLinear].classList.add("cell-ship-present");
          } else if (eachGrid[0] == "H") {
            let coorLinear = parseInt(indexX) + parseInt(indexY) * 10;
            gridLeftDOM[coorLinear].classList.add("cell-ship-present");
            gridLeftDOM[coorLinear].textContent = "X";
          } else if (eachGrid[0] == "M") {
            let coorLinear = parseInt(indexX) + parseInt(indexY) * 10;
            gridLeftDOM[coorLinear].classList.add("cell-ship-present");
            gridLeftDOM[coorLinear].textContent = "M";
          }
        });
      });
      let computerGridPublic = computer.gameboard.getPublicGrid();
      computerGridPublic.forEach((elemRow, indexX) => {
        elemRow.forEach((eachGrid, indexY) => {
          let coorLinear = parseInt(indexX) + parseInt(indexY) * 10;
          if (eachGrid[0] == "H") {
            gridRightDOM[coorLinear].classList.add("cell-ship-present");
            gridRightDOM[coorLinear].textContent = "X";
          } else if (eachGrid[0] == "M") {
            gridRightDOM[coorLinear].classList.add("cell-ship-missed");
            gridRightDOM[coorLinear].textContent = "M";
          }
        });
      });
    } else if (mode == "highlight") {
      gridLeftDOM.forEach((elem) =>
        elem.classList.remove(
          "cell-hover",
          "cell-hover-outBound",
          "cell-ship-highlight-interference"
        )
      );
      gridRightDOM.forEach((elem) =>
        elem.classList.remove(
          "cell-hover",
          "cell-hover-outBound",
          "cell-ship-highlight-interference"
        )
      );
    }
  };
  let rotateShip = function () {
    mouseCoor.dir = mouseCoor.dir == "x" ? "y" : "x";
    refresh("highlight");
  };
  let rotateButton = function (mode) {
    if (mode == "on") {
      let rotateButton = document.querySelector(".message > button");
      rotateButton.addEventListener("click", rotateShip);
    }
  };
  return {
    cacheDOM,
    configure,
    startHighlightCell,
    rotateButton,
    refresh,
    registerPlaceShipCell,
    attackListenerCell,
  };
})();

// buttonRotate can be "add" or "del"
let message = function (message, buttonRotate) {
  let messageDOM = document.querySelector(".message > p");
  messageDOM.innerHTML = message;
  // call the function with add to add a button
  if (buttonRotate == "add") {
    let rotateButton = document.createElement("button");
    rotateButton.textContent = "Rotate Ship";
    let messageDOMdiv = document.querySelector(".message");
    messageDOMdiv.append(rotateButton);
    // call the function with del to delete the button
  } else if (buttonRotate == "del") {
    let messageDOMdiv = document.querySelector(".message");
    messageDOMdiv.removeChild(messageDOMdiv.lastChild);
  }
};

export { game, human };
