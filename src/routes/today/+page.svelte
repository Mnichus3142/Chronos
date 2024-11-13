<script>
    import Banner from "$lib/components/banner.svelte";
    import { onMount } from "svelte";

    let timeArr = [];
    let tasks = [];
    let load = false;

    let taskName = "";
    let taskStart = "";
    let taskEnd = "";

    const label =
        "text-3xl text-accentNotActive m-3 relative transition-all select-none -left-16";
    const input =
        "z-10 h-8 w-72 border-b-2 text-lg focus:outline-none transition-all bg-transparent";

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
            const startPixels = timeToPixels(taskStart);
            const endPixels = timeToPixels(taskEnd);
            const taskDuration = endPixels - startPixels;

            tasks.push({
                name: taskName,
                start: startPixels,
                duration: taskDuration,
            });

            taskName = "";
            taskStart = "";
            taskEnd = "";

            console.log(tasks);

            tasks = [...tasks];
        }
    }

    function timeToPixels(time) {
        let [hours, minutes] = time.split(":").map(Number);
        let pixelHours = hours * 112 + 8 + minutes / 112 + 25;

        return pixelHours;
    }
</script>

{#if load}
    <body class="h-screen flex flex-col">
        <div class="row-start-1">
            <Banner></Banner>
        </div>

        <div class="flex-1 w-screen max-h-full p-6">
            <div
                class="flex-1 grid justify-center place-items-center border-gray-500 border-2 rounded-lg grid-cols-[2fr_5fr] grid-rows-1"
            >
                <!-- Timeline Container -->
                <div
                    class="col-start-1 row-start-1 w-full max-h-[85vh] border-r-2 border-gray-500 overflow-y-scroll p-2 relative scrollbar scrollbar-thumb-third scrollbar-track-transparent"
                >
                    <!-- Timeline -->
                    {#each timeArr as block}
                        <div class="h-28 text-gray-400">
                            <p>{block}</p>
                            <hr class="border-t-2 border-gray-400" />
                        </div>
                    {/each}

                    <!-- Tasks -->
                    {#each tasks as task}
                        <div
                            class="bg-blue-500 text-white p-1 rounded absolute left-16 right-4"
                            style="top: {task.start}px; height: {task.duration}px;"
                        >
                            {task.name}
                        </div>
                    {/each}
                </div>

                <!-- Details -->
                <div class="col-start-2 row-start-1 w-full h-full">
                    <!-- Actual details LOL -->
                    <div class="mb-4 h-1/2">
                        <form
                            on:submit|preventDefault={addTask}
                            class="grid grid-cols-2 grid-rows-2 h-full"
                        >
                            <div
                                class="h-full grid place-items-center justify-center"
                            >
                                <label class="grid grid-cols-1 grid-rows-2">
                                    <p class={label}>Task name</p>
                                    <input
                                        type="text"
                                        bind:value={taskName}
                                        required
                                        class={input}
                                    />
                                </label>
                            </div>
                            <label>
                                Start (HH:MM):
                                <input
                                    type="time"
                                    bind:value={taskStart}
                                    required
                                />
                            </label>
                            <label>
                                Koniec (HH:MM):
                                <input
                                    type="time"
                                    bind:value={taskEnd}
                                    required
                                />
                            </label>
                            <button type="submit">Dodaj zadanie</button>
                        </form>
                    </div>
                    <!-- Preview -->
                    <div></div>
                </div>
            </div>
        </div>
    </body>
{/if}
