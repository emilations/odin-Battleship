import { game } from "./control";

let message = function (message, buttonRotate) {
  let messageDOM = document.querySelector(".message > p");
  messageDOM.innerHTML = message;
  if (buttonRotate) {
    let rotateButton = document.createElement("button");
    rotateButton.textContent = "Rotate Ship";
    let messageDOMdiv = document.querySelector(".message");
    messageDOMdiv.append(rotateButton);
  } else {
    let messageDOMdiv = document.querySelector(".message");
    messageDOMdiv.removeChild(messageDOMdiv.lastChild)
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
  let addListener = function (mode, shipSize) {
    if (mode == "placeShip") {
      // add the event listener on each grid
      grid.forEach((elem) => {
        elem.addEventListener("mouseover", (e) => {
          mouseCoor.x = parseInt(e.target.id[12]);
          mouseCoor.y = parseInt(e.target.id[6]);
          refresh(mode, shipSize);
        });
        elem.addEventListener("click", (e) => {
          try {
            game.human.placeShip(mouseCoor, shipSize);
          } catch (error) {
            console.log(error.message);
          }
          message("Ship placed")

          refresh("ShipPlaced");
          refresh(mode, shipSize);
        });
      });
      let rotateButton = document.querySelector(".message > button");
      rotateButton.addEventListener("click", () => {
        rotateShip();
        refresh(mode, shipSize);
      });
    }
  };
  let refresh = function (mode, shipSize) {
    // Clear the grid from all the current hightlights
    grid.forEach((elem) =>
      elem.classList.remove("grid-hover-forced", "grid-hover-outBound")
    );
    if (mode == "placeShip") {
      // convert from x y to linear coor
      let coorLinear = parseInt(mouseCoor.x) + parseInt(mouseCoor.y) * 10;
      grid[coorLinear].classList.add("grid-hover-forced");
      // Check if ship goes outside the grid
      if (
        (mouseCoor.dir == "x" && mouseCoor.x + shipSize > 10) ||
        (mouseCoor.dir == "y" && mouseCoor.y + shipSize > 10)
      ) {
        // Make the cursor background red
        grid[coorLinear].classList.add("grid-hover-outBound");
        return;
      }
      // Highlight the grid based on coor and ship size
      if (mouseCoor.dir == "x") {
        let limit = coorLinear + shipSize;
        do {
          grid[coorLinear].classList.add("grid-hover-forced");
          coorLinear++;
        } while (coorLinear < limit);
      } else if (mouseCoor.dir == "y") {
        let limit = coorLinear + 10 * shipSize;
        do {
          grid[coorLinear].classList.add("grid-hover-forced");
          coorLinear += 10;
        } while (coorLinear < limit);
      }
    } else if (mode == "shipPlaced") {
      let humanGrid = game.human.getPrivateGrid();
      humanGrid.forEach((elem) => {});
    }
  };
  let rotateShip = function () {
    mouseCoor.dir = mouseCoor.dir == "x" ? "y" : "x";
  };
  return {
    cacheDOM,
    addListener,
    refresh,
  };
})();

export { displayGrid, message };
