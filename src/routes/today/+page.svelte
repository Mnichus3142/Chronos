<script>
    import Banner from "$lib/components/banner.svelte";
    import { onMount, onDestroy } from "svelte";

    let timeArr = [];
    let load = false;
    
    onMount(() => {
        createTimeTable("24");

        initPage();
    })

    function initPage() {
        load = true;
    }

    function createTimeTable (format)
    {
        if (format == "24")
        {
            for (let i = 1; i < 25; i++)
            {
                if (i.length == 1)
                {
                    timeArr.push("0" + i + ":00");
                }

                else
                {
                    timeArr.push(i + ":00");
                }
            }
        }

        console.log(timeArr);
    }
</script>

{#if load}
    <body class="min-h-screen w-[100vw] flex flex-col">
        <Banner></Banner>
        <div class="p-8">
            <div class="flex-1 grid justify-center place-items-center border-gray-500 border-2 rounded-lg grid-cols-[2fr_5fr] grid-rows-1">
                <!-- Timeline -->
                <div class="col-start-1 row-start-1 w-full max-h-[85vh] border-r-2 border-gray-500 overflow-y-auto">
                    {#each timeArr as block}
                        <div class="bg-red-600 h-28">
                            <p>{block} AAAAA</p>
                        </div>
                    {/each}
                </div>
                <!-- Details -->
                <div class="col-start-2 row-start-1  w-full h-full">
                    AA
                </div>
            </div>
        </div>
    </body>
{/if}