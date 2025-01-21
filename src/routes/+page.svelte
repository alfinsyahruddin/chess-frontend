<script lang="ts">
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
		<p>Open Source Chess Game<br />built with Rust & Svelte.</p>
		<div class="container-buttons">
			<a href="/play" class="btn play-online">Play Online</a>
			<a href="/play" class="btn play-computer">Play Computer</a>
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

	.btn {
		padding: 12px 28px;
		border: none;
		border-radius: 10px;
		cursor: pointer;
		font-size: 16px;
		font-weight: 700;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
		color: white;
		text-align: center;
		text-decoration: none;
	}

	.play-online {
		background-color: #8e5e3c;
	}

	.play-computer {
		background-color: #47a168;
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
