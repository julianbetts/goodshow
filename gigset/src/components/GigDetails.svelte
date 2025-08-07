<script>
  import { db } from '../firebase.js';
  import { doc, getDoc } from 'firebase/firestore';
  import { onMount } from 'svelte';

  export let gigId;

  let gig = null;
  let loading = true;
  let error = '';

  async function fetchGig() {
    loading = true;
    error = '';

    try {
      const docRef = doc(db, 'gigs', gigId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        gig = docSnap.data();
      } else {
        error = 'Gig not found.';
      }
    } catch (err) {
      error = 'Error fetching gig: ' + err.message;
    } finally {
      loading = false;
    }
  }

  onMount(fetchGig);
</script>

{#if loading}
  <p>Loading gig details...</p>
{:else if error}
  <p style="color: red;">{error}</p>
{:else if gig}
  <h2>{gig.title}</h2>
  <p><strong>Venue:</strong> {gig.venue}</p>
  <p><strong>Date:</strong> {gig.date}</p>

  {#if gig.setlist && gig.setlist.length > 0}
    <h3>Setlist</h3>
    <ul>
      {#each gig.setlist as song}
        <li>
          <strong>{song.song}</strong><br />
          <em>{song.cues}</em><br />
          {song.notes}
        </li>
      {/each}
    </ul>
  {/if}
{/if}

<style>
  h2 {
    margin-top: 0;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 1em;
    border-bottom: 1px solid #ccc;
    padding-bottom: 1em;
  }
</style>
