import chalk from 'chalk';
import constants from '../sudoku.json';

export default class Yass {
	digits = '123456789';
	rows = 'ABCDEFGHI';
	cols = this.digits;
	units: Map<string, string[][]> = new Map();
	peers: Map<string, Set<string>> = new Map();
	squares: string[] = constants.squares;
	unitlist: string[][] = constants.unitlist;

	constructor() {
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

	// Convert grid string into a Map of Square -> Char
	gridValues = (grid: string) => {
		const chars: [string, string][] = [];
		grid.split('').forEach((v, i) => {
			if (this.digits.includes(v) || '0.'.includes(v)) {
				chars.push([this.squares[i], v]);
			}
		});
		return new Map(chars);
	};

	parseGrid = (grid: string) => {
		// Starting off every square can be any digit
		let eachValues: [string, string][] = [];
		this.squares.map(s => { eachValues.push([s, this.digits]) });
		// Convert grids to a Map of possible values
		let values: Map<string, string> = new Map(eachValues.values());

		// For each square, assign values from the grid if it has a value
		this.gridValues(grid).forEach((data, sq) => {
			if (this.digits.includes(data) && !this.assign(values, sq, data)) {
				return false;
			}
		});
		return values;
	}

	assign = (values: Map<string, string>, s: string, d: string) => {
		const otherValues = (values.get(s) || '').replace(d, '').split('');
		// ELiminate all the other values (except d) from values[s] and propagate
		if (otherValues.every(d2 => this.eliminate(values, s, d2))) {
			return true;
		} else {
			return false;
		}
	}


	// Eliminate d from the values map; propagate when values or places <= 2
	eliminate = (values: Map<string, string>, s: string, d: string) => {
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

		return true;
	}

	solveAll = (grids: string[]): string => {
		return '';
	}

	display = (values: Map<string, string>): void => {
		const lenArray = this.squares.map(s => (values.get(s) || '').length);
		const width: number = 1 + Math.max(...lenArray);
		const line = chalk.cyan(('-'.repeat(width * 3) + '+').repeat(2) + '-'.repeat(width * 3));
		for (let r of this.rows.split('')) {
			let curRow = '';
			for (let c of this.cols.split('')) {
				curRow += (values.get(r + c) || '').padEnd(width, ' ');
				if ('36'.includes(c)) {
					curRow += chalk.cyan('|');
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
