import constants from './sudoku.json';
import './string.extensions';

type MapOrUndef = Map<string, string> | undefined;
export class Solver {
	digits = '123456789';
	rows = 'ABCDEFGHI';
	cols = this.digits;
	private units: Map<string, string[][]> = new Map(); // Units for a square: [row], [col] and [box]
	private peers: Map<string, Set<string>> = new Map(); // Peers for a square: [row + col + box]
	private squares: string[] = constants.squares;
	private unitlist: string[][] = constants.unitlist;
	transitions: Set<Map<string, string>>; // Global Values State Graph. Using a set to avoid duplicate states

	constructor() {
		// Instantiate the global state graph
		this.transitions = new Set();

		let curUnits: string[][] = [];
		for (const s of this.squares) {
			// gets all unitlist arrays that contain s
			curUnits = this.unitlist.filter(u => u.includes(s));
			this.units.set(s, curUnits);

			const arrReducer = (acc: string[], cur: string[]) => {
				return acc.concat(cur);
			};
			// curUnits.reduce(arrReducer) creates one array out of the 3 different unitlist arrays
			// then we filter out the square value itself and instantiate a set with this array
			this.peers.set(s, new Set(curUnits.reduce(arrReducer).filter(v => v !== s)));
		}
	}

	// Returns a Solved Grid
	solve = (grid: string) => {
		this.transitions.clear(); // Clear out the state graph
		return this.search(this.parseGrid(grid));
	}

	// Tries to find square values using depth-first search and constraint propagation
	private search = (values: MapOrUndef): MapOrUndef => {
		// Using depth-first search and propagation, try all possible values
		if (values === undefined) {
			return undefined; // Failed earlier
		}

		// If every square only has one option, the puzzle is solved
		if (this.squares.every(s => (values.get(s) || '').length === 1)) {
			return values; // Solved
		}

		// Filter out squares that only have one option
		const sqWithMoreThanOneOption = this.squares.filter(s => (values.get(s) || '').length > 1);

		// Function to use as callback in array reduce
		const minReducer = (curMin: string, curVal: string) => {
			const curMinOptions = values.get(curMin) || '123456789';
			const curValOptions = values.get(curVal) || '123456789';
			if (curValOptions.length < curMinOptions.length) {
				return curVal;
			} else {
				return curMin;
			}
		}

		// Find the square with the minimum number of possibilities
		const sqMinOptions = sqWithMoreThanOneOption.reduce(minReducer, sqWithMoreThanOneOption[0]);
		const choices = (values.get(sqMinOptions) || '').split('');
		for (let d of choices) {
			let newValues = new Map(values);
			let nextSearch = this.search(this.assign(newValues, sqMinOptions, d));
			if (nextSearch !== undefined) {
				return nextSearch;
			}
			// else {
			// 	// Remove the most recently added value to the global state graph
			// 	// if it was added by assign
			// 	if (this.transitions.has(newValues)){
			// 		this.transitions.delete(newValues);
			// 	}
			// }
		}
		return undefined;
	}

	// Convert grid string into a Map of Square -> Char
	gridValues = (grid: string) => {
		// The grid string passed to this function can be in a couple of different formats that should be treated equally
		// (1) If the grid is a multiline string, we convert it to a single-line string
		grid = grid.replace(/(\r\n|\n|\r)/gm, "");

		// (2) Single string of 81 characters. If it doesn't have 81 characters, pad the end
		// If it has more than 81 characters, remove the extras
		if (grid.length < 81) {
			grid = grid.padEnd(81, '.');
		} else if (grid.length > 81) {
			grid = grid.slice(0, 81);
		}

		// (3) We only care about the grid string's numerical values.
		// A square that doesn't have a valid numerical value between 1-9 should be replaced by a dot
		let nonNumericRegex = /[^1-9]/g;
		grid = grid.replace(nonNumericRegex, '.');

		const chars: [string, string][] = [];
		grid.split('').forEach((v, i) => chars.push([this.squares[i], v]));
		return new Map(chars);
	};

	private parseGrid = (grid: string): MapOrUndef => {
		// Starting off every square can be any digit
		let eachValues: [string, string][] = [];
		this.squares.map(s => { eachValues.push([s, this.digits]) });
		// Convert grids to a Map of possible values
		let values: Map<string, string> = new Map(eachValues.values());

		// For each square, assign values from the grid if it has a value
		for (let [sq, data] of this.gridValues(grid)) {
			if (this.digits.includes(data) && this.assign(values, sq, data) === undefined) {
				return undefined;
			}
		}
		return values;
	}

	private assign = (values: Map<string, string>, s: string, d: string) => {
		const otherValues = (values.get(s) || '').replace(d, '').split('');
		// ELiminate all the other values (except d) from values[s] and propagate
		if (otherValues.every(d2 => this.eliminate(values, s, d2))) {
			this.transitions.add(values); // Add the value obj to the global state graph
			return values;
		} else {
			return undefined;
		}
	}


	// Eliminate d from the values map; propagate when values or places <= 2
	private eliminate = (values: Map<string, string>, s: string, d: string) => {
		const vals = (values.get(s) || '');
		// Already eliminated
		if (!vals.includes(d)) {
			return true;
		}
		values.set(s, vals.replace(d, ''));

		// (1) If a square s is reduced to one value d2, then eliminate d2 from the peers
		if ((values.get(s) || '').length === 0) {
			// Contradiction: Removed last value
			return false;
		} else if ((values.get(s) || '').length === 1) {
			let d2 = (values.get(s) || '');
			let curPeers = Array.from(this.peers.get(s) || []);
			if (!curPeers.every(s2 => this.eliminate(values, s2, d2))) {
				return false;
			}
		}

		// (2) If a unit u is reduced to only one place for a value d, then put it there
		for (const u of this.units.get(s) || []) {
			const dplaces = u.filter(s => (values.get(s) || '').includes(d));
			// console.log(dplaces);
			if (dplaces.length === 0) {
				// Contradiction: No place for this value
				return false;
			} else if (dplaces.length === 1) {
				if (!this.assign(values, dplaces[0], d)) {
					return false;
				}
			}
		}

		this.transitions.add(values);
		return true;
	}

	display = (values: MapOrUndef): void => {
		if (values === undefined) {
			return;
		}
		const lenArray = this.squares.map(s => (values.get(s) || '').length);
		const width: number = 1 + Math.max(...lenArray);
		const line = ('-'.repeat(width * 3) + '+').repeat(2) + '-'.repeat(width * 3);
		for (let r of this.rows.split('')) {
			let curRow = '';
			for (let c of this.cols.split('')) {
				// curRow += (values.get(r + c) || '').padEnd(width, ' ');
				curRow += (values.get(r + c) || '').center(width, ' ');
				if ('36'.includes(c)) {
					curRow += '|';
				}
			}
			console.log(curRow);
			if ('CF'.includes(r)) {
				console.log(line);
			}
		}
		process.stdout.write('\n');
	}
}
