<script lang="ts">

	import { PUBLIC_API_BASE_URL } from '$env/static/public';
	import { keyStore, usernameStore } from '../../stores';

	let key: string | null = "";
	let username: string | null = "";
	let currentPassword: string = "";
	let newPassword: string = "";
	let confirmNewPassword: string = "";

	keyStore.subscribe((value: string | null) => {
		key = value;
	});
	usernameStore.subscribe((value: string | null) => {
		username = value;
	});

	async function changePassword() {
		if (!username || !currentPassword || !newPassword || !confirmNewPassword)
			return;
		if (newPassword !== confirmNewPassword) {
			alert("The new password and the confirmation don't match.");
			return;
		}
		const result = await fetch(`${PUBLIC_API_BASE_URL}/password`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				username,
				currentPassword,
				newPassword,
			}),
		}).then((res) => res.json());
		if (result.statusCode === 200) {
			alert("Password changed successfully!");
			currentPassword = "";
			newPassword = "";
			confirmNewPassword = "";
		} else {
			alert(result.message);
		}
	}

	async function renewKey() {
		if (!key)
			return;
		const result = await fetch(`${PUBLIC_API_BASE_URL}/renew-key`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({ key }),
		}).then((res) => res.json());
		if (result.statusCode === 200) {
			keyStore.set(result.key);
			key = result.key;
			alert("Key renewed successfully!");
		} else {
			alert(result.message);
		}
	}

</script>

<div class="page-container container">
	<h2 class="margin-bottom-none">Account settings</h2>
	<h3 class="margin-top-none text-center">{username}</h3>
	<div class="flex flex-col">
		<h4 class="margin-none">Change your password:</h4>
		<div class="form-group margin-top">
			<span>Current password: </span>
			<input type="password" placeholder="" bind:value={currentPassword} style="width: 24rem; max-width: 100%;" />
			<span>New password: </span>
			<input type="password" placeholder="" bind:value={newPassword} style="width: 24rem; max-width: 100%;" />
			<span>Confirm new password: </span>
			<input type="password" placeholder="" bind:value={confirmNewPassword} style="width: 24rem; max-width: 100%;" />
			<button class="margin-top" on:click={() => changePassword()}>
				Change password
			</button>
		</div>
		<h4 class="margin-none">Your API key, used to upload files or create shortlinks with ShareX:</h4>
		<div class="form-group flex margin-top">
			<input type="text" placeholder="Enter a new key" id="key-input" bind:value={key} style="width: 24rem; max-width: 100%;" readonly />
			<button class="margin-left" on:click={() => key && navigator.clipboard.writeText(key)}>
				Copy
			</button>
			<button class="margin-left" on:click={() => renewKey()}>
				Renew key
			</button>
		</div>
	</div>
</div>