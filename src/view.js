const { game } = require("./control")

let message = function (message) {
  let messageDOM = document.querySelector(".message > p");
  messageDOM.innerHTML = message;
};

// View function to
let placeShip = function (shipSize) {
  let grid = document.querySelectorAll(".grid-left > .grid-layout > .cell-p1");
  let direction = "x";

  // Highlight grid when hovering the mouse to place ships
  let highlight = function (e, direction, shipSize) {
    // Clear the previous highlight if present
    grid.forEach((elem) => elem.classList.remove("grid-hover-forced"));
    let x = parseInt(e.target.id[12]);
    let y = parseInt(e.target.id[6]);

    // Check if ship goes outside the grid
    if (
      (direction == "x" && x + shipSize > 10) ||
      (direction == "y" && y + shipSize > 10)
    ) {
      throw new Error("Out of bounds");
    }

    // convert from x y to linear coor
    let coor = x * 1 + y * 10;

    // Highlight the gird based on coor and ship size
    if (direction == "x") {
      let limit = coor + shipSize;
      do {
        grid[coor].classList.add("grid-hover-forced");
        coor++;
      } while (coor < limit);
    } else if (direction == "y") {
      let limit = coor + 10 * shipSize;
      do {
        grid[coor].classList.add("grid-hover-forced");
        coor += 10;
      } while (coor < limit);
    }
  };

  // Event listener to rotate the placement of the ship
  let rotateShip = function () {
    direction = direction == "x" ? "y" : "x";
  };

  // Register ship location
  let saveShip = function (e, direction, shipSize) {
    return e, direction, shipSize;
  };

  // add the event listener on each grid
  let gridListen = function () {
    grid.forEach((elem) => {
      elem.classList.add("grid-hover");
      elem.shipSize = shipSize;
      elem.addEventListener("mouseover", (e) => {
        highlight(e, direction, shipSize);
        elem.addEventListener("click", (e) => {
          let x = (e.target.id[12]);
          let y = (e.target.id[6]);
          // game.human.gameboard.placeShip({dir: direction, x, y}, shipSize);
          // game.human.gameboard.getPrivateGrid()
          console.log(game)
        });
      });
    });
  };

  // Initiate the place ship
  gridListen();
  window.addEventListener("wheel", rotateShip);
};

module.exports = { placeShip };
