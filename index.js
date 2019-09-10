const chalk = require('chalk');
const constants = require('./sudoku.json');

console.log(chalk.cyan.bold('Yet Another Sudoku Solver\n'));
const { squares, unitlist } = constants;


const digits   = '123456789'
const rows     = 'ABCDEFGHI'
const cols     = digits
const units = new Map();
const peers = new Map();

let curUnits = [];
for (const s of squares) {
	// gets all unitlist arrays that contain s
	curUnits = unitlist.filter(u => u.includes(s));
	units.set(s, curUnits);

	const arrReducer = (acc, cur) => acc.concat(cur);
	peers.set(s, new Set(curUnits.reduce(arrReducer)));
}

const grid_values = (grid) => {
	const chars = [];
	grid.split('').forEach((v, i) => {
		if (digits.includes(v) || '0.'.includes(v)){
			chars.push([squares[i],v]);
		}
	});
	return new Map(chars);
}

const parse_grid = (grid) => {
	// Convert grids to a Map of possible values
	const values = new Map();
	squares.map(s => {values.set(s, digits)});
	for (const [s, d] of grid_values(grid)){
		if (digits.includes(d) && !assign(values, s, d)){
			return false;
		}
	}
	return values;
}

// CommonJS
module.exports = {
	squares,
	unitlist,
	units,
	peers,
	grid_values,
	parse_grid
}
