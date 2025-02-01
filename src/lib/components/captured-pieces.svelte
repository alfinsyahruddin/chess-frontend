<script lang="ts">
	import { getPieceImage } from '$lib/helpers/image-helper';
	import { getSortedPieces } from '$lib/helpers/piece-helper';
	import type { Piece } from 'chess-core';

	let { pieces }: { pieces: Piece[] } = $props();

	let sortedPieces: Piece[][] = getSortedPieces(pieces);
</script>

<div class="container">
	{#each sortedPieces as pieceGroup}
		<div class="piece-group">
			{#each pieceGroup as piece}
				<img src={getPieceImage(piece)} alt="Piece" class="piece-img" />
			{/each}
		</div>
	{/each}
</div>

<style>
	.container {
		display: inline-block;
		transform: translateY(3px);
	}

	.piece-group {
		display: inline-block;
	}

	.piece-img {
		width: 24px;
		height: 24px;
	}

	.piece-group .piece-img:not(:first-child) {
		margin-left: -16px;
	}
</style>
