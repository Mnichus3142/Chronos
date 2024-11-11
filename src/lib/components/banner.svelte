<script>
    import Profile from "$lib/components/profile.svelte";
    import Clock from "$lib/components/clock.svelte";
    import logo from "$lib/img/logo1.png";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import "../../app.css";

    // Check if you are on landing page, if you are then do not show profile
    let isOnCorrectPage = false;

    onMount(() => {
        if ($page.url.pathname != "/") {
            isOnCorrectPage = true;
        }
    });
</script>

<div
    class="grid h-24 m-0 p-3 w-full bg-gradient-to-r from-primary to-third content-center overflow-y-hidden overflow-x-hidden static"
>
    <img src={logo} alt="Logo" style="height: 60px" />
    <p
        class="text-textColor text-2xl font-basic float-left absolute top-4 left-20"
    >
        Time Rush
    </p>
    <p
        class="text-mottoColor text-l font-motto float-left absolute top-12 left-20"
    >
        Your time is like gold to us
    </p>
</div>

{#if isOnCorrectPage}
    <div class="absolute top-5 left-[45%]">
        <Clock></Clock>
    </div>
    <div class="absolute top-6 right-4 text-background">
        <Profile></Profile>
    </div>
{/if}
