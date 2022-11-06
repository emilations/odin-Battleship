import { game } from "./control";

// buttonRotate can be "add" or "del"
let message = function (message, buttonRotate) {
  let messageDOM = document.querySelector(".message > p");
  messageDOM.innerHTML = message;
  if (buttonRotate == "add") {
    let rotateButton = document.createElement("button");
    rotateButton.textContent = "Rotate Ship";
    let messageDOMdiv = document.querySelector(".message");
    messageDOMdiv.append(rotateButton);
  } else if (buttonRotate == "del") {
    let messageDOMdiv = document.querySelector(".message");
    messageDOMdiv.removeChild(messageDOMdiv.lastChild);
  }
};

let displayGrid = (function () {
  let mouseCoor = {
    y: 0,
    x: 0,
    dir: "x",
  };
  let grid;
  let cacheDOM = function (mode) {
    if (mode == "placeShip") {
      grid = document.querySelectorAll(".grid-left > .grid-layout > .cell-p1");
    }
  };
  let removeAddListener = function () {};
  let placeShip = function (mode, shipSize) {
    if (mode == "placeShip") {
      // add the event listener on each grid
      grid.forEach((elem) => {
        // cell mouse over
        elem.addEventListener("mouseover", (e) => {
          mouseCoor.x = parseInt(e.target.id[12]);
          mouseCoor.y = parseInt(e.target.id[6]);
          refresh(mode, shipSize);
        });
        let tempfunction = function () {
          // do not save if interference
          let coorLinear = parseInt(mouseCoor.x) + parseInt(mouseCoor.y) * 10;
          grid[coorLinear].classList.add("cell-hover-forced");
          for (let i = 0; i < shipSize; i++) {
            if (
              (mouseCoor.dir == "x" &&
                grid[coorLinear + i].classList.contains("cell-ship-present")) ||
              (mouseCoor.dir == "y" &&
                grid[coorLinear + i * 10].classList.contains(
                  "cell-ship-present"
                ))
            ) {
              return console.log("interference");
            }
          }
          try {
            game.human.placeShip(mouseCoor, shipSize);
            console.log(`The ship size is ${shipSize}`)
          } catch (error) {
            console.log(error.message);
            return;
          }
          message("Ship placed! The next one");
          if (shipSize == 1) {
            console.log("asd");
          } else {
            game.placeShipRound();
          }
          refresh("populate");
          refresh("placeShip", shipSize);
        };
        // cell click
        elem.removeEventListener("click", tempfunction)
        elem.addEventListener("click", tempfunction);
      });
      // Rotate button
      let rotateButton = document.querySelector(".message > button");
      let rotateShipClick = function () {
        console.log("Times")
        rotateShip();
        refresh("placeShip", shipSize);
      };
      rotateButton.removeEventListener("click", rotateShipClick, true)
      rotateButton.addEventListener("click", rotateShipClick);
      console.dir(rotateButton)
    }
  };
  let refresh = function (mode, shipSize) {
    // Clear the grid from all the current hightlights
    grid.forEach((elem) =>
      elem.classList.remove(
        "cell-hover-forced",
        "cell-hover-outBound",
        "cell-ship-highlight-interference"
      )
    );
    // Populate the grid from memory
    if (mode == "populate") {
      let humanGrid = game.human.gameboard.getPrivateGrid();
      humanGrid.forEach((elemRow, x) => {
        elemRow.forEach((elemCell, y) => {
          if (elemCell[0] == "S") {
            let coorLinear = parseInt(x) + parseInt(y) * 10;
            grid[coorLinear].classList.add("cell-ship-present");
          }
        });
      });
    } else if (mode == "placeShip") {
      // convert from x y to linear coor
      let coorLinear = parseInt(mouseCoor.x) + parseInt(mouseCoor.y) * 10;
      grid[coorLinear].classList.add("cell-hover-forced");
      // Check if ship goes outside the grid
      if (
        (mouseCoor.dir == "x" && mouseCoor.x + shipSize > 10) ||
        (mouseCoor.dir == "y" && mouseCoor.y + shipSize > 10)
      ) {
        // Make the cursor background red
        grid[coorLinear].classList.add("cell-hover-outBound");
        return;
      }
      // highlight red for interference
      for (let i = 0; i < shipSize; i++) {
        if (
          mouseCoor.dir == "x" &&
          grid[coorLinear + i].classList.contains("cell-ship-present")
        ) {
          grid[coorLinear + i].classList.add(
            "cell-ship-highlight-interference"
          );
        } else if (
          mouseCoor.dir == "y" &&
          grid[coorLinear + i * 10].classList.contains("cell-ship-present")
        ) {
          grid[coorLinear + i * 10].classList.add(
            "cell-ship-highlight-interference"
          );
        }
      }
      // Draw the ship highlight in x or y
      if (mouseCoor.dir == "x") {
        let limit = coorLinear + shipSize;
        do {
          grid[coorLinear].classList.add("cell-hover-forced");
          coorLinear++;
        } while (coorLinear < limit);
      } else if (mouseCoor.dir == "y") {
        let limit = coorLinear + 10 * shipSize;
        do {
          grid[coorLinear].classList.add("cell-hover-forced");
          coorLinear += 10;
        } while (coorLinear < limit);
      }
    }
  };
  let rotateShip = function () {
    mouseCoor.dir = mouseCoor.dir == "x" ? "y" : "x";
  };
  return {
    cacheDOM,
    placeShip,
    refresh,
    removeAddListener,
  };
})();

export { displayGrid, message };
