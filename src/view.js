let message = function (message, buttonRotate) {
  let messageDOM = document.querySelector(".message > p");
  messageDOM.innerHTML = message;
  if (buttonRotate) {
    let rotateButton = document.createElement("button");
    rotateButton.textContent = "Rotate Ship";
    let messageDOMdiv = document.querySelector(".message");
    messageDOMdiv.append(rotateButton);
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
          console.log(`Clicked on x:${mouseCoor.x} and y: ${mouseCoor.y}`);
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
    if (mode == "placeShip") {
      // Clear the grid from all the current hightlights
      grid.forEach((elem) =>
        elem.classList.remove("grid-hover-forced", "grid-hover-outBound")
      );
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
    }
  };
  let rotateShip = function () {
    mouseCoor.dir = mouseCoor.dir == "x" ? "y" : "x";
    refresh();
  };
  return {
    cacheDOM,
    addListener,
    refresh,
  };
})();

export { displayGrid, message };

// View function to
// let placeShip = function (shipSize) {
//   let grid = document.querySelectorAll(".grid-left > .grid-layout > .cell-p1");
//   let direction = "x";

//   // Highlight grid when hovering the mouse to place ships
//   let highlight = function (e, direction, shipSize) {
//     // Clear the previous highlight if present
//     grid.forEach((elem) => elem.classList.remove("grid-hover-forced"));
//     let x = parseInt(e.target.id[12]);
//     let y = parseInt(e.target.id[6]);

//     // Check if ship goes outside the grid
//     if (
//       (direction == "x" && x + shipSize > 10) ||
//       (direction == "y" && y + shipSize > 10)
//     ) {
//       throw new Error("Out of bounds");
//     }

//     // convert from x y to linear coor
//     let coor = x * 1 + y * 10;

//     // Highlight the gird based on coor and ship size
//     if (direction == "x") {
//       let limit = coor + shipSize;
//       do {
//         grid[coor].classList.add("grid-hover-forced");
//         coor++;
//       } while (coor < limit);
//     } else if (direction == "y") {
//       let limit = coor + 10 * shipSize;
//       do {
//         grid[coor].classList.add("grid-hover-forced");
//         coor += 10;
//       } while (coor < limit);
//     }
//   };

//   // Event listener to rotate the placement of the ship
//   let rotateShip = function () {
//     direction = direction == "x" ? "y" : "x";
//   };

//   // Register ship location
//   let saveShip = function (e, direction, shipSize) {
//     return e, direction, shipSize;
//   };

//   // Initiate the place ship
//   window.addEventListener("wheel", rotateShip);
// };
