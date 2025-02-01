<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import chess from '$lib/images/chess.webp';
</script>

<svelte:head>
	<title>Home | Chess Game</title>
	<meta name="description" content="Chess Game" />
</svelte:head>

<div class="container">
	<div class="image">
		<img src={chess} alt="Chess" class="img-chess" />
	</div>
	<div class="content">
		<h1>Chess</h1>
		<p>Open Source Chess Game<br />integrated with Stockfish AI</p>
		<div class="container-buttons">
			<Button text="Play Online" color="primary" onclick={() => (window.location.href = '/play')} />
			<Button
				text="Play Computer"
				color="secondary"
				onclick={() => (window.location.href = '/play')}
			/>
		</div>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		max-width: 1200px;
		gap: 48px;
		height: 100vh;
		margin: 0 auto;
	}

	.content {
		max-width: 400px;
		margin-right: 40px;
		text-align: left;
	}

	h1 {
		font-size: 42px;
		margin: 0;
	}

	p {
		font-size: 24px;
		font-weight: 100;
		margin-top: 12px;
		margin-bottom: 24px;
	}

	.container-buttons {
		display: flex;
		flex-direction: column;
		max-width: 200px;
		gap: 12px;
	}

	.image img {
		width: 475px;
		height: auto;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.container {
			flex-direction: column-reverse;
		}

		.image img {
			width: 100%;
		}
	}
</style>
