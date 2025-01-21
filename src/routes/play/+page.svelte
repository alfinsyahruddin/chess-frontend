<script lang="ts">
	import imgBoard from '$lib/images/board.svg';
	import { chunkArray } from '$lib/helpers/array-helper';
	import { Board, Position, type Piece } from 'chess-core';
	import { getPieceImage } from '$lib/helpers/image-helper';

	let board: Board = $state(new Board());
	let pieces = $derived(chunkArray(board.pieces, 8));
	let selectedPosition: Position | null = $state(null);

	function handleClickPiece(piece: Piece, row: number, col: number) {
		if (piece.type == 'None') {
			return;
		}

		selectedPosition = new Position(row, col);

		console.log({
			position: new Position(row, col).to_json(),
			legal_moves: board.get_legal_moves(new Position(row, col))
		});
	}
</script>

<svelte:head>
	<title>Play | Chess Game</title>
</svelte:head>

<div class="page-container">
	<div class="board-container">
		<img src={imgBoard} alt="Chess" class="board" />

		<div class="board">
			{#each pieces as pieces_row, row}
				{#each pieces_row as piece, col}
					{@const position = new Position(row, col)}
					<div
						class="piece"
						class:piece-selected={selectedPosition?.to_json() == position.to_json()}
					>
						<button class="button" onclick={() => handleClickPiece(piece, row, col)}>
							{#if piece.type != 'None'}
								<img src={getPieceImage(piece)} alt="Piece" class="piece-img" />
							{/if}
						</button>
					</div>
				{/each}
			{/each}
		</div>
	</div>
</div>

<style>
	.board-container {
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
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

	button {
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
		width: 100%;
		height: 100%;
	}
</style>
