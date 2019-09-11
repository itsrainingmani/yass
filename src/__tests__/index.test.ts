import Yass from '../index';
import assert from 'assert';

let yass: Yass;
describe.skip('Yass Class Tests', () => {
	beforeEach(() => {
		yass = new Yass();
	});

	describe('length checks', () => {
		it('length of squares should be 81', () => {
			assert.strictEqual(yass.squares.length, 81);
		});
		it('length of unitlist should be 27', () => {
			assert.strictEqual(yass.unitlist.length, 27);
		});
		it('length of peers should be 20', () => {
			const peerValue = yass.peers.get('C2');
			if (peerValue === undefined) {
				return false;
			}
			assert.strictEqual(peerValue.size, 20);
		})
	});

	describe('type checks', () => {
		it('unitlist is an array', () => {
			assert.strictEqual(Array.isArray(yass.unitlist), true);
		});
	});

	describe('value checks', () => {
		it('Units of C2', () => {
			assert.deepStrictEqual(yass.units.get('C2'), [
				['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2'],
				['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9'],
				['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'],
			]);
		});

		it('Peers of C2', () => {
			assert.deepStrictEqual(
				yass.peers.get('C2'),
				new Set([
					'A2',
					'B2',
					'D2',
					'E2',
					'F2',
					'G2',
					'H2',
					'I2',
					'C1',
					'C3',
					'C4',
					'C5',
					'C6',
					'C7',
					'C8',
					'C9',
					'A1',
					'A3',
					'B1',
					'B3',
				])
			);
		});
	});

	it('Check grid values', () => {
		const grid = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';
		const parsedGrid = yass.gridValues(grid);
		parsedGrid.forEach((v, k) => console.log(k, v));
	});
});

describe('Sudoku Solving Tests', () => {

	beforeEach(() => {
		yass = new Yass();
	});

	it('Easy Puzzle - 1', () => {
		const grid = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';
		yass.display(yass.parseGrid(grid));
	});

	it('Hard Puzzle - 1', () => {
		const grid = '4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......';
		yass.display(yass.parseGrid(grid));
	});
});
