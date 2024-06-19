<script>
    import Profile from '$lib/components/profile.svelte'
    import { onMount } from 'svelte'
    import {page} from '$app/stores'

    let isOnCorrectPage = false

    onMount(() => {
        if ($page.url.pathname.substr($page.url.pathname.lastIndexOf('/')) != '/')
        {
            isOnCorrectPage = true; 
        }
    })
</script>

<div class='block'>
    <p>Time menager</p>
</div>

{#if isOnCorrectPage}
  <Profile></Profile>
{/if}

<style>
    .block {
        height: 60px;
        min-height: 60px;
        width: 100%;
        margin: 0;
        display: grid;

        background: linear-gradient(
            to right,
            var(--1),
            var(--3)
        );
        color: white;

        padding: 10px;

        overflow-y: hidden;
        overflow-x: hidden;

        position: static;
    }

    p {
        font-family: 'Rubik', sans-serif;
        

        font-size: 130%;
        position: relative;
        top: 27%;
        left: 20px;
    }
</style>