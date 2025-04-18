import type { PieceColor } from 'chess-core';

export function getNumberCoordinate(
	row: number,
	col: number,
	playerColor: PieceColor | null
): string | null {
	// if (col != 0) return null;

	return `${8 - row}`;
}

export function getLetterCoordinate(
	row: number,
	col: number,
	playerColor: PieceColor | null
): string | null {
	// if (7 - row != 0) return null;

	return String.fromCharCode(97 + col);
}
