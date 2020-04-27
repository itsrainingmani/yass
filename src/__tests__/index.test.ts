import { Solver } from '../index';
import assert from 'assert';

let yass: Solver;
describe('Yass Class Tests', () => {
	beforeEach(() => {
		yass = new Solver();
	});

	describe('length checks', () => {
		it('length of squares should be 81', () => {
			assert.strictEqual(yass['squares'].length, 81);
		});
		it('length of unitlist should be 27', () => {
			assert.strictEqual(yass['unitlist'].length, 27);
		});
		it('length of peers should be 20', () => {
			const peerValue = yass['peers'].get('C2');
			if (peerValue === undefined) {
				return false;
			}
			assert.strictEqual(peerValue.size, 20);
		});
	});

	describe('type checks', () => {
		it('unitlist is an array', () => {
			assert.strictEqual(Array.isArray(yass['unitlist']), true);
		});
	});

	describe('value checks', () => {
		it('Units of C2', () => {
			assert.deepStrictEqual(yass['units'].get('C2'), [
				['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2'],
				['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9'],
				['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'],
			]);
		});

		it('Peers of C2', () => {
			assert.deepStrictEqual(
				yass['peers'].get('C2'),
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

	it('Grid is smaller than 81 characters', () => {
		const grid = '0030206009003050010018064000081029007000000080067082000026095008002030090050103';
		const parsedGrid = yass.gridValues(grid);
		assert.strictEqual(parsedGrid.size, 81);
	});

	it('Grid is larger than 81 characters', () => {
		const grid = '0030206009003050010018064000081029007000000080067082000026095008002030090050103asdfdsa3242';
		const parsedGrid = yass.gridValues(grid);
		assert.strictEqual(parsedGrid.size, 81);
	});

	it('Grid is a multiline string', () => {
		const singleLineGrid = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';
		const multiLineGrid =
			'003020600\n900305001\n001806400\n008102900\n700000008\n006708200\n002609500\n800203009\n005010300';
		const parsedGrid1 = yass.gridValues(singleLineGrid);
		const parseGrid2 = yass.gridValues(multiLineGrid);
		assert.deepEqual(parsedGrid1, parseGrid2);
	});
});

describe('Sudoku Solving Tests', () => {
	beforeEach(() => {
		yass = new Solver();
	});

	it('Easy Puzzle - 1', () => {
		const grid = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';
		yass.display(yass.gridValues(grid));
		yass.display(yass['parseGrid'](grid));
	});

	it('Hard Puzzle - 1', () => {
		const grid = '4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......';
		yass.display(yass.gridValues(grid));
		yass.display(yass['parseGrid'](grid));
	});

	it('Hard Puzzle - 1 - Search', () => {
		const grid = '4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......';
		yass.display(yass.gridValues(grid));
		yass.display(yass.solve(grid));
	});

	it('Inkala 1 - Search', () => {
		const grid = '85...24..72......9..4.........1.7..23.5...9...4...........8..7..17..........36.4.';
		yass.display(yass.gridValues(grid));
		yass.display(yass.solve(grid));
	});

	it('Inkala 2 - Search', () => {
		const grid = '..53.....8......2..7..1.5..4....53...1..7...6..32...8..6.5....9..4....3......97..';
		yass.display(yass.gridValues(grid));
		yass.display(yass.solve(grid));
	});
});

describe('DFS Test', () => {
	beforeEach(() => {
		yass = new Solver();
	});

	it('Iterate through the Global State Graph', () => {
		const grid = '..53.....8......2..7..1.5..4....53...1..7...6..32...8..6.5....9..4....3......97..';
		yass.display(yass.gridValues(grid));
		yass.display(yass.solve(grid));

		const globalStateGraph = yass.transitions;
		for (const g of globalStateGraph.values()) {
			yass.display(g);
		}
	});
});
