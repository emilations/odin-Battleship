function shipFactory(length) {
  let _sank = false;

  let fuselage = [];
  fuselage.length = length;
  fuselage.fill(1);
  let getFuselage = function () {
    return [...this.fuselage];
  };

  let hit = function (location) {
		if (location > length){return "hit not successful"}
		fuselage[location] = 0;
		return ("hit successful");
	};

  let isSunk = function () {
		
    return _sank;
  };

  return {
    length,
    getFuselage,
    isSunk,
		hit,
  };
}

// this is a test
module.exports = { shipFactory };