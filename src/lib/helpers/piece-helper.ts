import type { Piece } from 'chess-core';

export function getSortedPieces(pieces: Piece[]): Piece[][] {
	return [
		pieces.filter((piece) => piece.type == 'Pawn'),
		pieces.filter((piece) => piece.type == 'Bishop'),
		pieces.filter((piece) => piece.type == 'Knight'),
		pieces.filter((piece) => piece.type == 'Rook'),
		pieces.filter((piece) => piece.type == 'Queen')
	];
}
