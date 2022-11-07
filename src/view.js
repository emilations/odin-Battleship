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
  let gridLeftDOM;
  let gridRightDOM;
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
      gridLeft.classList.add("grid-middle");
      gridRight.classList.add("grid-hide");
    } else if (mode == "gameOn") {
      gridLeft.classList.remove("grid-middle");
      gridRight.classList.remove("grid-hide");
    }
  };
  let highlightCell = function (mode) {
    if (mode == "placeShip") {
      gridLeftDOM.forEach((elem) => {
        elem.addEventListener("mouseover", updateCursor);
        elem.addEventListener("mouseover", highlightCursor);
      });
      // MOUSEOVER update cursor coordinates when hovering above grid
      function updateCursor(e) {
        mouseCoor.x = parseInt(e.target.id[12]);
        mouseCoor.y = parseInt(e.target.id[6]);
      }
      // MOUSEOVER highlight cursor and simulate ship presence
      function highlightCursor(e) {
        let coorLinear = parseInt(mouseCoor.x) + parseInt(mouseCoor.y) * 10;
        let shipSize = 5;
        // Check if ship is out of bounds
        if (
          (mouseCoor.dir == "x" && shipSize + parseInt(mouseCoor.x) > 10) ||
          (mouseCoor.dir == "y" && shipSize + parseInt(mouseCoor.y) > 10)
        ) {
          gridLeftDOM[coorLinear].classList.add("cell-hover-outBound");
          return;
        }
        // Create ship highlight
        if (mouseCoor.dir == "x") {
          for (let i = 0; i < shipSize; i++) {
            gridLeftDOM[coorLinear + i].classList.add("cell-hover");
          }
        } else if (mouseCoor.dir == "y") {
          for (let i = 0; i < shipSize; i++) {
            gridLeftDOM[coorLinear + i * 10].classList.add("cell-hover");
          }
        }
        // Check if ship highlight interferes with current ship
        // ---------------------------------------------------------------------------------------------3
        // for (let i = 0; i < shipSize; i++) {
        //   if (
        //     (mouseCoor.dir == "x" &&
        //       gridLeftDOM[coorLinear + i].classList.contains(
        //         "cell-ship-present"
        //       )) ||
        //     (mouseCoor.dir == "y" &&
        //       gridLeftDOM[coorLinear + i * 10].classList.contains(
        //         "cell-ship-present"
        //       ))
        //   ) {
        //     return console.log("interference");
        //   }
        // }
      }
    }
  };
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

        // cell click
        elem.removeEventListener("click", tempfunction);
        elem.addEventListener("click", tempfunction);
      });
      // Rotate button
      let rotateButton = document.querySelector(".message > button");
      let rotateShipClick = function () {
        console.log("Times");
        rotateShip();
        refresh("placeShip", shipSize);
      };
      rotateButton.removeEventListener("click", rotateShipClick, true);
      rotateButton.addEventListener("click", rotateShipClick);
      console.dir(rotateButton);
    }
  };

  let refresh = function (mode, side) {
    // Reset the grid from any event listener
    if (mode == "reset"){
      // Left side
      var old_element = document.getElementById(".grid-left > .grid-layout");
      var new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);
      // Right side
      var old_element = document.getElementById(".grid-right > .grid-layout");
      var new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);
    }
    // ------------------------------------------------------------------------------------------------------------1
    if (mode == "populate"){}
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
  // -----------------------------------------------------------------------------------------------------------------2
  let rotateShip = function () {
    mouseCoor.dir = mouseCoor.dir == "x" ? "y" : "x";
  };
  return {
    cacheDOM,
    configure,
    highlightCell,
  };
})();

export { displayGrid, message };
