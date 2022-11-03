let message = function (message) {
  let messageDOM = document.querySelector(".message > p");
  messageDOM.innerHTML = message;
};

let placeShip = function (shipSize) {
  let grid = document.querySelectorAll(".grid-left > .grid-layout > .cell-p1");
  let direction = "x";

  // event listner function
  let highlight = function (e, direction, shipSize) {
    grid.forEach((elem) => elem.classList.remove("grid-hover-forced"))
    let x = parseInt(e.target.id[12]);
    let y = parseInt(e.target.id[6]);
    if ((direction == "x" && x + shipSize > 10) || (direction == "y" && y + shipSize > 10)) {
      throw new Error("Out of bounds");
    } 

    // convert from x y to linear coor
    let coor = x * 1 + y * 10;
    
    if (direction == "x") {
      let limit = coor + shipSize;
      do {
        grid[coor].classList.add("grid-hover-forced")
        coor++;
      } while (coor < limit);
    } else if (direction == "y") {
      let limit = coor + 10*shipSize;
      do {
        grid[coor].classList.add("grid-hover-forced")
        coor += 10;
      } while (coor < limit);
    }
  };

  // event listener function
  let rotateShip = function () {
    direction = direction == "x" ? "y" : "x";
  };
  let gridListen = function() {
  grid.forEach((elem) => {
    elem.classList.add("grid-hover");
    elem.shipSize = shipSize;
    elem.addEventListener("mouseover", (e) => {
      highlight(e, direction, shipSize);
    });
  })};
  gridListen()
  window.addEventListener("wheel", rotateShip)
};

module.exports = { placeShip };
