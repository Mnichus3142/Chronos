<script>
    import Profile from "$lib/components/profile.svelte";
    import Clock from "$lib/components/clock.svelte";
    import logo from "$lib/img/logo1.png";
    import { page } from "$app/stores";
    import "../../app.css";

    $: isOnCorrectPage = $page.url.pathname !== "/";
</script>

<div
    class="grid h-24 m-0 p-3 w-full bg-gradient-to-r from-primary to-secondary content-center overflow-y-hidden overflow-x-hidden static"
>
    <img src={logo} alt="Logo" style="height: 100px" />
    <p
        class="text-textColor text-2xl font-basic float-left absolute top-4 left-28"
    >
        Chronos
    </p>
    <p
        class="text-mottoColor text-l font-motto float-left absolute top-12 left-28"
    >
        Your time is like gold to us
    </p>
</div>

{#if isOnCorrectPage}
    <div class="absolute top-5 left-[45%] hidden lg:block">
        <Clock></Clock>
    </div>
    <div class="absolute top-6 right-4 text-background z-50">
        <Profile></Profile>
    </div>
{/if}
