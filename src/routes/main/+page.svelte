<script>
    import Banner from '$lib/components/banner.svelte'
    import { onMount, onDestroy } from 'svelte'
    import { goto } from '$app/navigation';

    // State of page
    let load = false

    onMount(() => {
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

<body>
    <Banner></Banner>
    <main>
        <!-- TODO: Quick todo list -->
        <div class="container left">
            <div class="dailyTitle">
                <p class="smallTitle">
                    Quick tasks
                
                    <button title="Add quick task">
                        <svg width="26" height="26" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"></path>
                            <path d="M9 12h6"></path>
                            <path d="M12 9v6"></path>
                        </svg>
                    </button>
                </p>
            </div>
            <div class="changelog">
                <p class="smallTitle">
                    Changelog

                    <button title="Full changelog" on:click={gotoChangelog}>
                        <svg width="26" height="26" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
                            <path d="M13 3h-2a2 2 0 1 0 0 4h2a2 2 0 1 0 0-4Z"></path>
                            <path d="M9 12h.01"></path>
                            <path d="M13 12h2"></path>
                            <path d="M9 16h.01"></path>
                            <path d="M13 16h2"></path>
                        </svg>
                    </button>
                </p>
            </div>
        </div>
        <!-- TODO: Pie chart of done things -->
        <div class="container center">
            <div class="progress">
                <p class="smallTitle">
                    Your today progress
                    
                    <svg width="26" height="26" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3.201a9 9 0 1 0 10.8 10.8 1 1 0 0 0-1-1H13a2 2 0 0 1-2-2v-7a.898.898 0 0 0-1-.8Z"></path>
                        <path d="M15 3.5A9 9 0 0 1 20.5 9H16a1 1 0 0 1-1-1V3.5Z"></path>
                    </svg>
                </p>
            </div>
            <div class="calendar">
                <p class="smallTitle">
                    Calendar

                    <button>
                        <svg width="26" height="26" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
                            <path d="M16 3v4"></path>
                            <path d="M8 3v4"></path>
                            <path d="M4 11h16"></path>
                            <path d="M11 15h1"></path>
                            <path d="M12 15v3"></path>
                        </svg>
                    </button>
                </p>
            </div>
        </div>
        <!-- TODO: Today's tasks (other than those from quick todo list) -->
        <div class="container right">
            <div class="todayTodo">
                <p class="smallTitle">
                    Today tasks

                    <button>
                        <svg width="26" height="26" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"></path>
                            <path d="M9 12h6"></path>
                            <path d="M12 9v6"></path>
                        </svg>
                    </button>
                </p>
            </div>
        </div>
    </main>
</body>

<style>
    body
    {
        overflow-x: hidden;
        overflow-y: hidden;
    }

    main
    {
        height: calc(92vh - 40px);
        min-height: 600px;
        width: 100vw;
        min-width: 1620px;

        text-align: center;

        padding: 20px;

        overflow-x: auto;
    }

    .container
    {
        float: left;

        position: relative;

        width: calc((100vw - 80px) / 3);
        min-width: 400px;
        height: calc(92vh - 40px);

        font-family: 'Rubik', sans-serif;
    }

    .dailyTitle, .changelog, .progress, .calendar
    {
        border: 3px solid var(--5);
        border-radius: 20px;

        height: 45%;
    }

    .todayTodo
    {
        border: 3px solid var(--5);
        border-radius: 20px;

        height: calc(90% + 46px);
    }

    .changelog, .calendar
    {
        margin-top: 40px;
    }

    .smallTitle
    {
        font-size: 20px;
        font-weight: 600;
        color: var(--3);

        border-bottom: 2px solid var(--5);
        padding: 10px;
        text-align: left;
    }

    .smallTitle svg
    {
        color: var(--3);

        position: absolute;
        right: 10px;
    }

    .smallTitle button
    {
        position: absolute;
        right: 10px;

        cursor: pointer;

        background-color: white;
        border: none;
    }

    .smallTitle button svg
    {
        position: relative;
        top: 0px;

        color: var(--3);
    }

    .center
    {
        margin-left: 20px;
        margin-right: 20px;
    }
</style>