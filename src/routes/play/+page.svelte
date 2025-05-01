<script lang="ts">
	import imgBoard from '$lib/images/board.svg';
	import { chunkArray } from '$lib/helpers/array-helper';
	import { Board, Position, type Piece, type PieceColor } from 'chess-core';
	import { getPieceImage } from '$lib/helpers/image-helper';
	import Notification from '$lib/components/notification.svelte';
	import Button from '$lib/components/button.svelte';
	import Promotion from '$lib/components/promotion.svelte';
	import CapturedPieces from '$lib/components/captured-pieces.svelte';
	import { getLetterCoordinate, getNumberCoordinate } from '$lib/helpers/board-helper';
	import { PUBLIC_WS_URL } from '$env/static/public';
	import { GameState } from '$lib/entities/game-state';
	import type { ServerData } from '$lib/entities/server-data';
	import type { NotificationData } from '$lib/entities/notification';
	import type { Server } from '@sveltejs/kit';

	let gameState: GameState = $state(GameState.Waiting);
	let board: Board = $state(new Board());
	let selectedPosition: Position | null = $state(null);

	let playerColor: PieceColor | null = $state(null);

	let isOfferingDraw: boolean = $state(false);
	let isOfferedDraw: boolean = $state(false);
	let isPromotion: boolean = $state(false);

	let rows = $derived(getCoordinateArray());
	let cols = $derived(getCoordinateArray());

	let pieces = $derived(chunkArray(board.pieces, 8));
	let legalMoves = $derived(
		selectedPosition != null ? board.get_legal_moves(selectedPosition) : []
	);

	let capturedPieces: Piece[] = $state([]);
	let capturedPiecesByOpponent: Piece[] = $state([]);

	let notification: NotificationData | null = $state(null);

	let ws: WebSocket;
	let mode = $state('online');

	onInit();

	function onInit() {
		const params = new URLSearchParams(window.location.search);
		let gameMode = params.get('mode');
		mode = gameMode == 'computer' ? 'computer' : 'online';
		console.log(`=== MODE: ${mode} ===`);

		setupWebSocket();
	}

	function getCoordinateArray() {
		const base = [...Array(8).keys()];
		const ordered = playerColor === 'White' ? base : base.reverse();
		return ordered;
	}

	function setupWebSocket() {
		console.log('START WS');

		// Connect to the WebSocket server
		ws = new WebSocket(PUBLIC_WS_URL);

		// Handle open connection
		ws.onopen = (event: Event) => {
			ws.send(
				JSON.stringify({
					action: 'REQUEST_PLAY'
				})
			);
		};

		// Handle incoming messages
		ws.onmessage = (event: MessageEvent) => {
			console.log(event);

			let data: ServerData = JSON.parse(event.data);

			switch (data.action) {
				case 'GAME_STARTED':
					gameState = GameState.Playing;
					playerColor = data.is_white_player ? 'White' : 'Black';
					break;
				case 'BOARD_CHANGED':
					handleBoardChanged(data);
					break;
				case 'PROMOTION':
					isPromotion = true;
					break;
				case 'GAME_OVER':
					gameState = GameState.GameOver;
					switch (data.reason) {
						case 'RESIGNED':
							handleResigned(data);
							break;
						case 'DRAW':
							handleDraw(data);
							break;
						case 'DISCONNECTED':
							handleDisconnected(data);
							break;
						case 'CHECKMATE':
							handleCheckmate(data);
							break;
					}
					break;
				case 'OFFER_DRAW':
					isOfferedDraw = true;
					break;
				case 'DRAW_REJECTED':
					isOfferingDraw = false;
					break;
			}
		};

		// Handle errors
		ws.onerror = (error: Event) => {
			console.error('WebSocket error:', error);
		};

		// Handle connection closure
		ws.onclose = () => {
			console.log('WebSocket connection closed');
		};
	}

	function handleBoardChanged(data: ServerData) {
		let newBoard = Board.parse_fen(data.fen ?? '');
		if (newBoard != null) {
			board = newBoard;
		}

		// Handle captured white pieces (compare with playerColor)
		if (playerColor === 'White') {
			capturedPieces = data.captured_black_pieces.map((piece) => Board.piece_parse_fen(piece));
			capturedPiecesByOpponent = data.captured_white_pieces.map((piece) =>
				Board.piece_parse_fen(piece)
			);
			console.log({ capturedPieces, capturedPiecesByOpponent });
		} else {
			capturedPieces = data.captured_white_pieces.map((piece) => Board.piece_parse_fen(piece));
			capturedPiecesByOpponent = data.captured_black_pieces.map((piece) =>
				Board.piece_parse_fen(piece)
			);
			console.log({ capturedPieces, capturedPiecesByOpponent });
		}
	}

	function handleCheckmate(data: ServerData) {
		if (data.winner === playerColor) {
			notification = {
				text: 'YOU WIN - CHECKMATE!',
				type: 'success'
			};
		} else {
			notification = {
				text: 'YOU LOSE - BY CHECKMATE!',
				type: 'error'
			};
		}
	}

	function handleResigned(data: ServerData) {
		if (data.winner === playerColor) {
			notification = {
				text: 'YOU WIN - OPPONENT RESIGNED!',
				type: 'success'
			};
		} else {
			notification = {
				text: 'YOU LOSE - BY RESIGNATION!',
				type: 'error'
			};
		}
	}

	function handleDraw(data: ServerData) {
		notification = {
			text: 'DRAW',
			type: 'neutral'
		};
	}

	function handleDisconnected(data: ServerData) {
		if (data.winner === playerColor) {
			notification = {
				text: 'YOU WIN - OPPONENT DISCONNECTED!',
				type: 'success'
			};
		} else {
			notification = {
				text: 'YOU LOSE - BY DISCONNECTED!',
				type: 'success'
			};
		}
	}

	function handleClickPiece(piece: Piece, row: number, col: number) {
		let newPosition = new Position(row, col);

		console.log(`Clicked: ${piece.type} (${row}, ${col}) - ${newPosition.to_str()}`);

		let isLegal = isLegalMove(newPosition);

		console.log(`isLegal: ${isLegal}, selected: ${selectedPosition?.to_str()}`);

		if (selectedPosition != null && selectedPosition != undefined && isLegal) {
			// Move Piece
			if (board.turn != playerColor) {
				return;
			}

			const payload = JSON.stringify({
				action: 'MOVE_PIECE',
				move_piece: {
					selected_piece: selectedPosition.to_str(),
					target_position: newPosition.to_str()
				}
			});
			ws.send(payload);
			selectedPosition = null;
			console.log('MOVE: ' + payload);
		} else {
			// Select Piece
			if (piece.type == 'None' || piece.color != playerColor) {
				return;
			}

			if (selectedPosition?.to_str() == newPosition.to_str()) {
				selectedPosition = null;
			} else {
				selectedPosition = newPosition;
			}
		}
	}

	function isLegalMove(position: Position): boolean {
		let result = false;

		let pos = position.to_str();
		for (const move of legalMoves) {
			if (move.to_str() == pos) {
				return true;
			}
		}

		return result;
	}

	function isSelectedPosition(position: Position): boolean {
		return position.to_str() == selectedPosition?.to_str();
	}

	function onSelectPromotion(piece: Piece) {
		console.log(`Promotion Piece: ${piece.type}`);

		ws.send(
			JSON.stringify({
				action: 'PROMOTE_PIECE',
				promotion_piece: Board.get_fen_from_piece(piece)
			})
		);

		isPromotion = false;
	}
