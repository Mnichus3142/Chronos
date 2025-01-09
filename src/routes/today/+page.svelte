<script>
    import Banner from "$lib/components/banner.svelte";
    import { onMount } from "svelte";
    import { TasksProvider } from "$lib/classes/TasksProvider.js";
    import { fade } from "svelte/transition";
    import Notification from "$lib/components/notification.svelte";
    import { createNotification } from "$lib/functions/createNotification.js";
    import Confirmation from "$lib/components/confirmation.svelte";
    import Loader from "$lib/components/loader.svelte";

    let showConfirmation = false;
    let result = null;

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
    let showDetails = false;
    let editMode = true;
    let editId = 0;
    let removePrompt = true;

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

        createTimeTable("24");
        handleDatabaseSync();
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

    const viewTask = (id) => {
        const element = tasks.find((item) => item.id === id);
        editId = id;
        editMode = false;
        showDetails = true;
        taskName = element.task.title;
        taskStart = element.task.startHour;
        taskEnd = element.task.endHour;
        taskDescription = element.task.description;
        taskColor = element.task.backgroundColor;
        taskText = element.task.textColor;
    };

    const editTask = () => {
        editMode = !editMode;
        createNotification("Your task is now in edit mode", "info");
    };

    const handleEdit = () => {
        tasks = taskProvider.editTask(
            editId,
            taskName,
            taskDescription,
            taskStart,
            taskEnd,
            taskColor,
            taskText,
        );
        handleDatabaseSync();
        exitView();
        tasks = [...tasks];
    };

    const handleRemove = async () => {
        if (await handleOpenConfirmation()) {
            taskProvider.removeTask(editId);
            tasks = taskProvider.getTasks();
            handleDatabaseSync();
            exitView();
            tasks = [...tasks];
        }
    };

    const exitView = () => {
        editId = 0;
        showDetails = false;
        editMode = true;
        taskName = "";
        taskStart = "";
        taskEnd = "";
        taskDescription = "";
        taskColor = "#000000";
        taskText = "#ffffff";
    };

    const openConfirmation = () => {
        return new Promise((resolve) => {
            showConfirmation = true;

            function handleConfirm() {
                showConfirmation = false;
                resolve(true);
            }

            function handleCancel() {
                showConfirmation = false;
                resolve(false);
            }

            result = { handleConfirm, handleCancel };
        });
    };

    const handleOpenConfirmation = async () => {
        const userConfirmed = await openConfirmation();
        return userConfirmed;
    };

    const handleDatabaseSync = async () => {
        let listActual = Array.from(tasks);
        listActual = JSON.stringify(listActual);
        let day = date.toISOString();

        let data = {
            listActual,
            mode,
            day,
        };

        try {
            const response = await fetch("/api/cryptoProvidersForTodayTasks/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseData = await response.json();

                if (mode == "GET") {
                    if (responseData.decryptedMessage !== undefined) {
                        const toBeSwapped = JSON.parse(
                            responseData.decryptedMessage,
                        );
                        for (let i = 0; i < toBeSwapped.length; i++) {
                            taskProvider.addTask(
                                toBeSwapped[i].task.title,
                                toBeSwapped[i].task.description,
                                toBeSwapped[i].task.startHour,
                                toBeSwapped[i].task.endHour,
                                toBeSwapped[i].task.backgroundColor,
                                toBeSwapped[i].task.textColor,
                                toBeSwapped[i].date,
                            );
                        }

                        tasks = taskProvider.getTasks();
                        tasks = [...tasks];
                    }

                    mode = "SET";
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }

        load = true;
        return 0;
    };
</script>

{#if load}
    {#if showConfirmation}
        <div class="z-50">
            <Confirmation
                onConfirm={result.handleConfirm}
                onCancel={result.handleCancel}
            >
                <h1>Do you really want to delete this task?</h1>
                <p>This operation is irreversible.</p>
            </Confirmation>
        </div>
    {/if}
    <Notification></Notification>
    {#if removePrompt}
        <div></div>
    {/if}
    <body class="h-screen flex flex-col">
        <div class="row-start-1 z-40">
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
                        <button
                            class="p-1 rounded absolute left-16 right-4 grid justify-center place-items-center shadow-lg hover:scale-105
                            transition"
                            style="top: {task.task.start}px; height: {task.task
                                .duration}px; background-color: {task.task
                                .backgroundColor}; color: {task.task
                                .textColor}; min-height: 60px;"
                            on:click={() => viewTask(task.id)}
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
                        </button>
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
                                <div class={label}>
                                    <label for="title"> Title </label>
                                    <input
                                        disabled={!editMode}
                                        type="text"
                                        class={input}
                                        id="title"
                                        placeholder="Here goes your title"
                                        bind:value={taskName}
                                        required
                                        maxlength="20"
                                    />
                                </div>
                            </div>
                            <div class="w-fit h-fit absolute top-0 right-8 p-0">
                                <div
                                    class="{label} w-fit h-fit grid grid-cols-2 p-0 gap-4"
                                >
                                    <div class="grid grid-rows-2 text-center">
                                        <label for="start"> Start time </label>
                                        <input
                                            disabled={!editMode}
                                            type="time"
                                            class={input}
                                            id="start"
                                            bind:value={taskStart}
                                        />
                                    </div>
                                    <div class="grid grid-rows-2 text-center">
                                        <label for="end"> Ending time </label>
                                        <input
                                            disabled={!editMode}
                                            type="time"
                                            class={input}
                                            id="end"
                                            bind:value={taskEnd}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                class="w-fit h-fit absolute bottom-3 left-8 p-0"
                            >
                                <div
                                    class="{label} w-fit h-fit grid grid-cols-3 p-0"
                                >
                                    <div class="grid grid-rows-2">
                                        <label for="color" class="text-center">
                                            Background color
                                        </label>
                                        <input
                                            disabled={!editMode}
                                            type="color"
                                            class="{input} w-24 h-12 rounded-full border-gray-500 border-2 p-0 m-0"
                                            id="color"
                                            bind:value={taskColor}
                                        />
                                    </div>
                                    <div class="grid grid-rows-2 relative">
                                        <label
                                            for="colorText"
                                            class="text-center"
                                        >
                                            Text color
                                        </label>
                                        <input
                                            disabled={!editMode}
                                            type="color"
                                            class="{input} w-24 h-12 rounded-full border-gray-500 border-2 p-0"
                                            id="colorText"
                                            bind:value={taskText}
                                        />
                                    </div>
                                </div>
                            </div>
                            <!-- Description -->
                            <div class="w-full h-2/3 relative top-12">
                                <div
                                    class="text-3xl text-third m-3 transition-all select-none ml-auto mr-auto w-full h-full text-center"
                                >
                                    <label for="description" class="relative">
                                        Description
                                    </label>
                                    <div class="w-full h-5/6 p-4">
                                        <textarea
                                            disabled={!editMode}
                                            id="description"
                                            type="text"
                                            class="border-2 rounded-md w-full h-full box-border text-lg resize-none p-3"
                                            placeholder="Here goes description"
                                            bind:value={taskDescription}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <!-- Controls -->
                            <div
                                class="absolute right-8 bottom-8 grid grid-rows-1 grid-cols-3 gap-4"
                            >
                                {#if showDetails}
                                    <button
                                        type="button"
                                        class="bg-red-500 pr-3 text-textColor h-12 col-start-1 grid grid-cols-2 grid-rows-1 place-items-center justify-center rounded-xl shadow-xl hover:scale-110 transition"
                                        on:click={handleRemove}
                                    >
                                        <svg
                                            width="28"
                                            height="28"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="1"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M4 7h16"></path>
                                            <path d="M10 11v6"></path>
                                            <path d="M14 11v6"></path>
                                            <path
                                                d="m5 7 1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12"
                                            ></path>
                                            <path
                                                d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
                                            ></path>
                                        </svg>
                                        <p class="font-basic text-2xl">
                                            Remove
                                        </p>
                                    </button>

                                    <button
                                        type="button"
                                        class="bg-red-600 pr-3 text-textColor h-12 row-start-1 col-start-2 grid grid-cols-2 grid-rows-1 place-items-center justify-center rounded-xl shadow-xl hover:scale-110 transition"
                                        on:click={exitView}
                                    >
                                        <svg
                                            width="28"
                                            height="28"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="1"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
                                            ></path>
                                            <path d="m5.7 5.703 12.6 12.6"
                                            ></path>
                                        </svg>
                                        <p class="font-basic text-2xl">
                                            Cancel
                                        </p>
                                    </button>

                                    {#if !editMode}
                                        <button
                                            type="button"
                                            class="bg-orange-500 pr-3 text-textColor h-12 col-start-3 grid grid-cols-2 grid-rows-1 place-items-center justify-center rounded-xl shadow-xl hover:scale-110 transition"
                                            on:click={editTask}
                                        >
                                            <svg
                                                width="28"
                                                height="28"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="1"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3"
                                                ></path>
                                                <path
                                                    d="M9 14.996h3l8.5-8.5a2.121 2.121 0 0 0-3-3l-8.5 8.5v3Z"
                                                ></path>
                                                <path d="m16 5 3 3"></path>
                                            </svg>
                                            <p class="font-basic text-2xl">
                                                Edit
                                            </p>
                                        </button>
                                    {/if}
                                {/if}

                                {#if editMode && !showDetails}
                                    <button
                                        type="submit"
                                        class="bg-green-500 pr-3 text-textColor h-12 col-start-3 grid grid-cols-2 grid-rows-1 place-items-center justify-center rounded-xl shadow-xl hover:scale-110 transition"
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
                                            <path
                                                d="m21.5 5.5-13.063 13L2.5 12.59"
                                            ></path>
                                        </svg>
                                        <p class="font-basic text-2xl">Add</p>
                                    </button>
                                {:else if editMode && showDetails}
                                    <button
                                        type="button"
                                        class="bg-green-500 pr-3 text-textColor h-12 col-start-3 grid grid-cols-2 grid-rows-1 place-items-center justify-center rounded-xl shadow-xl hover:scale-110 transition"
                                        on:click={handleEdit}
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
                                            <path
                                                d="m21.5 5.5-13.063 13L2.5 12.59"
                                            ></path>
                                        </svg>
                                        <p class="font-basic text-2xl">
                                            Confirm
                                        </p>
                                    </button>
                                {/if}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </body>
{:else}
    <Loader></Loader>
{/if}
