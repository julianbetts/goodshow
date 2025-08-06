<script>
  import { db } from '../firebase.js';
  import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

  export let user;

  let songs = [];
  let saveMessage = '';
  let errorMessage = '';
  const docRef = doc(db, 'setlists', 'default');

  async function loadSetlist() {
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        songs = docSnap.data().songs || [];
      } else {
        songs = [];
      }
    } catch (err) {
      errorMessage = 'Failed to load setlist: ' + err.message;
    }
  }

  function addSong() {
    songs = [...songs, { song: '', cues: '', notes: '' }];
  }

  function removeSong(index) {
    songs = songs.filter((_, i) => i !== index);
  }

  async function saveSetlist() {
    try {
      await setDoc(docRef, {
        songs,
        userId: user.uid,
        updatedAt: serverTimestamp()
      });
      saveMessage = 'Setlist saved!';
    } catch (err) {
      errorMessage = 'Error saving setlist: ' + err.message;
    }
  }

  loadSetlist();
</script>

<h2>Edit Setlist</h2>

{#each songs as song, i}
  <div class="song-block">
    <input bind:value={song.song} placeholder="Song name" />
    <input bind:value={song.cues} placeholder="Cues" />
    <textarea bind:value={song.notes} placeholder="Notes"></textarea>
    <button on:click={() => removeSong(i)}>🗑️</button>
  </div>
{/each}

<button on:click={addSong}>+ Add Song</button>
<button on:click={saveSetlist}>💾 Save</button>

{#if saveMessage}<p class="success">{saveMessage}</p>{/if}
{#if errorMessage}<p class="error">{errorMessage}</p>{/if}

<style>
  .song-block {
    margin-bottom: 1em;
    border: 1px solid #ccc;
    padding: 1em;
  }

  input, textarea {
    width: 100%;
    margin-bottom: 0.5em;
  }

  .success {
    color: green;
  }

  .error {
    color: red;
  }
</style>
