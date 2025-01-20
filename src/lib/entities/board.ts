import { Piece, PieceColor, PieceType } from './piece';

export class Board {
  public static new(): Piece[][] {
    const pieces: Piece[][] = Array(8)
      .fill(null)
      .map(() => Array(8).fill(new Piece(PieceType.None)));
    pieces[7][3] = new Piece(PieceType.Rook, PieceColor.White);
    pieces[7][2] = new Piece(PieceType.Rook, PieceColor.White);
    return pieces;
  }
}
