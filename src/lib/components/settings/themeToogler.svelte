<script>
    import { theme } from '$lib/stores/themeStore';
    import colors from '$lib/colors';
    import { themes } from '$lib/colors';

    let selectedTheme = $theme;
    let previewTheme = $theme;

    function applyTheme() {
        theme.set(selectedTheme);
    }

    function handlePreview(themeName) {
        selectedTheme = themeName;
        previewTheme = themeName;
    }

    function getThemeGradient(themeName) {
        const themeColors = colors[themeName];
        return `linear-gradient(45deg, 
            ${themeColors.primary} 0%, 
            ${themeColors.secondary} 33%, 
            ${themeColors.third} 66%, 
            ${themeColors.background} 100%
        )`;
    }
</script>

<div class="flex flex-col gap-4 w-full h-full p-4 font-basic">
    <h2 class="text-2xl font-semibold mb-4">Choose theme</h2>
    
        <ul class="flex flex-col gap-2 w-full">
        {#each themes as themeName}
            <li>
                <button 
                    class="w-full p-4 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-[1.02] flex items-center gap-4"
                    class:border-accent={selectedTheme === themeName}
                    class:border-gray-300={selectedTheme !== themeName}
                    on:click={() => handlePreview(themeName)}
                >
                    <div 
                        class="w-16 h-8 rounded-md"
                        style="background: {getThemeGradient(themeName)}"
                    ></div>
                    <span class="font-semibold">
                        {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                    </span>
                </button>
            </li>
        {/each}
    </ul>

    <div class="flex justify-end mt-4">
        <button 
            class="px-3 py-2 bg-accent text-white rounded-lg transition-all flex justify-center place-items-center gap-2 hover:scale-110 cursor-pointer"
            on:click={applyTheme}
            disabled={selectedTheme === $theme}
        >
            <svg
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="m21.5 5.5-13.063 13L2.5 12.59"
                ></path>
            </svg>
            Apply
        </button>
    </div>
</div>