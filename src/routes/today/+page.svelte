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
    let scale = 0.0;
    let descriptionActual = "";

    const taskProvider = new TasksProvider();
    const date = new Date();

    const label =
        "text-3xl text-third m-3 relative transition-all select-none grid justify-center place-items-center relative left-0 right-0 ml-auto mr-auto";
    const input =
        "border-b-2 text-lg focus:outline-none transition-all bg-transparent text-center mt-2 relative left-0 right-0 ml-auto mr-auto";

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

    const createPopUp = () => {
        scale = `0.${i + 19}`;
        setTimeout(function () {
            i++;
            if (i < 81) {
                createPopUp();
            }
            if (i === 1) {
                displayElements = "visible";
                popUp = true;
            }
        }, 1);
    }

    const closePopUp = () => {
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
{#if popUp}
    <div
        class="absolute left-0 right-0 top-0 bottom-0 mt-auto ml-auto mr-auto mb-auto z-10 bg-background rounded-2xl shadow-xl border-2 border-gray-500 w-3/5 h-3/5"
        style="scale: {scale};"
    >
        <div
            style="visibility: {displayElements};"
            class="w-full h-full"
        >
            <div
                class="grid justify-center place-items-center w-full h-full"
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
                                .backgroundColor}; color: {task.task.textColor}; min-height: 60px;"
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
                    class="col-start-2 row-start-1 w-full h-full grid grid-cols-1"
                >
                    <!-- Actual details LOL -->
                    <div class="w-full h-full">
                        <form
                            on:submit|preventDefault={createTask}
                            class="h-full w-full relative -top-3 rounded-r-md rounded-br-md"
                        >
                            <!-- Title -->
                            <div class="relative left-8 top-3 w-fit">
                                <div class="{label}">
                                    <label for="title"> Title </label>
                                    <input
                                        type="text"
                                        class="{input}"
                                        id="title"
                                        placeholder="Here goes your title"
                                        bind:value={taskName}
                                        required
                                        maxlength="20"
                                    />
                                </div>
                            </div>
                            <div class="w-fit h-fit absolute top-0 right-8 p-0">
                                <div class="{label} w-fit h-fit grid grid-cols-2 p-0 gap-4">
                                    <div class="grid grid-rows-2 text-center">
                                        <label for="start">
                                            Start time
                                        </label>
                                        <input
                                            type="time"
                                            class={input}
                                            id="start"
                                            bind:value={taskStart}
                                        />
                                    </div>
                                    <div class="grid grid-rows-2 text-center">
                                        <label for="end">
                                            Ending time
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
                            <div class="w-fit h-fit absolute bottom-3 left-8 p-0">
                                <div class="{label} w-fit h-fit grid grid-cols-3 p-0">
                                    <div class="grid grid-rows-2">
                                        <label for="color" class="text-center">
                                            Background color
                                        </label>
                                        <input
                                            type="color"
                                            class="{input} w-4 h-4 rounded-full border-none"
                                            id="color"
                                            placeholder="Here goes your title"
                                            bind:value={taskColor}
                                        />
                                    </div>
                                    <div class="grid grid-rows-2 relative">
                                        <label for="colorText" class="text-center">
                                            Text color
                                        </label>
                                        <input
                                            type="color"
                                            class="{input} w-4 h-4 rounded-full border-none"
                                            id="colorText"
                                            placeholder="Here goes your title"
                                            bind:value={taskText}
                                        />
                                    </div>
                                </div>
                            </div>
                            <!-- Description -->
                            <div class="w-full h-2/3 relative top-12">
                                <div class="text-3xl text-third m-3 transition-all select-none ml-auto mr-auto w-full h-full text-center">
                                    <label for="description" class="relative">
                                        Description
                                    </label>
                                    <div class="w-full h-full p-4">
                                        <textarea
                                        id="description"
                                        type="text"
                                        class="border-2 rounded-md w-full h-full box-border text-lg"
                                        placeholder="Here goes description"
                                        bind:value={taskDescription}
                                    ></textarea>
                                    </div>
                                </div>
                            </div>
                            <!-- Controls -->
                            <div class="absolute right-8 bottom-8">
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
                </div>
            </div>
        </div>
    </body>
{/if}
