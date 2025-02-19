<script>
    import { theme } from '$lib/stores/themeStore';
    import colors from '$lib/colors';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    $: currentTheme = colors[$theme];

    onMount(() => {
        if (browser) {
            applyTheme($theme);
        }
    });

    function applyTheme(themeName) {
        if (!browser) return;
        
        const root = document.documentElement;
        const themeColors = colors[themeName];

        root.style.setProperty('--color-primary', themeColors.primary);
        root.style.setProperty('--color-secondary', themeColors.secondary);
        root.style.setProperty('--color-third', themeColors.third);
        root.style.setProperty('--color-accent', themeColors.accent);
        root.style.setProperty('--color-accent-not-active', themeColors.accentNotActive);
        root.style.setProperty('--color-background', themeColors.background);
        root.style.setProperty('--color-text', themeColors.textColor);
        root.style.setProperty('--color-motto', themeColors.mottoColor);
    }

    $: if (browser && currentTheme) {
        applyTheme($theme);
    }
</script>

<slot />