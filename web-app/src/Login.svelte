<script lang="ts">
	import { keyStore } from './stores';

	let logged: boolean = false;
	let key: string = "";

	keyStore.subscribe((value) => {
		console.log("keyStore changed: " + value);
		logged = value !== null;
	});

	let loginPromise: Promise<any> | null = null;
	async function handleSubmit() {
		if (!key)
			return;
		loginPromise = fetch("/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ key }),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.statusCode === 200) {
					keyStore.set(key);
					logged = true;
					key = "";
					loginPromise = null;
				}
			})
	}
</script>

<main>
	{#if logged}
		<slot />
	{:else}
		<div class="flex flex-col justify-center align-center" style="min-height: 100vh;">
			<h3>Hey! Please enter your key.</h3>
			<div class="form-group flex">
				<input type="password" placeholder="Your Key" bind:value={key} on:keypress={(e) => e.key === "Enter" && handleSubmit()}>
				<button class="margin-left" on:click={handleSubmit}>Login</button>
			</div>
			{#if loginPromise}
				{#await loginPromise}
					<p>Logging...</p>
				{:then res}
					<p class="text-danger">Unknown key!</p>
				{:catch}
					<p class="text-danger">An unknown error occured.</p>
				{/await}
			{/if}
		</div>
	{/if}
</main>