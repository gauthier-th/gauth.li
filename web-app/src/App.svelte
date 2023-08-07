<script lang="ts">
	import { Router, Link, Route, navigate } from "svelte-routing";

	import { keyStore } from './stores';

	import Login from "./Login.svelte";
	import ShowUploads from "./ShowUploads.svelte";
	import NewUpload from "./NewUpload.svelte";
	import NewLink from "./NewLink.svelte";
	import Settings from "./Settings.svelte";

	async function logout() {
		keyStore.set(null);
		navigate("/app/");
	}

	export let url = "";
</script>

<div class="container">
	<Login>
		<Router {url}>
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
							<li><Link to="/app/new-upload">New upload</Link></li>
							<li><Link to="/app/new-link">New link</Link></li>
							<li><Link to="/app/settings">Settings</Link></li>
							<li><a href="/app/logout" on:click|preventDefault={logout}>Logout</a></li>
						</ul>
					</div>
				</div>
			</nav>
			<div>
				<Route path="/app/" component={ShowUploads} />
				<Route path="/app/new-upload" component={NewUpload} />
				<Route path="/app/new-link" component={NewLink} />
				<Route path="/app/settings" component={Settings} />
			</div>
		</Router>
	</Login>
</div>