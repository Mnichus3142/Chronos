<script>
    import Theme from '$lib/components/theme.svelte';
    import Loader from '$lib/components/loader.svelte';
    import Banner from "$lib/components/banner.svelte";
    import Notification from "$lib/components/notification.svelte";
    import { theme } from '$lib/stores/themeStore';
    import { onMount } from 'svelte';
    import "../app.css";

    let isLoading = true;

    onMount(() => {
        if (!$theme) {
            theme.set('North coast');
        }
        setTimeout(() => {
            isLoading = false;
        }, 500);
    });
</script>

<style>
    :global(html, body) {
        height: 100%;
    }

    :global(body) {
        margin: 0;
        display: flex;
        flex-direction: column;
    }

    .content {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
    }
</style>

{#if isLoading}
    <Loader />
{:else}
    <Theme>
        <Notification />
        <Banner />
        <div class="content">
            <slot />
        </div>
    </Theme>
{/if}