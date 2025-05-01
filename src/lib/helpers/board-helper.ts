import type { PieceColor } from 'chess-core';

const targetCols: Record<PieceColor, number> = {
	White: 0,
	Black: 7
};

const targetRows: Record<PieceColor, number> = {
	White: 7,
	Black: 0
};

export const getNumberCoordinate = (
	row: number,
	col: number,
	playerColor: PieceColor
): string | null => {
	return col === targetCols[playerColor] ? String(8 - row) : null;
};

export const getLetterCoordinate = (
	row: number,
	col: number,
	playerColor: PieceColor
): string | null => {
	return row === targetRows[playerColor] ? String.fromCharCode(97 + col) : null;
};
