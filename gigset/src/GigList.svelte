<script>
  import { db } from './firebase.js';
  import {
    collection,
    query,
    where,
    orderBy,
    getDocs
  } from 'firebase/firestore';

  export let user;

  let gigs = [];
  let loading = true;
  let error = '';

import { deleteDoc, doc } from 'firebase/firestore';

async function deleteGig(id) {
  const confirmDelete = confirm('Delete this gig?');
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, 'gigs', id));
    gigs = gigs.filter(g => g.id !== id); // Update UI locally
  } catch (err) {
    error = 'Error deleting gig: ' + err.message;
  }
}

  async function fetchGigs() {
    try {
      const q = query(
        collection(db, 'gigs'),
        where('userId', '==', user.uid),
        orderBy('date', 'asc')
      );

      const snapshot = await getDocs(q);
      gigs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  fetchGigs();
</script>

<h2>Your Gigs</h2>

{#if loading}
  <p>Loading gigs...</p>
{:else if error}
  <p style="color: red;">Error: {error}</p>
{:else if gigs.length === 0}
  <p>No gigs yet.</p>
{:else}
<ul>
  {#each gigs as gig (gig.id)}
    <li>
      <div>
        <strong>{gig.title}</strong> @ {gig.venue} on {gig.date}
        <button on:click={() => deleteGig(gig.id)} class="trash-button">
            <img src="/icons/trash-svgrepo-com.svg" alt="Delete" width="18" height="18" />
        </button>

      </div>
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

  .trash-button {
  background: none;
  border: none;
  padding: 0;
  margin-left: 1em;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.trash-button img:hover {
  filter: brightness(0.8);
}

</style>