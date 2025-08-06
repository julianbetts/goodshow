<script>
  import { db } from './firebase.js';
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

  export let user;

  let title = '';
  let venue = '';
  let date = '';
  let message = '';
  let error = '';

  async function saveGig() {
  message = '';
  error = '';

  try {
    await addDoc(collection(db, 'gigs'), {
      userId: user.uid,
      title,
      venue,
      date,
      createdAt: serverTimestamp(),
      setlist: [
        {
          song: "City Lights",
          cues: "Watch the drummer for the break",
          notes: "Use chorus pedal — bass drops out before last verse"
        },
        {
          song: "Black Ribbon",
          cues: "2-count into chorus",
          notes: "Cut reverb at end"
        },
        {
          song: "No Moon Tonight",
          cues: "Vocals only first verse",
          notes: "Slow fade after bridge"
        }
      ]
    });

    // ✅ Form reset + success message
    message = 'Gig saved!';
    title = '';
    venue = '';
    date = '';
  } catch (err) {
    error = err.message;
  }
}

</script>

<h2>Add a Gig</h2>

<form on:submit|preventDefault={saveGig}>
  <input bind:value={title} placeholder="Title" required />
  <input bind:value={venue} placeholder="Venue" required />
  <input type="date" bind:value={date} required />
  <button type="submit">Save Gig</button>
</form>

{#if message}
  <p style="color: green;">{message}</p>
{/if}

{#if error}
  <p style="color: red;">{error}</p>
{/if}

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    margin-top: 1em;
  }

  input, button {
    padding: 0.5em;
    font-size: 1em;
  }
</style>
