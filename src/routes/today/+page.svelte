<script>
    import Banner from "$lib/components/banner.svelte";
    import { onMount } from "svelte";

    let timeArr = [];
    let tasks = [];
    let load = false;

    let taskName = '';
    let taskStart = '';
    let taskEnd = '';

    onMount(() => {
        createTimeTable("24");

        load = true;
    });

    function createTimeTable(format) {
        if (format == "24") {
            for (let i = 0; i < 24; i++) {
                const hour = i < 10 ? "0" + i : i;
                timeArr.push(hour + ":00");
            }
        }
    }

    function addTask() {
        if (taskStart && taskEnd && taskName) {
            const startPercent = timeToPercent(taskStart);
            const endPercent = timeToPercent(taskEnd);
            const taskDuration = endPercent - startPercent;

            tasks.push({
                name: taskName,
                start: startPercent,
                duration: taskDuration
            });

            taskName = '';
            taskStart = '';
            taskEnd = '';

            tasks = [...tasks];
        }
    }

    function timeToPercent(time) {
        let [hours, minutes] = time.split(":").map(Number);
        let pixelHours = (hours * 112) + 8 + (minutes / 112) + 25;

        return pixelHours;
    }
</script>

{#if load}
    <body class="h-screen flex flex-col">
        <div class="row-start-1">
            <Banner></Banner>
        </div>
        
        <div class="flex-1 w-screen max-h-full p-6">
            <div class="flex-1 grid justify-center place-items-center border-gray-500 border-2 rounded-lg grid-cols-[2fr_5fr] grid-rows-1">
                <!-- Timeline Container -->
                <div class="col-start-1 row-start-1 w-full max-h-[85vh] border-r-2 border-gray-500 overflow-y-auto p-2 relative">
                    <!-- Timeline -->
                    {#each timeArr as block}
                        <div class="h-28 text-gray-400">
                            <p>{block}</p>
                            <hr class="border-t-2 border-gray-400">
                        </div>
                    {/each}
                    
                    <!-- Tasks -->
                    {#each tasks as task}
                        <div 
                            class="bg-blue-500 text-white p-1 rounded absolute left-14 right-3" 
                            style="top: {task.start}px; height: {task.duration}px;">
                            {task.name}
                        </div>
                    {/each}
                </div>

                <!-- Details -->
                <div class="col-start-2 row-start-1 w-full h-full">
                    <div class="mb-4">
                        <form on:submit|preventDefault={addTask}>
                            <label>
                                Nazwa zadania:
                                <input type="text" bind:value={taskName} required>
                            </label>
                            <label>
                                Start (HH:MM):
                                <input type="time" bind:value={taskStart} required>
                            </label>
                            <label>
                                Koniec (HH:MM):
                                <input type="time" bind:value={taskEnd} required>
                            </label>
                            <button type="submit">Dodaj zadanie</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </body>
{/if}
