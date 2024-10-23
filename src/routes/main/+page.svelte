<script>
    import Banner from '$lib/components/banner.svelte'
    import { onMount, onDestroy } from 'svelte'
    import { goto } from '$app/navigation'
    import { clickOutside } from '$lib/functions/clickOutside.js'

    // State of page
    let load = false

    // Changelog data
    let changelogData = new Array()
    let version

    // Greeting stings
    const strings = ["Hey there! How's it going?", "What's up? Good to see you!", "Hiya! How have you been?", "Hey there! What's happening?", "Yo! How’ve you been?", "Sup? All good?"]
    let actual = ""

    // Let todo temp
    let list = []

    // Mode of the connection to database
    let mode = 'GET'

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

        handleDatabaseSync()

        mode = "SET"
        
        getRandomString()

    })

    createNewListItem()

    function initPage() 
    {
        load = true
        handleChangelog()
    }

    function getRandomString () 
    {
        const randomIndex = Math.floor(Math.random() * strings.length)
        actual = strings[randomIndex]
    }

    function createNewListItem ()
    {
        if (list.length != 0)
        {
            list[list.length - 1].state = false
        }

        else
        {
            list = list.filter(item => item.id !== list.length - 1)
        }

        let newItem

        if (list.length == 0)
        {
            newItem = {id: 0, text: "", state: "input"}
        }

        else 
        {
            const newId = list[list.length - 1].id + 1
            newItem = {id: newId, text: "", state: "input"}
        }

        list.push(newItem)

        if (load)
        {
            handleDatabaseSync()
        }
    }

    function removeItem (id) {
        list = list.filter(item => !(item.id === id && item.state !== "input"))
    }

    function handleEdit (id)
    {
        const element = list.find(item => item.id === id)

        if (element)
        {
            element.state = "edit"
        }

        list = [...list]
    }

    function handleChange (id, event)
    {
        if (event.key === 'Enter') {
            if (event.target.value.length != 0)
            {
                const element = list.find(item => item.id === id)

                if (element)
                {
                    element.text = event.target.value
                    element.state = "solid"
                }

                list = [...list]
            }
        }
    }

    function handleEnter(id, event) {
        if (event.key === 'Enter') {
            if (event.target.value.length != 0)
            {
                const element = list.find(item => item.id === id)

                if (element)
                {
                    element.text = event.target.value
                }

                createNewListItem()
            }
        }
    }

    const gotoChangelog = () => 
    {
        window.open('https://github.com/Mnichus3142/Time-Rush/blob/main/docs/CHANGELOG.md', '_blank')
    }

    const handleDatabaseSync = async () =>
    {
        let listActual = Array.from(list)
        listActual.pop()
        listActual = JSON.stringify(listActual)

        let data =  
        {
            listActual,
            mode
        }

        try {
            const response = await fetch('/api/cryptoProvidersForQuickList/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (response.ok)
            {
                
            }
        }
            
        catch (error) {
            console.error('Error:', error)
        }

        return 0
    }

    const handleChangelog = async () =>
    {
        try {
                const response = await fetch('/api/getChangelog/', {
                    method: 'POST'
                })

                if (response.ok)
                {
                    const responseData = await response.json()
                    const data = responseData.data.split('\n')
                    version = data[0].substr(3)
                    for (let i = 0; i < data.length; i++)
                    {
                        if (i > 0)
                        {
                            changelogData.push(data[i])
                        }
                    }

                    changelogData = [...changelogData]
                }    
            }
            
        catch (error) {
            console.error('Error:', error)
        }
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
            <div class="border-2 border-solid border-gray-500 w-full h-full rounded-xl">
                <div class="text-gray-500 text-center grid grid-cols-1 grid-rows-1">
                    <p class="font-basic text-3xl col-start-1 row-start-1 w-full border-b-2 border-gray-500 mt-1">Qucik To Do list</p>
                    <!-- <button class="col-start-1 row-start-1 mr-0 ml-auto relative -top-0.5">
                        <svg width="46" height="46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5v14"></path>
                            <path d="M5 12h14"></path>
                        </svg>
                    </button> -->
                </div>
                <div class="overflow-y-auto max-h-[83vh] overflow-x-hidden">
                    {#each list as element}
                        {#if element.state == "input"}
                            <div class="w-full h-12 grid justify-start place-items-center grid-cols-1 grid-rows-1">
                                <input type="text" class="col-start-1 row-start-1 w-full h-full p-4 focus:outline-none" placeholder="Write your task here..." on:keydown={(event) => handleEnter(element.id, event)}>
                            </div>
                        {:else if element.state == "edit"}
                            <div class="w-full h-12 grid justify-start place-items-center grid-cols-1 grid-rows-1 border-b-2 border-gray-500">
                                <input type="text" class="col-start-1 row-start-1 w-full h-full p-4 focus:outline-none" value="{element.text}" on:keydown={(event) => handleChange(element.id, event)}>
                            </div>
                        {:else}
                            <div class="w-full grid justify-start place-items-center grid-cols-1 grid-rows-1 border-b-2 border-gray-500 group h-fit">
                                <p class="col-start-1 row-start-1 w-full p-4 text-gray-500 text-balance break-words">{element.text}</p>
                                <button class="col-start-1 row-start-1 mr-12 ml-auto relative top-0 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" on:click={handleEdit(element.id)}>
                                    <svg width="46" height="46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3"></path>
                                        <path d="M9 14.996h3l8.5-8.5a2.121 2.121 0 0 0-3-3l-8.5 8.5v3Z"></path>
                                        <path d="m16 5 3 3"></path>
                                    </svg>
                                </button>
                                <button class="col-start-1 row-start-1 mr-0 ml-auto relative top-0.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" on:click={removeItem(element.id)}>
                                    <svg width="46" height="46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 6 6 18"></path>
                                        <path d="m6 6 12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
        <!-- TODO: On top welcome screen and greetings for the time we have spend togeter
        TODO: On bottom today's weather for user localisation -->
        <div class="col-start-2 row-start-1 grid grid-cols-1 grid-rows-1">
            <div class="row-start-1 flex flex-col justify-center place-items-center">
                <p class="text-7xl text-center p-4 mb-6 text-third">{actual}</p>
                
            </div>
        </div>
        <!-- TODO: How much you have done today and how much should be done 
         TODO: Changelog and actual app version -->
        <div class="col-start-3 row-start-1 grid grid-cols-1 grid-rows-2">
            <div class="row-start-1">

            </div>
            <button on:click={gotoChangelog}>
                <div class="row-start-2 flex flex-col justify-center place-items-center">
                    <p class="text-3xl text-center border-2 border-secondary rounded-lg p-4 mb-6">Changelog<br>{version}</p>
                    {#each changelogData as changelogItem}
                        <p>{changelogItem}</p>
                    {/each}
                </div>
            </button>
        </div>
    </main>
</body>
{/if}