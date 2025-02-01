<script lang="ts">
	import imgBoard from '$lib/images/board.svg';
	import { chunkArray } from '$lib/helpers/array-helper';
	import { Board, Position, type Piece } from 'chess-core';
	import { getPieceImage } from '$lib/helpers/image-helper';
	import Notification from '$lib/components/notification.svelte';
	import Button from '$lib/components/button.svelte';
	import Promotion from '$lib/components/promotion.svelte';
	import CapturedPieces from '$lib/components/captured-pieces.svelte';
	import { getLetterCoordinate, getNumberCoordinate } from '$lib/helpers/board-helper';
	import { PUBLIC_WS_BASE_URL } from '$env/static/public';
	import { onMount } from 'svelte';

	let board: Board = $state(new Board());
	let selectedPosition: Position | null = $state(null);

	let pieces = $derived(chunkArray(board.pieces, 8));
	let legalMoves = $derived(
		selectedPosition != null ? board.get_legal_moves(selectedPosition) : []
	);

	let capturedPieces: Piece[] = [
		{ type: 'Pawn', color: 'Black' },
		{ type: 'Pawn', color: 'Black' },
		{ type: 'Knight', color: 'Black' },
		{ type: 'Pawn', color: 'Black' },
		{ type: 'Knight', color: 'Black' },
		{ type: 'Rook', color: 'Black' },
		{ type: 'Queen', color: 'Black' },
		{ type: 'Bishop', color: 'Black' }
	];

	let capturedPiecesOpponent: Piece[] = [
		{ type: 'Pawn', color: 'White' },
		{ type: 'Pawn', color: 'White' },
		{ type: 'Knight', color: 'White' },
		{ type: 'Pawn', color: 'White' },
		{ type: 'Knight', color: 'White' },
		{ type: 'Rook', color: 'White' },
		{ type: 'Queen', color: 'White' },
		{ type: 'Bishop', color: 'White' }
	];

	let ws: WebSocket;

	// onMount(() => {
	setupWebSocket();
	// });

	function setupWebSocket() {
		console.log('START WS');

		// Connect to the WebSocket server
		ws = new WebSocket(PUBLIC_WS_BASE_URL);

		// Handle incoming messages
		ws.onmessage = (event: MessageEvent) => {
			console.log(event);
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

	function handleClickPiece(piece: Piece, row: number, col: number) {
		if (piece.type == 'None') {
			return;
		}

		selectedPosition = new Position(row, col);
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

	function onSelectPiece(piece: Piece) {
		console.log(`Selected: ${piece.type}`);
	}
</script>

<svelte:head>
	<title>Play | Chess Game</title>
</svelte:head>

<div class="container">
	<!-- <Notification text="YOU WIN - OPPONENT RESIGNED!" type="success" /> -->

	<!-- <div class="waiting-container">
		<h3>Play Online</h3>

		<p>Waiting for opponent,<br />please wait..</p>

		<Button text="Abort" />
	</div> -->

	<div class="board-layout">
		<h3>Opponent: <CapturedPieces pieces={capturedPiecesOpponent} /></h3>
		<div class="board-container">
			<img src={imgBoard} alt="Chess" class="board" />

			<div class="board">
				{#each pieces as pieces_row, row}
					{#each pieces_row as piece, col}
						{@const num = getNumberCoordinate(row, col)}
						{@const letter = getLetterCoordinate(row, col)}

						<div class="piece" class:piece-selected={isSelectedPosition(new Position(row, col))}>
							{#if num != null}
								<p class="coordinate-text coordinate-number" class:text-dark={row % 2 == 0}>
									{num}
								</p>
							{/if}
							{#if letter != null}
								<p class="coordinate-text coordinate-letter" class:text-dark={col % 2 != 0}>
									{letter}
								</p>
							{/if}

							<button class="piece-button" onclick={() => handleClickPiece(piece, row, col)}>
								{#if piece.type != 'None'}
									<img src={getPieceImage(piece)} alt="Piece" class="piece-img" />
								{/if}
							</button>

							{#if isLegalMove(new Position(row, col))}
								<span class="dot"></span>
							{/if}
						</div>
					{/each}
				{/each}
			</div>
		</div>
		<h3>You: <CapturedPieces pieces={capturedPieces} /></h3>
	</div>

	<div class="action-container">
		<!-- <h4>Accept Draw?</h4> -->

		<!-- <div class="action-buttons">
			<Button text="Yes" color="primary" />
			<Button text="No" color="neutral" />
		</div> -->

		<!-- <h4>Choose Piece:</h4> -->

		<!-- <Promotion color="White" {onSelectPiece} /> -->

		<Button
			text="PLAY"
			color="primary"
			onclick={() => {
				ws.send(
					JSON.stringify({
						action: 'REQUEST_PLAY'
					})
				);
			}}
		/>
	</div>
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
