import type { Piece } from "chess-core";
import bk from "$lib/images/pieces/bk.png";
import wk from "$lib/images/pieces/wk.png";
import bq from "$lib/images/pieces/bq.png";
import wq from "$lib/images/pieces/wq.png";
import bb from "$lib/images/pieces/bb.png";
import wb from "$lib/images/pieces/wb.png";
import bn from "$lib/images/pieces/bn.png";
import wn from "$lib/images/pieces/wn.png";
import br from "$lib/images/pieces/br.png";
import wr from "$lib/images/pieces/wr.png";
import bp from "$lib/images/pieces/bp.png";
import wp from "$lib/images/pieces/wp.png";

export function getPieceImage(piece: Piece): string | null {
  switch (piece.type) {
    case "King":
      return piece.color === "Black" ? bk : wk;
    case "Queen":
      return piece.color === "Black" ? bq : wq;
    case "Bishop":
      return piece.color === "Black" ? bb : wb;
    case "Knight":
      return piece.color === "Black" ? bn : wn;
    case "Rook":
      return piece.color === "Black" ? br : wr;
    case "Pawn":
      return piece.color === "Black" ? bp : wp;
    default:
      return null;
  }
}
