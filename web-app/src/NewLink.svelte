<script lang="ts">
  
  import { keyStore } from './stores';
  import type { DBLink } from '../../server/types/database';

  let link: string = "";
  let createdLink: DBLink = null;
  let key: string = "";

  let modalLink: HTMLInputElement;

  keyStore.subscribe((value: string) => {
    key = value;
  });

  async function createLink() {
    if (!link)
      return;
    const result = await fetch("/url", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        key,
        url: link,
      }),
    }).then((res) => res.json());
    link = "";
    createdLink = result.link;
    modalLink.checked = true;
  }

</script>

<div class="page-container container">
  <h2>New link</h2>
  <div class="form-group">
    <label for="link">Enter the link to shorten:</label>
    <input type="text" id="link" name="link" style="width: 24rem; max-width: 100%;" bind:value={link}>
    <button class="margin-top" on:click={createLink}>Shorten link</button>
  </div>
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
          <a class="margin-right" href={location.origin + "/" + createdLink.id} target="_blank">{location.origin + "/" + createdLink.id}</a>
          <!-- <button on:click={() => copyToClipboard(location.origin + "/" + createdLink.id)}>Copy link</button> -->
        </div>
      {:else}
        <span>Unable to create link</span>
      {/if}
    </div>
    <label class="paper-btn" for="modal-link">Nice!</label>
  </div>
</div>