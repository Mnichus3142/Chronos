<script>
    import Profile from '$lib/components/profile.svelte'
    import logo from '$lib/img/logo1.png'
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
    <img src="{logo}" alt="Logo" style="height: 60px">
    <p>Time Rush</p>
    <p class="motto">Your time is like gold to us</p>
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
        
        float: left;

        font-size: 130%;
        position: absolute;
        top: 15px;
        left: 80px;
    }

    .motto {
        top: 40px;

        font-size: 15px;

        font-family: "Playwrite HR Lijeva", cursive;
        font-optical-sizing: auto;
        font-weight: 200;
        font-style: normal;

        color: #e9c882;
    }
</style>