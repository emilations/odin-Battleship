
function shipFactory(length){
	let hit =  function(name){return name}
	let fuselage = [];
	
	return {
		length,
		isSunk: "false",
		fuselage,
		hit,
	}
}

module.exports = {shipFactory}