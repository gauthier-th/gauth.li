<script lang="ts">
	
	import { keyStore } from './stores';
	
	let key: string = "";
	let newKey: string = "";

	keyStore.subscribe((value: string) => {
		key = value;
		newKey = value;
	});

	async function updateKey() {
		if (!key)
			return;
		const res = await fetch(`/key`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ key, newKey }),
		})
			.then((res) => res.json())
		if (res.statusCode === 200)
			keyStore.set(newKey);
	}

</script>

<div class="page-container container">
	<h2>Server settings</h2>
	<div class="flex">
		<div class="form-group">
			<label for="key-input">Your key</label>
			<input type="text" placeholder="Enter a new key" id="key-input" bind:value={newKey}>
		</div>
		<button class="margin-left" on:click={updateKey}>Update</button>
	</div>
</div>