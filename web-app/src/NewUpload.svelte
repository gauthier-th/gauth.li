<script lang="ts">
	
	import { keyStore } from './stores';
	import type { DBFile } from '../../server/types/database';

	let key: string = "";
	let fileInput: HTMLInputElement;
	let files: File[] = [];
	let filesUploaded: DBFile[] = [];

	let modalFileUrls: HTMLInputElement;

	keyStore.subscribe((value: string) => {
		key = value;
	});

	async function onFileSelected(e: Event) {
		const target = e.target as HTMLInputElement;
		files = [];
		for (let i = 0; i < target.files.length; i++) {
			files.push(target.files[i]);
		}
	}

	async function uploadFile() {
		if (!files)
			return;
			filesUploaded = [];
		for (let file of files) {
			const formData = new FormData();
			formData.append("key", key);
			formData.append("file", file);
			const result = await fetch("/sharex", {
				method: "POST",
				body: formData,
			}).then((res) => res.json());
			filesUploaded.push(result.file);
		}
		filesUploaded = filesUploaded;
		files = [];
		fileInput.value = "";
		if (filesUploaded.length > 0)
			modalFileUrls.checked = true;
	}

</script>

<div class="page-container container">
	<h2>Upload files</h2>
	<div class="form-group">
		<label for="file">Choose one file or more:</label>
		<input type="file" class="form-control-file" id="file" name="file" multiple bind:this={fileInput} on:change={onFileSelected}>
		<button class="margin-top" on:click={uploadFile}>Upload</button>
	</div>
</div>

<input class="modal-state" id="modal-file-urls" type="checkbox" bind:this={modalFileUrls}>
<div class="modal">
	<label class="modal-bg" for="modal-file-urls"></label>
	<div class="modal-body">
		<label class="btn-close" for="modal-file-urls">X</label>
		<h4 class="modal-title">File{filesUploaded.length > 1 ? "s" : ""} uploaded!</h4>
		<div class="modal-text">
			{#each filesUploaded as file}
				<div class="flex align-center margin-top">
					<div class="flex">
						<span class="margin-right">{file.filename}</span>
						<a class="margin-right" href={location.origin + "/" + file.id} target="_blank">{location.origin + "/" + file.id}</a>
					</div>
					<!-- <button on:click={() => copyToClipboard(location.origin + "/" + file.id)}>Copy link</button> -->
				</div>
			{/each}
		</div>
		<label class="paper-btn" for="modal-file-urls">Nice!</label>
	</div>
</div>