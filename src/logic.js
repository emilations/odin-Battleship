function shipFactory(length) {
  let _sank = false;
  // 0 is no hits while a 1 represets a hit
  let fuselage = [];
  fuselage.length = length;
  fuselage.fill(0);

  let getFuselage = function () {
    return [...fuselage];
  };

  // Location is uses array index
  let hit = function (location) {
    if (location > length - 1) {
      throw new Error("hit not successful");
    }
    fuselage[location] = 1;
    return "hit successful";
  };

  let isSunk = function () {
    if (fuselage.every((elem) => elem == 1)) {
      _sank = true;
    }
    return _sank;
  };

  return {
    length,
    getFuselage,
    isSunk,
    hit,
  };
}

function gameboardFactory() {return "eww"}

// this is a test
module.exports = { shipFactory, gameboardFactory };