</script>

<svelte:head>
	<title>Play | Chess Game</title>
</svelte:head>

<div class="container">
	{#if notification != null}
		<Notification {...notification} />
	{/if}

	{#if gameState === GameState.Waiting}
		<div class="waiting-container">
			<h3>Play {mode}</h3>

			<p>Waiting for opponent,<br />please wait..</p>

			<Button text="Abort" onclick={() => (window.location.href = '/')} />
		</div>
	{:else if [GameState.Playing, GameState.GameOver].includes(gameState)}
		<div class="board-layout">
			<h1>{playerColor} (Turn: {board.turn})</h1>
			<h3 class="captured-piece-container">
				Opponent: <CapturedPieces pieces={capturedPiecesByOpponent} />
			</h3>
			<div class="board-container">
				<img src={imgBoard} alt="Chess" class="board" />

				<div class="board">
					{#each rows as row}
						{#each cols as col}
							{@const num = getNumberCoordinate(row, col, playerColor)}
							{@const letter = getLetterCoordinate(row, col, playerColor)}
							{@const piece = pieces[row][col]}
							{@const position = new Position(row, col)}

							<div class="piece" class:piece-selected={isSelectedPosition(position)}>
								{#if num != null}
									<p
										class="coordinate-text coordinate-number"
										class:text-dark={row % 2 == 0 ? col % 2 == 0 : col % 2 != 0}
									>
										{letter + num}
										<!-- {`${row},${col}`} -->
									</p>
								{/if}
								<!-- {#if letter != null}
									<p class="coordinate-text coordinate-letter" class:text-dark={col % 2 != 0}>
										{letter}
									</p>
								{/if} -->

								<button class="piece-button" onclick={() => handleClickPiece(piece, row, col)}>
									{#if piece.type != 'None'}
										<img src={getPieceImage(piece)} alt="Piece" class="piece-img" />
									{/if}

									{#if isLegalMove(position)}
										<span class="dot"></span>
									{/if}
								</button>
							</div>
						{/each}
					{/each}
				</div>
			</div>
			<h3 class="captured-piece-container">You: <CapturedPieces pieces={capturedPieces} /></h3>
		</div>

		<div class="action-container">
			{#if gameState == GameState.Playing}
				{#if isOfferedDraw}
					<h4>Accept Draw?</h4>

					<div class="action-buttons">
						<Button
							text="Yes"
							color="primary"
							onclick={() => {
								ws.send(
									JSON.stringify({
										action: 'ACCEPT_DRAW'
									})
								);
							}}
						/>
						<Button
							text="No"
							color="neutral"
							onclick={() => {
								isOfferedDraw = false;
								ws.send(
									JSON.stringify({
										action: 'REJECT_DRAW'
									})
								);
							}}
						/>
					</div>
				{:else if isPromotion}
					<h4>Choose Piece:</h4>

					<Promotion color={playerColor ?? 'White'} onSelectPiece={onSelectPromotion} />
				{:else}
					<div class="action-buttons">
						<Button
							text="RESIGN"
							color="primary"
							onclick={() => {
								ws.send(
									JSON.stringify({
										action: 'RESIGN'
									})
								);
							}}
						/>

						<Button
							text="DRAW"
							color="neutral"
							isDisabled={isOfferingDraw}
							onclick={() => {
								isOfferingDraw = true;
								ws.send(
									JSON.stringify({
										action: 'OFFER_DRAW'
									})
								);
							}}
						/>
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	.board-container {
		position: relative;
		height: 54vh;
		width: 54vh;
	}
	.board {
		position: absolute;
		height: 100%;
		width: 100%;
		font-size: 0;
	}

	.piece {
		width: 12.5%;
		height: 12.5%;
		display: inline-block;
		box-sizing: border-box;
		position: relative;
		color: var(--color-board-light);
	}

	.text-dark {
		color: var(--color-board-dark);
	}

	.piece-img {
		width: 100%;
		height: 100%;
		cursor: pointer;
		-webkit-user-drag: none;
		-khtml-user-drag: none;
		-moz-user-drag: none;
		-o-user-drag: none;
	}

	.piece-selected {
		background-color: rgba(255, 255, 0, 0.35);
	}

	.piece-button {
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
		width: 100%;
		height: 100%;
		position: absolute;
	}

	.dot {
		height: 20px;
		width: 20px;
		background-color: rgba(0, 0, 0, 0.25);
		border-radius: 50%;
		display: inline-block;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		cursor: pointer;
	}

	.coordinate-text {
		display: inline-block;
		position: absolute;
		font-weight: bold;
		font-size: 8pt;
		margin: 0;
	}

	.coordinate-number {
		top: 2px;
		left: 2px;
	}

	.coordinate-letter {
		bottom: 2px;
		right: 2px;
	}

	.waiting-container {
		text-align: center;
	}

	.waiting-container h3 {
		font-size: 32px;
		margin: 0;
		text-transform: capitalize;
	}

	.waiting-container p {
		font-size: 24px;
		font-weight: 100;
	}

	.action-container {
		position: absolute;
		bottom: 24px;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.action-container h4 {
		margin: 0;
	}

	.action-buttons {
		display: flex;
		gap: 12px;
	}

	.captured-piece-container {
		height: 24px;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.board-layout h3 {
			padding: 0px 16px;
		}

		.board-container {
			width: 100vw;
			height: 100vw;
		}

		.board {
			width: 100vw;
			height: 100vw;
		}
	}
</style>
