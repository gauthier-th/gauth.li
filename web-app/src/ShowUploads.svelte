<script lang="ts">
	
	import { onMount } from 'svelte';
	import { keyStore } from './stores';
	import type { ResponseProps } from '../../server/routes/files';
	
	let key: string = "";
	let page: number = 0;
	let limit: number = 10;

	keyStore.subscribe((value: string) => {
		key = value;
	});

	let dataPromise: Promise<ResponseProps> | null = null;
	async function reloadData() {
		if (!key)
			return;
		dataPromise = fetch(`/files`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ key, page }),
		})
			.then((res) => res.json())
			.then((res) => res)
	}
	onMount(() => {
		reloadData();
	});

	async function nextPage() {
		page++;
		await reloadData();
	}
	async function previousPage() {
		page--;
		await reloadData();
	}

</script>

<div class="page-container container">
	<h2>Upload list</h2>
	{#if dataPromise}
		{#await dataPromise}
			<p>Loading...</p>
		{:then data}
			<table>
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Created at</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{#each data.files as file, i}
						<tr>
							<td class="align-middle">{page*limit + i+1}</td>
							<td class="align-middle">
								<a href={location.origin + "/" + file.id} target="_blank">{file.filename}</a>
							</td>
							<td class="align-middle">{new Date(file.createdAt).toLocaleString()}</td>
							<td class="align-middle">
								<button class="btn-danger btn-small">Delete</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<div class="flex justify-center w-100">
				<button disabled={page === 0} on:click={previousPage}>Previous</button>
				<button disabled={page === data.pageCount - 1} on:click={nextPage}>Next</button>
			</div>
		{:catch}
			<p class="text-danger">An unknown error occured.</p>
		{/await}
	{/if}
</div>