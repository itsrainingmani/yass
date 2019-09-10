/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const yass = require('../lib/index');
const assert = require('assert');

describe('Sudoku', () => {
	describe('length checks', () => {
		it('length of squares should be 81', () => {
			assert.strictEqual(yass.squares.length, 81);
		});
		it('length of unitlist should be 27', () => {
			assert.strictEqual(yass.unitlist.length, 27);
		});
	});

	describe('type checks', () => {
		it('unitlist is an array', () => {
			assert.strictEqual(Array.isArray(yass.unitlist), true);
		});
	});

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
				'C2',
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

	it('Check grid values', () => {
		const grid = '4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......';
		process.stdout.write(yass.gridValues(grid));
	});
});
