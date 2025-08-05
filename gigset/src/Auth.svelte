<script>
import { auth } from './firebase.js';
  import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
  } from 'firebase/auth';

  let email = '';
  let password = '';
  let isLogin = true;
  let error = '';
  let message = '';

  async function handleSubmit() {
    error = '';
    message = '';

    try {
      if (isLogin) {
        const user = await signInWithEmailAndPassword(auth, email, password);
        message = `Welcome back, ${user.user.email}`;
      } else {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        message = `Account created for ${user.user.email}`;
      }
    } catch (err) {
      error = err.message;
    }
  }
</script>

<h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>

<form on:submit|preventDefault={handleSubmit}>
  <input type="email" bind:value={email} placeholder="Email" required />
  <input type="password" bind:value={password} placeholder="Password" required />
  <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
</form>

<button on:click={() => isLogin = !isLogin}>
  {isLogin ? "Need an account? Sign up" : "Have an account? Log in"}
</button>

{#if message}
  <p style="color:green">{message}</p>
{/if}

{#if error}
  <p style="color:red">{error}</p>
{/if}

<style>
  form {
    margin: 1em 0;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }

  input {
    padding: 0.5em;
    font-size: 1em;
  }

  button {
    padding: 0.5em;
    font-weight: bold;
  }
</style>
