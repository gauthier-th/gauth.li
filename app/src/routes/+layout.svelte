<script>
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import './styles.css';
	import { keyStore } from '../stores';
	import Login from './Login.svelte';

	async function logout() {
		keyStore.set(null);
		goto(`${base}/`);
	}
</script>

<Login>
	<nav class="border fixed split-nav">
		<div class="nav-brand">
			<h3><a href={`${base}/`}>gauth.li</a></h3>
		</div>
		<div class="collapsible">
			<input id="collapsible1" type="checkbox" name="collapsible1">
			<label for="collapsible1">
				<div class="bar1" style="height: 3px;"></div>
				<div class="bar2" style="height: 3px;"></div>
				<div class="bar3" style="height: 3px;"></div>
			</label>
			<div class="collapsible-body">
				<ul class="inline">
					<li><a href={`${base}/new-upload`}>New upload</a></li>
					<li><a href={`${base}/new-link`}>New link</a></li>
					<li><a href={`${base}/settings`}>Settings</a></li>
					<li><a href={`${base}/logout`} on:click|preventDefault={logout}>Logout</a></li>
				</ul>
			</div>
		</div>
	</nav>

	<main class="container">
		<slot />
	</main>
</Login>
