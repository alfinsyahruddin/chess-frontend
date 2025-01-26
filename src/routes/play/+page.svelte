<script lang="ts">
	import imgBoard from '$lib/images/board.svg';
	import { chunkArray } from '$lib/helpers/array-helper';
	import { Board, Position, type Piece } from 'chess-core';
	import { getPieceImage } from '$lib/helpers/image-helper';
	import Notification from '$lib/components/notification.svelte';
	import Button from '$lib/components/button.svelte';

	let board: Board = $state(new Board());
	let selectedPosition: Position | null = $state(null);

	let pieces = $derived(chunkArray(board.pieces, 8));
	let legalMoves = $derived(
		selectedPosition != null ? board.get_legal_moves(selectedPosition) : []
	);

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
</script>

<svelte:head>
	<title>Play | Chess Game</title>
</svelte:head>

<div class="container">
	<Notification text="YOU WIN - OPPONENT RESIGNED!" type="success" />

	<!-- <div class="waiting-container">
		<h3>Play Online</h3>

		<p>Waiting for opponent,<br />please wait..</p>

		<Button text="Abort" />
	</div> -->

	<div>
		<h3>Opponent:</h3>
		<div class="board-container">
			<img src={imgBoard} alt="Chess" class="board" />

			<div class="board">
				{#each pieces as pieces_row, row}
					{#each pieces_row as piece, col}
						<div class="piece" class:piece-selected={isSelectedPosition(new Position(row, col))}>
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
		<h3>You:</h3>
	</div>

	<div class="action-container">
		<h4>Accept Draw?</h4>

		<div class="action-buttons">
			<Button text="Yes" color="primary" />
			<Button text="No" color="neutral" />
		</div>
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
		background: red;
		position: relative;
		height: 60vh;
		width: 60vh;
	}
	.board {
		position: absolute;
		height: 60vh;
		width: 60vh;
		font-size: 0;
	}

	.piece {
		width: 12.5%;
		height: 12.5%;
		display: inline-block;
		box-sizing: border-box;
		position: relative;
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
