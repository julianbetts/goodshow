<script>
  import { db } from '../firebase.js';
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

  let setlistName = '';
  let saveMessage = '';
  let errorMessage = '';

  let songs = [
    { song: '', cues: '', notes: '' }
  ];

  function addSong() {
    songs = [...songs, { song: '', cues: '', notes: '' }];
  }

  function removeSong(index) {
    songs = songs.filter((_, i) => i !== index);
  }

  async function saveSetlist() {
    saveMessage = '';
    errorMessage = '';

    if (!setlistName.trim()) {
      errorMessage = 'Setlist name is required.';
      return;
    }

    try {
      await addDoc(collection(db, 'setlists'), {
        name: setlistName,
        createdAt: serverTimestamp(),
        songs
      });

      saveMessage = 'Setlist saved!';
      setlistName = '';
      songs = [{ song: '', cues: '', notes: '' }];
    } catch (err) {
      errorMessage = 'Error: ' + err.message;
    }
  }
</script>

<h2>Create a New Setlist</h2>

<input bind:value={setlistName} placeholder="Setlist Name" required />

{#each songs as song, i}
  <div class="song-block">
    <input bind:value={song.song} placeholder="Song name" />
    <input bind:value={song.cues} placeholder="Cues (optional)" />
    <textarea bind:value={song.notes} placeholder="Notes (optional)"></textarea>
    <button on:click={() => removeSong(i)} class="delete-button">🗑️</button>
  </div>
{/each}

<button on:click={addSong}>+ Add Song</button>
<button on:click={saveSetlist}>💾 Save Setlist</button>

{#if saveMessage}<p class="success">{saveMessage}</p>{/if}
{#if errorMessage}<p class="error">{errorMessage}</p>{/if}

<style>
  input, textarea {
    padding: 0.5em;
    margin-bottom: 0.5em;
    width: 100%;
    font-size: 1em;
  }

  .song-block {
    border: 1px solid #ccc;
    padding: 1em;
    margin-bottom: 1em;
    position: relative;
  }

  .delete-button {
    position: absolute;
    top: 0.5em;
    right: 0.5em;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2em;
  }

  .success {
    color: green;
    margin-top: 1em;
  }

  .error {
    color: red;
    margin-top: 1em;
  }
</style>
