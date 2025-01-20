<script lang="ts">
	import { Board } from '$lib/entities/board';
	import { PieceType, type Piece } from '$lib/entities/piece';
	import imgBoard from '$lib/images/board.svg';
	import wq from '$lib/images/pieces/wq.png';
	import { onMount } from 'svelte';

	let pieces: Piece[][] = $state(Board.new());
	let selected: Piece | null = $state(null);

	onMount(() => {
		console.log({ pieces });
	});
</script>

<svelte:head>
	<title>Play | Chess Game</title>
</svelte:head>

<div class="page-container">
	<div class="board-container">
		<img src={imgBoard} alt="Chess" class="board" />

		<div class="board">
			{#each pieces as row}
				{#each row as piece}
					<div
						class="piece"
						class:piece-selected={JSON.stringify(selected) == JSON.stringify(piece)}
					>
						<button
							class="button"
							onclick={() => {
								console.log({ selected: JSON.stringify(selected), piece: JSON.stringify(piece) });
								selected = piece;
							}}
						>
							{#if piece.type != PieceType.None}
								<img src={wq} alt="Piece" class="piece-img" />
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
