<script lang="ts">
	
	import { onMount } from 'svelte';
	import { keyStore } from './stores';
	import type { DBFile } from '../../server/types/database';
	import type { ResponseProps } from '../../server/routes/files';
	
	let key: string = "";
	let page: number = 0;
	let limit: number = 10;
	let fileToDelete: DBFile | null = null;

	let modalConfirmDelete: HTMLInputElement;

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

	async function deleteFilePopup(file: DBFile) {
		fileToDelete = file;
		modalConfirmDelete.checked = true;
	}

	async function deleteFile() {
		if (!fileToDelete)
			return;
		await fetch(`/delete/${fileToDelete.id}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ key }),
		})
			.then((res) => res.json())
		await reloadData();
		modalConfirmDelete.checked = false;
		fileToDelete = null;
	}

</script>

<div class="page-container container">
	<h2>Upload list</h2>
	{#if dataPromise}
		{#await dataPromise}
			<p>Loading...</p>
		{:then data}
			<div class="flex justify-center w-100">
				<button class="btn-small" disabled={page === 0} on:click={previousPage}>Previous</button>
				<button class="btn-small" disabled={page === data.pageCount - 1} on:click={nextPage}>Next</button>
			</div>
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
								<button class="btn-danger btn-small" on:click={() => deleteFilePopup(file)}>Delete</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<div class="flex justify-center w-100">
				<button class="btn-small" disabled={page === 0} on:click={previousPage}>Previous</button>
				<button class="btn-small" disabled={page === data.pageCount - 1} on:click={nextPage}>Next</button>
			</div>
		{:catch}
			<p class="text-danger">An unknown error occured.</p>
		{/await}
	{/if}
</div>

<input class="modal-state" id="modal-file-urls" type="checkbox" bind:this={modalConfirmDelete}>
<div class="modal">
	<label class="modal-bg" for="modal-file-urls"></label>
	<div class="modal-body">
		<label class="btn-close" for="modal-file-urls">X</label>
		<h4 class="modal-title">Confirm deletion</h4>
		{#if fileToDelete}
			<p class="modal-text">
				Are you sure to delete file <a href={location.origin + "/" + fileToDelete.id} target="_blank">{fileToDelete.filename}</a>?
			</p>
		{/if}
		<div class="flex justify-end">
			<label class="paper-btn" for="modal-file-urls">No!</label>
			<button class="btn-danger" on:click={deleteFile}>Delete!</button>
		</div>
	</div>
</div>