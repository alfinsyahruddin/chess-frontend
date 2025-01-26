<script lang="ts">
	let {
		text,
		color = 'primary',
		onclick = () => {}
	}: { text: string; color?: 'primary' | 'secondary' | 'neutral'; onclick?: () => void } = $props();
</script>

<button class="btn {color}" {onclick}>{text}</button>

<style>
	.btn {
		padding: 12px 28px;
		border: none;
		border-radius: 10px;
		cursor: pointer;
		font-size: 16px;
		font-weight: 700;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
		color: var(--color-text);
		text-align: center;
		text-decoration: none;
	}

	.primary {
		background-color: var(--color-primary);
	}

	.secondary {
		background-color: var(--color-secondary);
	}

	.neutral {
		background-color: var(--color-neutral);
	}
</style>
