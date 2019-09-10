import chalk from 'chalk';
import constants from '../sudoku.json';

console.log(chalk.cyan.bold('Yet Another Sudoku Solver\n'));
const { squares, unitlist } = constants;


const digits: string   = '123456789'
const rows: 	string   = 'ABCDEFGHI'
const cols:		string   = digits
const units: Map<string, string[][]>  = new Map();
const peers: Map<string, Set<string>> = new Map();

let curUnits: string[][] = [];
for (const s of squares) {
	// gets all unitlist arrays that contain s
	curUnits = unitlist.filter(u => u.includes(s));
	units.set(s, curUnits);

	const arrReducer = (acc: string[], cur: string[]) => acc.concat(cur);
	peers.set(s, new Set(curUnits.reduce(arrReducer)));
}

const gridValues = (grid: string) => {
	const chars: [string, string][] = [];
	grid.split('').forEach((v, i) => {
		if (digits.includes(v) || '0.'.includes(v)){
			chars.push([squares[i],v]);
		}
	});
	return new Map(chars);
}

const parseGrid = (grid: string) => {
	// Convert grids to a Map of possible values
	const values = new Map();
	squares.map(s => {values.set(s, digits)});
	for (const [s, d] of gridValues(grid)){
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
	gridValues,
	parseGrid
}
