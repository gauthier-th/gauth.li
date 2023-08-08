<script lang="ts">

  import { keyStore } from '../../stores';
  import type { DBLink } from '../../../../server/src/types/database';
  import { PUBLIC_API_BASE_URL } from '$env/static/public';

  let link: string = "";
  let linkName: string = "";
  let createdLink: DBLink | null = null;
  let error: string | null = null;
  let key: string | null = "";

  let modalLink: HTMLInputElement;

  keyStore.subscribe((value: string | null) => {
    key = value;
  });

  async function createLink() {
    if (!key || !link)
      return;
    const result = await fetch(`${PUBLIC_API_BASE_URL}/url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        key,
        url: link,
        name: linkName,
      }),
    }).then((res) => res.json());
    createdLink = result.link;
    error = result.message || null;
    modalLink.checked = true;
    if (createdLink) {
      link = "";
      linkName = "";
    }
  }

</script>

<div class="page-container container">
  <h2>New link</h2>
  <div class="form-group">
    <label for="link">Enter the link to shorten:</label>
    <input type="text" id="link" name="link" style="width: 24rem; max-width: 100%;" bind:value={link} placeholder="https://yourlink.com/">
  </div>
  <div class="form-group">
    <label for="linkName">(Optionnal) Name of the link:</label>
    <input type="text" id="linkName" name="linkName" style="width: 24rem; max-width: 100%;" bind:value={linkName} placeholder="link-about-something">
  </div>
  <button class="margin-top" on:click={createLink}>Shorten link</button>
</div>

<input class="modal-state" id="modal-link" type="checkbox" bind:this={modalLink}>
<div class="modal">
  <label class="modal-bg" for="modal-link"></label>
  <div class="modal-body">
    <label class="btn-close" for="modal-link">X</label>
    <h4 class="modal-title">Link created!</h4>
    <div class="modal-text">
      {#if createdLink}
        <div class="align-center margin-top">
          <a class="margin-right" href={PUBLIC_API_BASE_URL + "/" + createdLink.id} target="_blank">{PUBLIC_API_BASE_URL + "/" + createdLink.id}</a>
          <!-- <button on:click={() => copyToClipboard(PUBLIC_API_BASE_URL + "/" + createdLink.id)}>Copy link</button> -->
        </div>
      {:else}
        <span>{error || "Unable to create link"}</span>
      {/if}
    </div>
    <label class="paper-btn" for="modal-link">Nice!</label>
  </div>
</div>