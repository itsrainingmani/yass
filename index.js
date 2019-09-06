const chalk = require('chalk');
const constants = require('./sudoku.json');

console.log(chalk.cyan.bold('Yet Another Sudoku Solver\n'));
const { squares, unitlist } = constants;

const cross = (A, B) => {
	const crossProduct = new Array();
	for (const i of A) {
		for (const j of B) {
			crossProduct.push(i + j);
		}
	}
	return crossProduct;
}

const units = new Map();
let curUnits = [];
for (const s of squares) {
	// gets all unitlist arrays that contain s
	curUnits = unitlist.filter(u => u.includes(s));
	units.set(s, curUnits);
}

// CommonJS
module.exports = {
	squares,
	unitlist,
	units
}
