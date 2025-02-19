<script>
    import Feedback from './settings/feedback.svelte';
    import ThemeToogler from './settings/themeToogler.svelte';
    import { scale, fade } from 'svelte/transition';
    import { crossfade } from 'svelte/transition';
    
    let animationDuration = 200;

    const components = {
        Feedback: Feedback,
        ThemeToogler: ThemeToogler
    };
    
    const tabs = [
        {
            name: 'Feedback', 
            icon: `<svg width="46" height="46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
            <path d="m3 7 9 6 9-6"></path>
            </svg>`,
            component: 'Feedback'
        },
        {
            name: "Theme",
            icon: `<svg width="46" height="46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3h-4a2 2 0 0 0-2 2v12a4 4 0 1 0 8 0V5a2 2 0 0 0-2-2Z"></path>
            <path d="m13 7.351-2-2a2 2 0 0 0-2.828 0L5.344 8.18a2 2 0 0 0 0 2.828l9 9"></path>
            <path d="M7.3 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12"></path>
            <path d="M17 17v.01"></path>
            </svg>`,
            component: 'ThemeToogler'
        },
    ];

    let selectedTab = false;
</script>

<div class="bg-background w-full h-full justify-center items-center rounded-lg shadow-xl border-2 border-gray-500 grid
grid-cols-[2fr_5fr] grid-rows-1 text-gray-800 font-basic">
    <div class="border-r-2 border-gray-500 h-full flex justify-center items-center text-3xl">
        <ul class="w-full h-full">
            {#each tabs as tab}
                <li class="cursor-pointer w-full h-20 flex justify-center items-center border-b-2 border-gray-500">
                    <button on:click={() => selectedTab = tab} class="flex justify-center items-center">
                        <span class="relative top-1 mr-2">{@html tab.icon}</span> {tab.name}
                    </button>
                </li>
            {/each}
        </ul>
    </div>
    <div class="relative w-full h-full">
        {#if selectedTab}
            {#key selectedTab.component}
                <div 
                    transition:scale={{
                        duration: animationDuration,
                        start: 0.95,
                        opacity: 0
                    }}
                    class="absolute inset-0 p-4"
                >
                    <svelte:component this={components[selectedTab.component]}/>
                </div>
            {/key}
        {/if}
    </div>
</div>