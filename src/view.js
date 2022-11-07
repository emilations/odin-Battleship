import { game } from "./control";

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
        refresh("highlight")
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
      }
    }
  };

  let refresh = function (mode) {
    // Reset the grid from any event listener
    if (mode == "reset") {
      // Left side
      let old_elementLeft = document.getElementById(
        ".grid-left > .grid-layout"
      );
      let new_elementLeft = old_elementLeft.cloneNode(true);
      old_elementLeft.parentNode.replaceChild(new_elementLeft, old_elementLeft);
      // Right side
      let old_elementRight = document.getElementById(
        ".grid-right > .grid-layout"
      );
      let new_elementRight = old_elementRight.cloneNode(true);
      old_elementRight.parentNode.replaceChild(
        new_elementRight,
        old_elementRight
      );
    } else if (mode == "populate") {
      let humanGridPublic = game.getGrid("human");
      humanGridPublic.forEach((elemRow, indexX) => {
        elemRow.forEach((eachGrid, indexY) => {
          if (eachGrid[0] == "S") {
            let coorLinear = parseInt(indexX) + parseInt(indexY) * 10;
            gridLeftDOM[coorLinear].classList.add("cell-ship-present");
          } else if (eachGrid[0] == "H") {
            let coorLinear = parseInt(indexX) + parseInt(indexY) * 10;
            gridLeftDOM[coorLinear].classList.add("cell-ship-present");
            gridLeftDOM[coorLinear].textContent = "X";
          }
        });
      });
    } else if ( mode == "highlight") {
      gridLeftDOM.forEach((elem) => elem.classList.remove("cell-hover", "cell-hover-outBound"))
      gridRightDOM.forEach((elem) => elem.classList.remove("cell-hover", "cell-hover-outBound"))
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

export { displayGrid, message };
