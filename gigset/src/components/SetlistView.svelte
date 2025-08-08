FILE: src/components/SetlistView.svelte
<script>
  import { db } from '../firebase.js';
  import { doc, getDoc } from 'firebase/firestore';
  import { onMount } from 'svelte';

  let songs = [];
  let loading = true;
  let error = '';

  async function fetchSetlist() {
    try {
      const snap = await getDoc(doc(db, 'setlists', 'default'));
      if (snap.exists()) {
        songs = snap.data().songs || [];
      } else {
        error = 'No setlist found.';
      }
    } catch (err) {
      error = 'Error loading setlist: ' + (err.message ?? String(err));
    } finally {
      loading = false;
    }
  }

  onMount(fetchSetlist);
</script>

{#if loading}
  <p>Loading setlist...</p>
{:else if error}
  <p style="color: red;">{error}</p>
{:else}
  <table>
    <thead>
      <tr>
        <th>Song</th>
        <th>Cues</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      {#each songs as s}
        <tr>
          <td>{s.song || '—'}</td>
          <td>{s.cues || '—'}</td>
          <td>{s.notes || '—'}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  table { width: 100%; border-collapse: collapse; margin: 0.5em 0 1em; }
  th, td { padding: 0.5em; border: 1px solid #ccc; vertical-align: top; }
</style>
