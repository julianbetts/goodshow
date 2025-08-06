<script>
  import { db } from '../firebase.js';
  import {
    collection,
    query,
    orderBy,
    getDocs
  } from 'firebase/firestore';

  export let user;

  let setlists = [];
  let loading = true;
  let error = '';

  async function fetchSetlists() {
    loading = true;
    error = '';

    try {
      const q = query(
        collection(db, 'setlists'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      
      setlists = snapshot.docs
        .filter(doc => doc.data().userId === user.uid)
        .map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  let expanded = [];

  function toggleExpanded(index) {
    expanded[index] = !expanded[index];
    expanded = [...expanded]; // reassign to trigger reactivity
  }

  fetchSetlists();
</script>

<h3>Your Setlists</h3>
<button on:click={fetchSetlists}>Refresh List</button>

{#if loading}
  <p>Loading setlists...</p>
{:else if error}
  <p style="color: red;">Error: {error}</p>
{:else if setlists.length === 0}
  <p>No setlists yet.</p>
{:else}
  <ul>
    {#each setlists as setlist, i}
      <li>
        <button on:click={() => toggleExpanded(i)} class="setlist-title">
          <strong>{setlist.name}</strong> ({setlist.songs.length} songs)
        </button>
        {#if expanded[i]}
          <ul class="song-list">
            {#each setlist.songs as song}
              <li>
                <strong>{song.song}</strong><br />
                {#if song.cues}<em>Cues:</em> {song.cues}<br />{/if}
                {#if song.notes}<em>Notes:</em> {song.notes}{/if}
              </li>
            {/each}
          </ul>
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 0.5em;
    padding-bottom: 0.5em;
    border-bottom: 1px solid #ccc;
  }

  .setlist-title {
  background: none;
  border: none;
  padding: 0;
  font-size: 1em;
  color: white;
  cursor: pointer;
  text-align: left;
}

.song-list {
  margin-left: 1em;
  margin-top: 0.5em;
}

</style>
