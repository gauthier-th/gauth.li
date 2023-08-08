<script lang="ts">

  import { keyStore } from '../../stores';
  import type { DBFile } from '../../../../server/src/types/database';
  import { PUBLIC_API_BASE_URL } from '$env/static/public';

  let key: string | null = "";
  let fileInput: HTMLInputElement;
  let files: File[] = [];
  let linkNames: string[] = [];
  let filesUploaded: DBFile[] = [];
  let errors: { file: string, error: string }[] = [];

  let modalFileUrls: HTMLInputElement;

  keyStore.subscribe((value: string | null) => {
    key = value;
  });

  async function onFileSelected(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target.files)
      return;
    files = [];
    for (let i = 0; i < target.files.length; i++) {
      files.push(target.files[i]);
      linkNames.push("");
    }
  }

  async function uploadFile() {
    if (!key || !files)
      return;
    filesUploaded = [];
    errors = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const linkName = linkNames[i] || "";
      const formData = new FormData();
      formData.append("key", key);
      formData.append("name", linkName);
      formData.append("file", file);
      const result = await fetch(`${PUBLIC_API_BASE_URL}/sharex`, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
      if (result.file) {
        filesUploaded.push(result.file);
      }
      else {
        errors.push({ file: file.name, error: result.message });
      }
    }
    files = [];
    linkNames = [];
    fileInput.value = "";
    filesUploaded = filesUploaded;
    modalFileUrls.checked = true;
  }

</script>

<div class="page-container container">
  <h2>Upload files</h2>
  <div class="form-group">
    <label for="file">Choose one file or more:</label>
    <input type="file" class="form-control-file" id="file" name="file" multiple bind:this={fileInput} on:change={onFileSelected}>
  </div>
  {#if files.length > 1}
    <div class="form-group">
      <span>(Optionnal) Name of the files:</span>
      {#each files as file, i}
        <div class="grid grid-cols-2 align-center margin-left">
          <span class="margin-right-small">{file.name}:</span>
          <input type="text" id="linkName" name="linkName" style="width: 24rem; max-width: 100%;" bind:value={linkNames[i]} placeholder="name-of-the-link-to-the-file">
        </div>
      {/each}
    </div>
  {:else}
    <div class="form-group">
      <label for="linkName">(Optionnal) Name of the file:</label>
      <input type="text" id="linkName" name="linkName" style="width: 24rem; max-width: 100%;" bind:value={linkNames[0]} placeholder="name-of-the-link-to-the-file">
    </div>
  {/if}
  <button class="margin-top" on:click={uploadFile}>Upload</button>
</div>

<input class="modal-state" id="modal-file-urls" type="checkbox" bind:this={modalFileUrls}>
<div class="modal">
  <label class="modal-bg" for="modal-file-urls"></label>
  <div class="modal-body">
    <label class="btn-close" for="modal-file-urls">X</label>
    {#if filesUploaded.length > 0}
      <h4 class="modal-title">File{filesUploaded.length > 1 ? "s" : ""} uploaded!</h4>
      <div class="modal-text">
        {#each filesUploaded as file}
          <div class="grid grid-cols-2 align-center margin-top">
            <span class="margin-right">{file.filename}:</span>
            <div class="margin-right">
              <a href={PUBLIC_API_BASE_URL + "/" + file.id} target="_blank">{PUBLIC_API_BASE_URL + "/" + file.id}</a>
            </div>
            <!-- <button on:click={() => copyToClipboard(PUBLIC_API_BASE_URL + "/" + file.id)}>Copy link</button> -->
          </div>
        {/each}
      </div>
    {/if}
    {#if errors.length > 0}
      <h4 class="modal-title">{errors.length > 1 ? errors.length : "An"} error{errors.length > 1 ? "s" : ""} occured!</h4>
      <div class="modal-text">
        {#each errors as { file, error }}
          <div class="grid grid-cols-2 align-center margin-top">
            <span class="margin-right">{file}:</span>
            <span class="margin-right">{error}</span>
          </div>
        {/each}
      </div>
    {/if}
    <label class="paper-btn" for="modal-file-urls">
      {errors.length === 0 ? "Nice!" : "Ok"}
    </label>
  </div>
</div>