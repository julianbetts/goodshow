<script>
  import Auth from './Auth.svelte';
  import GigForm from './GigForm.svelte';
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
    <GigForm {user} />
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
</style>
