<script>
    import Banner from '$lib/components/banner.svelte'
    import { onMount, onDestroy } from 'svelte'
    import { goto } from '$app/navigation';

    // State of page
    let load = false

    onMount(() => {
        const cookie_value = document.cookie.split('; ').find(row => row.startsWith('sessionId='))?.split('=')[1]
        
        if (!cookie_value) {
            goto('/')
        }

        // Init page when it's loaded
        if (document.readyState === 'complete') 
        {
            initPage()
        } 

        else 
        {
            window.addEventListener('load', initPage)
        }
    })

    function initPage() {
      load = true
    }

    const gotoChangelog = () => 
    {
        window.open('https://github.com/Mnichus3142/Time-Rush/blob/main/CHANGELOG.md', '_blank')
    }
</script>

{#if load}
<body class="flex flex-col min-h-screen">
    <div class="row-start-1">
        <Banner></Banner>
    </div>
    <main class="flex-1 grid grid-cols-3 grid-rows-1 w-screen h-full">
        <!-- Quick TODO list -->
        <div class="col-start-1 row-start-1 p-3">
            <div class="border-2 border-solid border-third w-full h-full rounded-xl">
                <div class="grid grid-cols-2 grid-rows-1 font-basic text-xl text-third">
                    <p class="col-start-1">Quick To Do List</p>
                    <svg width="46" height="46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="col-start-2">
                        <path d="M12 5v14"></path>
                        <path d="M5 12h14"></path>
                    </svg>
                </div>
            </div>
        </div>
        <!-- TODO: On top welcome screen and greetings for the time we have spend togeter
        TODO: On bottom today's weather for user localisation -->
        <div class="col-start-2 row-start-1 bg-red-600">

        </div>
        <!-- TODO: How much you have done today and how much should be done 
         TODO: Changelog and actual app version -->
        <div class="col-start-3 row-start-1 bg-yellow-400">

        </div>
    </main>
</body>
{/if}