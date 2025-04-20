import type { PieceColor } from 'chess-core';

export type ServerAction =
	| 'GAME_STARTED'
	| 'BOARD_CHANGED'
	| 'PROMOTION'
	| 'GAME_OVER'
	| 'OFFER_DRAW'
	| 'DRAW_REJECTED';
export type GameOverReason = 'DISCONNECTED' | 'RESIGNED' | 'DRAW';
export interface ServerData {
	action: ServerAction;
	is_white_player?: boolean;
	winner?: PieceColor;
	reason?: GameOverReason;
	fen?: string;
}
