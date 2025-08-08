FILE: src/App.svelte
<script>
  import Auth from './Auth.svelte';
  import GigForm from './GigForm.svelte';
  import GigTable from './components/GigTable.svelte';
  import SetlistView from './components/SetlistView.svelte';
  import SetlistEditor from './components/SetlistEditor.svelte';
  import { onMount } from 'svelte';
  import { auth } from './firebase.js';
  import { onAuthStateChanged, signOut } from 'firebase/auth';

  let user = null;
  let view = 'main'; // 'main' | 'editSetlist'

  onMount(() => {
    onAuthStateChanged(auth, (u) => { user = u; });
  });

  function logout() { signOut(auth); }
  function goToEditSetlist() { view = 'editSetlist'; }
  function goToMain() { view = 'main'; }
</script>

<main>
  {#if user}
    <p>Logged in as {user.email}</p>
    <button on:click={logout}>Log Out</button>

    {#if view === 'editSetlist'}
      <SetlistEditor {user} />
      <button on:click={goToMain}>⬅ Back</button>

    {:else}
      <section>
        <h2>Upcoming Gigs</h2>
        <!-- <GigForm {user} /> -->
        <GigTable {user} />
      </section>

      <section>
        <h2>Setlist</h2>
        <SetlistView />
        <button on:click={goToEditSetlist}>✏️ Edit Setlist</button>
      </section>
    {/if}
  {:else}
    <Auth />
  {/if}
</main>

<style>
  button {
    margin: 0.5em 0.5em 1em 0;
    padding: 0.5em 1em;
    font-weight: bold;
  }
  section {
    margin-top: 2em;
    border-top: 2px solid #ccc;
    padding-top: 1em;
  }
</style>
