export type ClientAction = 'REQUEST_PLAY' | 'RESIGN' | 'OFFER_DRAW' | 'REJECT_DRAW' | 'ACCEPT_DRAW';
export interface ClientData {
	action: ClientAction;
}
