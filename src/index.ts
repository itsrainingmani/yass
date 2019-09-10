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
			this.peers.set(s, new Set(curUnits.reduce(arrReducer).filter(v => v !== s)));
		}
	}

	gridValues = (grid: string) => {
		const chars: [string, string][] = [];
		grid.split('').forEach((v, i) => {
			if (this.digits.includes(v) || '0.'.includes(v)) {
				chars.push([this.squares[i], v]);
			}
		});
		return new Map(chars);
	};

	// export const parseGrid = (grid: string) => {
	// 	// Convert grids to a Map of possible values
	// 	const values: Map<string, string> = new Map();
	// 	squares.map(s => {values.set(s, digits)});
	// 	gridValues(grid).forEach((v, k) => {
	// 		if (digits.includes(v) && !assign(values, v, k)){
	// 			return false;
	// 		}
	// 	});
	// 	return values;
	// }
}
