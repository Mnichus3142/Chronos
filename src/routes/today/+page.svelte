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

    let mode = "GET";

    let popUp = false;
    let i = 0;
    let displayElements = "hidden";
    let popUpWidth = "0%";
    let popUpHeight = "0%";
    let scale = 0.0;
    let descriptionActual = "";

    const taskProvider = new TasksProvider();
    const date = new Date();

    const label =
        "text-3xl text-third m-3 relative transition-all select-none grid justify-center place-items-center";
    const input =
        "h-8 w-72 border-b-2 text-lg focus:outline-none transition-all bg-transparent text-center";

    onMount(() => {
        const cookie_value = document.cookie
            .split("; ")
            .find((row) => row.startsWith("sessionId="))
            ?.split("=")[1];

        if (!cookie_value) {
            goto("/");
        }

        mode = "SET";

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
            handleDatabaseSync();
            tasks = [...tasks];
        }
    }

    function createPopUp() {
        popUp = true;
        popUpWidth = `${i}%`;
        popUpHeight = `${i}%`;
        scale = `0.${i + 19}`;
        console.log(i);
        setTimeout(function () {
            i++;
            if (i < 81) {
                createPopUp();
            }
            if (i === 10) {
                displayElements = "visible";
            }
        }, 1);
    }

    const closePopUp = () => {
        popUpWidth = `${i}%`;
        popUpHeight = `${i}%`;
        scale = `0.${i + 19}`;
        setTimeout(function () {
            i--;
            if (i > 0) {
                closePopUp();
            }
            if (i === 10) {
                displayElements = "hidden";
                popUp = false;
            }
        }, 1);
    };

    const handleDatabaseSync = async () => {
        let listActual = Array.from(tasks);
        listActual = JSON.stringify(listActual);

        // let data = {
        //     listActual,
        //     mode,
        // };

        // try {
        //     const response = await fetch("/api/cryptoProvidersForTodayTasks/", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(data),
        //     });

        //     if (response.ok) {
        //         const responseData = await response.json();

        //         if (mode === "GET") {
        //             if (responseData.decryptedMessage !== undefined) {
        //                 const toBeSwapped = JSON.parse(
        //                     responseData.decryptedMessage,
        //                 );
        //                 tasks = toBeSwapped;
        //                 tasks = [...tasks];
        //             }

        //             mode = "SET";
        //         }
        //     }
        // } catch (error) {
        //     console.error("Error:", error);
        // }

        return 0;
    };
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
                            class="p-1 rounded absolute left-16 right-4 grid justify-center place-items-center"
                            style="top: {task.task.start}px; height: {task.task
                                .duration}px; background-color: {task.task
                                .backgroundColor}; color: {task.task.textColor}"
                        >
                            <p
                                class="font-basic text-xl absolute top-4 left-4"
                                style="color: {task.task.textColor};"
                            >
                                {task.task.title}
                            </p>
                            <p
                                class="font-basic text-xl absolute top-4 right-4"
                                style="color: {task.task.textColor};"
                            >
                                {task.task.startHour} - {task.task.endHour}
                            </p>
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
                            {#if popUp}
                                <div
                                    class="absolute left-0 right-0 top-0 bottom-0 mt-auto ml-auto mr-auto mb-auto z-10 bg-background rounded-2xl shadow-xl border-2 border-gray-500"
                                    style="width: {popUpWidth}; height: {popUpHeight}"
                                >
                                    <div
                                        style="visibility: {displayElements};"
                                        class="w-full h-full"
                                    >
                                        <div
                                            class="grid justify-center place-items-center w-full h-full"
                                            style="scale: {scale};"
                                        >
                                            <button
                                                class="absolute top-3 right-3"
                                                on:click={closePopUp}
                                            >
                                                <svg
                                                    width="46"
                                                    height="46"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="1"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M18 6 6 18"></path>
                                                    <path d="m6 6 12 12"></path>
                                                </svg>
                                            </button>
                                            <p class="text-4xl mb-0">Title</p>
                                            <textarea class="bg-red-400"
                                                >{descriptionActual}</textarea
                                            >
                                        </div>
                                    </div>
                                </div>
                            {/if}
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
                                    on:click={createPopUp}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
{/if}
