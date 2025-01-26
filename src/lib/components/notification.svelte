<script lang="ts">
	let { text, type = 'neutral' }: { text: string; type?: 'error' | 'success' | 'neutral' } =
		$props();
</script>

<div class="notification {type}">{text}</div>

<style>
	.notification {
		position: absolute;
		top: 0;
		padding: 16px;
		width: 100vw;
		text-align: center;
		font-weight: 700;
		color: var(--color-text);
	}

	.error {
		background: var(--color-error);
	}

	.success {
		background: var(--color-success);
	}

	.neutral {
		background: var(--color-neutral);
	}
</style>
