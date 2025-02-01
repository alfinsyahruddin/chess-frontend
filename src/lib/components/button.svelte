<script lang="ts">
	let {
		text,
		color = 'primary',
		isDisabled = false,
		onclick = () => {}
	}: {
		text: string;
		color?: 'primary' | 'secondary' | 'neutral';
		isDisabled?: boolean;
		onclick?: () => void;
	} = $props();
</script>

<button
	class="btn {color}"
	class:disabled={isDisabled}
	onclick={() => {
		if (isDisabled) {
			return;
		}

		onclick();
	}}>{text}</button
>

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

	.disabled {
		pointer-events: none;
		opacity: 0.5;
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
