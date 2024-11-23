<script>
    import Banner from "$lib/components/banner.svelte";
    import { onMount } from "svelte";
    import { TasksProvider } from "$lib/classes/TasksProvider.js";

    let timeArr = [];
    let tasks = [];
    let load = false;

    let taskName = "";
    let taskStart = "";
    let taskEnd = "";
    let taskDescription = "";
    let taskColor = "#000000";
    let taskText = "#ffffff";

    const taskProvider = new TasksProvider();
    const date = new Date();

    const label =
        "text-3xl text-third m-3 relative transition-all select-none grid justify-center place-items-center";
    const input =
        "h-8 w-72 border-b-2 text-lg focus:outline-none transition-all bg-transparent text-center";

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

    function createTask() {
        if (
            taskStart &&
            taskEnd &&
            taskName &&
            taskStart &&
            taskEnd &&
            taskColor &&
            taskText
        ) {
            taskProvider.addTask(
                taskName,
                taskDescription,
                taskStart,
                taskEnd,
                taskColor,
                taskText,
                date.toDateString(),
            );

            taskName = "";
            taskStart = "";
            taskEnd = "";
            taskDescription = "";
            taskColor = "#000000";
            taskText = "#ffffff";

            tasks = taskProvider.getTasks();
            tasks = [...tasks];
        }
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
                            class="p-1 rounded absolute left-16 right-4"
                            style="top: {task.task.start}px; height: {task.task
                                .duration}px; background-color: {task.task
                                .backgroundColor}; color: {task.task.textColor}"
                        >
                            {task.task.title}
                        </div>
                    {/each}
                </div>

                <!-- Details -->
                <div
                    class="col-start-2 row-start-1 w-full h-full grid grid-cols-1 grid-rows-[7fr_3fr]"
                >
                    <!-- Actual details LOL -->
                    <div>
                        <form
                            on:submit|preventDefault={createTask}
                            class="h-full relative"
                        >
                            <!-- Title -->
                            <div class="{label} text-4xl">
                                <label for="title"> Title </label>
                                <input
                                    type="text"
                                    class="{input} mt-4"
                                    id="title"
                                    placeholder="Here goes your title"
                                    bind:value={taskName}
                                    required
                                    maxlength="20"
                                />
                            </div>
                            <!-- Details of details -->
                            <div class="grid grid-cols-2">
                                <div class="w-full h-full text-center">
                                    <!-- Description -->
                                    <div class={label}>
                                        <label for="description">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            type="text"
                                            class="{input} mt-4 max-h-40 min-h-40 border-2 rounded-md"
                                            placeholder="Here goes description"
                                            bind:value={taskDescription}
                                            maxlength="116"
                                        ></textarea>
                                    </div>
                                    <!-- Color -->
                                    <div class="{label} mt-6">
                                        <label for="color">
                                            Pick a color for this task
                                        </label>
                                        <input
                                            type="color"
                                            class="{input} mt-4 w-5 h-5 rounded-full border-none"
                                            id="color"
                                            placeholder="Here goes your title"
                                            bind:value={taskColor}
                                        />
                                    </div>
                                    <!-- Text color -->
                                    <div class="{label} mt-6">
                                        <label for="colorText">
                                            Pick a color for text in this task
                                        </label>
                                        <input
                                            type="color"
                                            class="{input} mt-4 w-5 h-5 rounded-full border-none"
                                            id="colorText"
                                            placeholder="Here goes your title"
                                            bind:value={taskText}
                                        />
                                    </div>
                                </div>
                                <div class="w-full h-full text-center">
                                    <div class={label}>
                                        <label for="start">
                                            Select a start time
                                        </label>
                                        <input
                                            type="time"
                                            class={input}
                                            id="start"
                                            bind:value={taskStart}
                                        />
                                    </div>
                                    <div class="{label} mt-6">
                                        <label for="end">
                                            Select the ending time
                                        </label>
                                        <input
                                            type="time"
                                            class={input}
                                            id="end"
                                            bind:value={taskEnd}
                                        />
                                    </div>
                                </div>
                            </div>
                            <!-- Controls -->
                            <div class="absolute right-1 bottom-4">
                                <button
                                    type="submit"
                                    class="bg-accent pr-3 text-textColor h-12 grid grid-cols-2 grid-rows-1 place-items-center justify-center rounded-xl shadow-xl"
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
                                        <path d="m21.5 5.5-13.063 13L2.5 12.59"
                                        ></path>
                                    </svg>
                                    <p class="font-basic text-2xl">Add</p>
                                </button>
                            </div>
                        </form>
                    </div>
                    <!-- Preview -->
                    <div
                        class="border-t-2 border-gray-500 relative grid justify-center place-items-center"
                    >
                        <div
                            class="w-96 h-52 rounded-lg shadow-2xl relative grid justify-center place-items-center"
                            style="background-color: {taskColor};"
                        >
                            <p
                                class="font-basic text-xl absolute top-4 left-4"
                                style="color: {taskText};"
                            >
                                {taskName}
                            </p>
                            {#if taskStart != "" || taskEnd != ""}
                                <p
                                    class="font-basic text-xl absolute top-4 right-4"
                                    style="color: {taskText};"
                                >
                                    {taskStart} - {taskEnd}
                                </p>
                            {/if}
                            <p
                                class="font-basic text-xl w-80 break-words max-h-44 relative top-4"
                                style="color: {taskText};"
                            >
                                {taskDescription}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
{/if}
