<script>
  import Auth from './Auth.svelte';
  import GigForm from './GigForm.svelte';
  import GigList from './GigList.svelte';
  import SetlistEditor from './components/SetlistEditor.svelte';
  import SetlistList from './components/SetlistList.svelte';
  import { onMount } from 'svelte';
  import { auth } from './firebase.js';
  import { onAuthStateChanged, signOut } from 'firebase/auth';

  let user = null;

  onMount(() => {
    onAuthStateChanged(auth, (u) => {
      user = u;
    });
  });

  function logout() {
    signOut(auth);
  }
</script>

<main>
  {#if user}
    <p>Logged in as {user.email}</p>
    <button on:click={logout}>Log Out</button>

    <section>
      <h2>Upcoming Gigs</h2>
      <GigForm {user} />
      <GigList {user} />
    </section>

    <section>
      <h2>Your Setlists</h2>
      <SetlistEditor {user} />
      <SetlistList {user} />
    </section>

  {:else}
    <Auth />
  {/if}
</main>

<style>
  button {
    margin-top: 1em;
    padding: 0.5em;
    font-weight: bold;
  }

  section {
    margin-top: 2em;
    border-top: 2px solid #ccc;
    padding-top: 1em;
  }
</style>
