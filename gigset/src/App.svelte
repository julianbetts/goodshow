<script>
  import Auth from './Auth.svelte';
  import GigForm from './GigForm.svelte';
  import GigList from './GigList.svelte';
  import SetlistView from './components/SetlistView.svelte';
  import SetlistEditor from './components/SetlistEditor.svelte';
  import { onMount } from 'svelte';
  import { auth } from './firebase.js';
  import { onAuthStateChanged, signOut } from 'firebase/auth';

  let user = null;
  let view = 'main'; // 'main' | 'viewSetlist' | 'editSetlist'

  onMount(() => {
    onAuthStateChanged(auth, (u) => {
      user = u;
    });
  });

  function logout() {
    signOut(auth);
  }

  function goToViewSetlist() {
    view = 'viewSetlist';
  }

  function goToEditSetlist() {
    view = 'editSetlist';
  }

  function goToMain() {
    view = 'main';
  }
</script>

<main>
  {#if user}
    <p>Logged in as {user.email}</p>
    <button on:click={logout}>Log Out</button>

    {#if view === 'viewSetlist'}
      <SetlistView on:edit={goToEditSetlist} />
      <button on:click={goToMain}>⬅ Back</button>

    {:else if view === 'editSetlist'}
      <SetlistEditor {user} />
      <button on:click={goToViewSetlist}>⬅ Back to Setlist</button>

    {:else}
      <button on:click={goToViewSetlist}>🎵 View Setlist</button>

      <section>
        <h2>Upcoming Gigs</h2>
        <GigForm {user} />
        <GigList {user} />
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
