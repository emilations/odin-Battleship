let grid = document.querySelectorAll(".grid-left > .grid-layout > .cell-p1");

let message = function (message) {
  let messageDOM = document.querySelector(".message > p");
  messageDOM.innerHTML = message;
};

let placeShip = function (shipSize) {
  let direction = "y";
  grid.forEach((elem) => {
    elem.classList.add("grid-hover");
    elem.shipSize = shipSize;
    elem.addEventListener("mouseover", highlight);
  });
  window.addEventListener("wheel", rotateShip)
};

function highlight(e) {
  let x = e.target.id[6];
  let y = e.target.id[12];
  console.log(`x:${x} & y:${y} ${e.target.shipSize} `);
  console.dir(e.target);
  console.log(grid);
}

function rotateShip(){
  console.log("rotateShip")
}

module.exports = { placeShip };