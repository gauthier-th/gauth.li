<script lang="ts">
	import { Router, Link, Route } from "svelte-routing";
	import Login from './Login.svelte';
	import Home from './Home.svelte';

	export let url = "";
</script>

<Login>
	<Router url={url}>
		<nav>
			<Link to="/">Home</Link>
			<Link to="about">About</Link>
			<Link to="blog">Blog</Link>
		</nav>
		<div>
			<Route path="/" component="{Home}" />
		</div>
	</Router>
</Login>