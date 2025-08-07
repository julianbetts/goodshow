<script>
  import { db } from '../firebase.js';
  import { collection, query, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

  export let user;

  let gigs = [];
  let loading = true;
  let error = '';
  let showForm = false;

  let title = '';
  let venue = '';
  let date = '';
  let message = '';
  let formError = '';

  async function fetchGigs() {
    loading = true;
    try {
      const q = query(collection(db, 'gigs'), orderBy('date', 'asc'));
      const snapshot = await getDocs(q);
      gigs = snapshot.docs
        .filter(doc => doc.data().userId === user.uid)
        .map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function saveGig() {
    message = '';
    formError = '';

    if (!title || !venue || !date) {
      formError = 'All fields are required.';
      return;
    }

    try {
      await addDoc(collection(db, 'gigs'), {
        userId: user.uid,
        title,
        venue,
        date,
        createdAt: serverTimestamp()
      });

      message = 'Gig saved!';
      title = '';
      venue = '';
      date = '';
      showForm = false;
      await fetchGigs(); // Refresh table
    } catch (err) {
      formError = err.message;
    }
  }

  fetchGigs();
</script>

{#if loading}
  <p>Loading gigs...</p>
{:else if error}
  <p style="color: red;">Error: {error}</p>
{:else}
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Venue</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {#each gigs as gig}
        <tr>
          <td>{gig.title}</td>
          <td>{gig.venue}</td>
          <td>{gig.date}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <button on:click={() => showForm = !showForm}>
    {showForm ? 'Cancel' : '➕ Add Gig'}
  </button>

  {#if showForm}
    <form on:submit|preventDefault={saveGig} class="gig-form">
      <input bind:value={title} placeholder="Title" required />
      <input bind:value={venue} placeholder="Venue" required />
      <input type="date" bind:value={date} required />
      <button type="submit">Save Gig</button>
    </form>
    {#if formError}<p class="error">{formError}</p>{/if}
    {#if message}<p class="success">{message}</p>{/if}
  {/if}
{/if}

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1em;
  }

  th, td {
    padding: 0.5em;
    border: 1px solid #ccc;
  }

  .gig-form {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    margin-top: 1em;
  }

  input, button {
    padding: 0.5em;
    font-size: 1em;
  }

  .error {
    color: red;
    margin-top: 0.5em;
  }

  .success {
    color: green;
    margin-top: 0.5em;
  }

  button {
    margin-top: 0.5em;
    font-weight: bold;
  }
</style>
