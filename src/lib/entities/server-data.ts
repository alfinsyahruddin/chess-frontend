import type { PieceColor } from 'chess-core';

export type ServerAction =
	| 'GAME_STARTED'
	| 'BOARD_CHANGED'
	| 'PROMOTION'
	| 'GAME_OVER'
	| 'OFFER_DRAW'
	| 'DRAW_REJECTED';
export type GameOverReason =
	| 'DISCONNECTED'
	| 'RESIGNED'
	| 'DRAW'
	| 'DRAW_FIFTY_MOVES'
	| 'DRAW_INSUFFICIENT_MATERIAL'
	| 'CHECKMATE';
export interface ServerData {
	action: ServerAction;
	is_white_player?: boolean;
	winner?: PieceColor;
	reason?: GameOverReason;
	fen?: string;
	captured_white_pieces: string[];
	captured_black_pieces: string[];
}
