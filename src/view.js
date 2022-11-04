const { game } = require("./control");

let mouseCoor = {
  y: "0",
  x: "0",
  dir: "x",
};

let message = function (message) {
  let messageDOM = document.querySelector(".message > p");
  messageDOM.innerHTML = message;
};

let displayGrid = (function () {
  let grid;
  let cacheDOM = function () {
    grid = document.querySelectorAll(".grid-left > .grid-layout > .cell-p1");
  };
  let addListener = function () {
    // add the event listener on each grid
    grid.forEach((elem) => {
      elem.addEventListener("mouseover", (e) => {
        mouseCoor.x = e.target.id[12];
        mouseCoor.y = e.target.id[6];
        refresh("highlight");
      });
      elem.addEventListener("mouseout", (e) => {
        refresh();
        console.log("mouseout")
      });
      elem.addEventListener("click", (e) => {
        console.log(`Clicked on x:${mouseCoor.x} and y: ${mouseCoor.y}`);
      });
    });
  };
  let refresh = function (mode) {
    // Clear the grid from all the current hightlights
    grid.forEach((elem) => elem.classList.remove("grid-hover-forced"));

    if (mode == "highlight") {
      // convert from x y to linear coor
      let coorLinear = parseInt(mouseCoor.x) + parseInt(mouseCoor.y) * 10;

      grid[coorLinear].classList.add("grid-hover-forced");
      console.log("Display refreshed in mode highlight");
    }
  };
  return {
    cacheDOM,
    addListener,
    refresh,
  };
})();

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

module.exports = { displayGrid };
