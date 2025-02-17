<script>
    import Feedback from './settings/feedback.svelte';
    import { scale } from 'svelte/transition';
    
    let animationDuration = 200;

    const components = {
        Feedback: Feedback
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
    ];

    let selectedTab = false;
</script>

<div class="bg-background w-full h-full justify-center items-center rounded-lg shadow-xl border-2 border-gray-500 grid
grid-cols-[2fr_5fr] grid-rows-1 text-gray-800">
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
    {#if selectedTab}
        <div 
            transition:scale={{
                duration: animationDuration,
                start: 0.95,
                opacity: 0
            }}
            class="p-4"
        >
            <svelte:component this={components[selectedTab.component]}/>
        </div>
    {/if}
</div>