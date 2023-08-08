<script lang="ts">
	import { keyStore, usernameStore } from '../stores';
	import { PUBLIC_API_BASE_URL } from '$env/static/public';

	let loading: boolean = true;
	let logged: boolean = false;
	let username: string = "";
	let password: string = "";
	let passwordInput: HTMLInputElement;

	keyStore.subscribe((value) => {
		logged = value !== null;
		loading = false;
	});

	let loginPromise: Promise<any> | null = null;
	async function handleSubmit() {
		if (!username || !password)
			return;
		loginPromise = fetch(`${PUBLIC_API_BASE_URL}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ username, password }),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.statusCode === 200) {
					keyStore.set(res.key);
					usernameStore.set(username);
					logged = true;
					username = "";
					password = "";
					loginPromise = null;
				}
			});
	}
</script>

<main>
	{#if logged}
		<slot />
	{:else if loading}
		<p>Loading...</p>
	{:else}
		<div class="flex flex-col justify-center align-center">
			<h3>Hey! Please enter your username and password.</h3>
			<div class="form-group flex flex-col">
				<input type="username" placeholder="Your username" bind:value={username} on:keydown={(e) => e.key === "Enter" && passwordInput.focus()} />
				<input type="password" placeholder="Your password" bind:value={password} bind:this={passwordInput} on:keydown={(e) => e.key === "Enter" && handleSubmit()}>
				<button class="margin-top" on:click={handleSubmit}>Login</button>
			</div>
			{#if loginPromise}
				{#await loginPromise}
					<p>Logging...</p>
				{:then res}
					<p class="text-danger">Invalid username or password.</p>
				{:catch}
					<p class="text-danger">An unknown error occured.</p>
				{/await}
			{/if}
		</div>
	{/if}
</main>