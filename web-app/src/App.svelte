<script lang="ts">
	import { Router, Link, Route, navigate } from "svelte-routing";

	import { keyStore } from './stores';

	import Login from "./Login.svelte";
	import NewUpload from "./NewUpload.svelte";
	import ShowUploads from "./ShowUploads.svelte";

	async function logout() {
		keyStore.set(null);
		navigate("/app/");
	}

	export let url = "";
</script>

<Login>
	<Router url={url}>
		<nav class="border fixed split-nav">
			<div class="nav-brand">
				<h3><Link to="/app/">gauth.li</Link></h3>
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
						<li><Link to="/app/">New upload</Link></li>
						<li><Link to="/app/uploads">Show uploads</Link></li>
						<li><a href="/app/logout" on:click|preventDefault={logout}>Logout</a></li>
					</ul>
				</div>
			</div>
		</nav>
		<div>
			<Route path="/app" component="{NewUpload}" />
			<Route path="/app/uploads" component="{ShowUploads}" />
		</div>
	</Router>
</Login>