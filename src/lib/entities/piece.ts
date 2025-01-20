export class Piece {
	type: PieceType;
	color: PieceColor | undefined;

	constructor(type: PieceType, color: PieceColor | undefined = undefined) {
		this.type = type;
		this.color = color;
	}

	static parseFen(notation: string): Piece {
		const color = notation === notation.toUpperCase() ? PieceColor.White : PieceColor.Black;
		switch (notation.toUpperCase()) {
			case 'K':
				return new Piece(PieceType.King, color);
			case 'Q':
				return new Piece(PieceType.Queen, color);
			case 'B':
				return new Piece(PieceType.Bishop, color);
			case 'N':
				return new Piece(PieceType.Knight, color);
			case 'R':
				return new Piece(PieceType.Rook, color);
			case 'P':
				return new Piece(PieceType.Pawn, color);
			default:
				return new Piece(PieceType.None);
		}
	}

	toFen(): string {
		switch (this.type) {
			case PieceType.King:
				return this.color === PieceColor.White ? 'K' : 'k';
			case PieceType.Queen:
				return this.color === PieceColor.White ? 'Q' : 'q';
			case PieceType.Bishop:
				return this.color === PieceColor.White ? 'B' : 'b';
			case PieceType.Knight:
				return this.color === PieceColor.White ? 'N' : 'n';
			case PieceType.Rook:
				return this.color === PieceColor.White ? 'R' : 'r';
			case PieceType.Pawn:
				return this.color === PieceColor.White ? 'P' : 'p';
			default:
				return '.';
		}
	}

	static checkIsOpponent(selectedPiece: Piece, targetPiece: Piece): boolean {
		if (selectedPiece.type && targetPiece.type) {
			return selectedPiece.color !== targetPiece.color;
		}
		return false;
	}
}

export enum PieceType {
	Pawn,
	Rook,
	Knight,
	Bishop,
	Queen,
	King,
	None
}

export enum PieceColor {
	Black,
	White
}
