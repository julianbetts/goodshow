<script>
  import { db } from '../firebase.js';
  import { doc, getDoc } from 'firebase/firestore';
  import { onMount, createEventDispatcher } from 'svelte';

  let songs = [];
  let loading = true;
  let error = '';

  const dispatch = createEventDispatcher();

  async function fetchSetlist() {
    try {
      const docSnap = await getDoc(doc(db, 'setlists', 'default'));
      if (docSnap.exists()) {
        songs = docSnap.data().songs || [];
      } else {
        error = 'No setlist found.';
      }
    } catch (err) {
      error = 'Error loading setlist: ' + err.message;
    } finally {
      loading = false;
    }
  }

  function goToEdit() {
    dispatch('edit'); // Triggers parent (App.svelte) to show editor
  }

  onMount(fetchSetlist);
</script>

<h2>Setlist</h2>

{#if loading}
  <p>Loading setlist...</p>
{:else if error}
  <p style="color: red;">{error}</p>
{:else if songs.length === 0}
  <p>No songs in setlist.</p>
{:else}
  <ul>
    {#each songs as song}
      <li>
        <strong>{song.song}</strong><br />
        <em>{song.cues}</em><br />
        {song.notes}
      </li>
    {/each}
  </ul>
  <button on:click={goToEdit}>✏️ Edit Setlist</button>
{/if}

<style>
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 1em;
    border-bottom: 1px solid #ccc;
    padding-bottom: 1em;
  }

  button {
    margin-top: 1em;
  }
</style>
