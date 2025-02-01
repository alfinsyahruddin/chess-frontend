<script lang="ts">
	import { getPieceImage } from '$lib/helpers/image-helper';
	import type { Piece, PieceColor } from 'chess-core';

	let { color, onSelectPiece }: { color: PieceColor; onSelectPiece: (piece: Piece) => void } =
		$props();

	let pieces: Piece[] = [
		{ type: 'Knight', color: color },
		{ type: 'Rook', color: color },
		{ type: 'Queen', color: color },
		{ type: 'Bishop', color: color }
	];
</script>

<div class="card">
	{#each pieces as piece}
		<button class="piece-button" onclick={() => onSelectPiece(piece)}>
			<img src={getPieceImage(piece)} alt="Piece" class="piece-img" />
		</button>
	{/each}
</div>

<style>
	.card {
		display: inline-block;
		padding: 8px 16px;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 16px;
	}

	.piece-img {
		width: 50px;
		height: 50px;
	}

	.piece-button {
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
		display: inline-block;
	}
</style>
