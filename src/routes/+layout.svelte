<script>
    import Theme from '$lib/components/theme.svelte';
    import Loader from '$lib/components/loader.svelte';
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

{#if isLoading}
    <Loader />
{:else}
    <Theme>
        <slot />
    </Theme>
{/if}