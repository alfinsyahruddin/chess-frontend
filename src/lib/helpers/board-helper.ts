import type { PieceColor } from 'chess-core';

export function getNumberCoordinate(
	row: number,
	col: number,
	playerColor: PieceColor | null
): string | null {
	// if (col != 0) return null;

	const number = playerColor == 'White' ? 8 - row : row + 1;
	return `${number}`;
}

export function getLetterCoordinate(
	row: number,
	col: number,
	playerColor: PieceColor | null
): string | null {
	// if (7 - row != 0) return null;

	const coll = playerColor == 'White' ? col : 7 - col;
	return String.fromCharCode(97 + coll);
}
