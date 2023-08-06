<script lang="ts">
	
	import { keyStore } from './stores';
	
	let key: string = "";

	keyStore.subscribe((value: string) => {
		key = value;
	});

</script>

<div class="page-container container">
	<h2>Account settings</h2>
	<div class="flex flex-col">
		<span>Your key, used to upload files with ShareX:</span>
		<div class="form-group flex margin-top">
			<input type="text" placeholder="Enter a new key" id="key-input" bind:value={key} style="width: 24rem; max-width: 100%;" />
			<button class="margin-left" on:click={() => navigator.clipboard.writeText(key)}>
				Copy
			</button>
		</div>
	</div>
</div>