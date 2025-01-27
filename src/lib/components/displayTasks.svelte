<script>
    import { onMount } from "svelte";
    import { TasksProvider } from "$lib/classes/TasksProvider.js";
    import { createNotification } from "$lib/functions/createNotification.js";
    import Confirmation from "$lib/components/confirmation.svelte";
    import Loader from "./loader.svelte";

    export let date;
    
    let showConfirmation = false;
    let result = null;
    let load = false;
    let scrollTo = true;

    let timeArr = [];
    let tasks = [];

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
    let currentTime;
    let timelineContainer;

    const taskProvider = new TasksProvider();

    const label =
        "text-2xl text-third m-3 relative transition-all select-none grid justify-center place-items-center relative left-0 right-0 ml-auto mr-auto";
    const input =
        "border-b-2 text-lg focus:outline-none transition-all bg-transparent text-center mt-2 relative left-0 right-0 ml-auto mr-auto";

    $: columnCount = tasks.length > 0 ? tasks[0].columnCount : 1;

    onMount(() => {
        createTimeTable("24");
        handleDatabaseSync();

        const updateCurrentTime = () => {
            const [hours, minutes] = date.toDateString().split(":").map(Number);
            const pixelHours = date.getHours() * 112 + 8 + date.getMinutes() * (9.3 / 5) + 25;

            currentTime = pixelHours;
        };
        
        updateCurrentTime();
        const interval = setInterval(updateCurrentTime, 30000);
    });

    $: if (load && scrollTo)
    {
        setTimeout(() => {
            const scrollPosition = currentTime - (timelineContainer.clientHeight / 2);
            timelineContainer.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        }, 10);

        scrollTo = false;
    }

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
                                toBeSwapped[i].task.completed
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

{#if load}
    <div
        class="flex-1 grid justify-center place-items-center border-gray-500 border-2 rounded-lg grid-cols-[2fr_5fr] grid-rows-1"
    >
        <!-- Timeline Container -->
        <div
            bind:this={timelineContainer}
            class="col-start-2 row-start-1 w-full max-h-[85vh] overflow-x-auto overflow-y-scroll p-2 relative scrollbar scrollbar-thumb-third scrollbar-track-transparent"
        >
            <div class="relative" style="min-width: calc(200px * {columnCount} + 60px)">
                <!-- Red timelinne -->
                <div 
                    class="absolute w-full border-t-2 border-red-500 z-10"
                    style="top: calc({currentTime}px - 8px);"
                ></div>

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
                        class="p-1 rounded absolute grid justify-center place-items-center shadow-lg hover:scale-105
                        transition"
                        style="top: calc({task.task.start}px - 8px); 
                                height: {task.task.duration}px; 
                                background-color: {task.task.backgroundColor}; 
                                color: {task.task.textColor}; 
                                min-height: 60px;
                                left: calc(60px + {task.column} * 200px);
                                width: calc(200px - 8px);
                                filter: {task.task.completed ? 'opacity(50%)' : 'none'};"
                        on:click={() => viewTask(task.id)}
                        bind:clientHeight={task.height}
                    >
                        <!-- Checkbox completed -->
                        <div 
                            class="absolute top-2 right-2 z-20"
                        >
                            <input
                                type="checkbox"
                                checked={task.task.completed}
                                class="w-4 h-4 cursor-pointer absolute top-3 right-1 border-4 border-red-500 rounded-md"
                                on:click|stopPropagation={() => { taskProvider.toggleTaskComplete(task.id); tasks = [...tasks]; handleDatabaseSync(); }}
                            />
                        </div>

                        {#if task.task.duration >= 80}
                            <p
                                class="font-basic text-lg absolute top-4 px-2"
                                style="color: {task.task.textColor};
                                        text-decoration: {task.task.completed ? 'line-through' : 'none'};"
                            >
                                {task.task.startHour} - {task.task.endHour}
                            </p>
                            <p
                                class="font-basic text-lg absolute top-14 px-2"
                                style="color: {task.task.textColor};
                                        text-decoration: {task.task.completed ? 'line-through' : 'none'};"
                            >
                                {task.task.title}
                            </p>
                            {#if task.task.duration >= 120}
                                <p
                                    class="font-basic text-sm absolute top-24 line-clamp-2 overflow-hidden px-2"
                                    style="color: {task.task.textColor};
                                        text-decoration: {task.task.completed ? 'line-through' : 'none'}
                                        display: -webkit-box;
                                        -webkit-box-orient: vertical;
                                        -webkit-line-clamp: {Math.floor((task.task.duration - 100) / 20)};"
                                >
                                    {task.task.description}
                                </p>
                            {/if}
                        {:else}
                            <p
                                class="font-basic text-lg px-2"
                                style="color: {task.task.textColor};
                                        text-decoration: {task.task.completed ? 'line-through' : 'none'};"
                            >
                                {task.task.title}
                            </p>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>

        <!-- Details -->
        <div
            class="col-start-1 row-start-1 w-full h-full grid grid-cols-1 border-r-2 border-gray-500"
        >
            <!-- Actual details LOL -->
            <div class="w-full h-full">
                <form
                    on:submit|preventDefault={createTask}
                    class="h-full w-full relative -top-3 rounded-r-md rounded-br-md"
                >
                    <!-- Title -->
                    <div class="relative left-4 top-3 w-fit">
                        <div class={label}>
                            <label for="title"> Title </label>
                            <input
                                disabled={!editMode}
                                type="text"
                                class="{input} top-3.5 cursor-text"
                                id="title"
                                placeholder="Here goes your title"
                                bind:value={taskName}
                                required
                                maxlength="20"
                            />
                        </div>
                    </div>
                    <div class="absolute top-0 right-4">
                        <div
                            class="grid grid-cols-2"
                        >
                            <div class="text-center">
                                <label for="start" class="{label}"> Start time </label>
                                <input
                                    disabled={!editMode}
                                    type="time"
                                    class="{input} cursor-pointer"
                                    id="start"
                                    bind:value={taskStart}
                                />
                            </div>
                            <div class="text-center">
                                <label for="end" class="{label}"> Ending time </label>
                                <input
                                    disabled={!editMode}
                                    type="time"
                                    class="{input} cursor-pointer"
                                    id="end"
                                    bind:value={taskEnd}
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        class="absolute bottom-24 -right-6"
                    >
                        <div
                            class="{label} w-fit h-fit grid grid-cols-2"
                        >
                            <div class="grid">
                                <label for="color" class="text-center">
                                    Background color
                                </label>
                                <input
                                    disabled={!editMode}
                                    type="color"
                                    class="{input} w-24 h-12 border-gray-500 border-2 cursor-pointer"
                                    id="color"
                                    bind:value={taskColor}
                                />
                            </div>
                            <div class="grid">
                                <label
                                    for="colorText"
                                    class="text-center"
                                >
                                    Text color
                                </label>
                                <input
                                    disabled={!editMode}
                                    type="color"
                                    class="{input} w-24 h-12 border-gray-500 border-2 cursor-pointer"
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
                        class="absolute bottom-6 grid grid-rows-1 grid-cols-3 gap-3 w-full p-3"
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
                                <p class="font-basic text-xl">
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
                                <p class="font-basic text-xl">
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
                                    <p class="font-basic text-xl">
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
                                <p class="font-basic text-xl">Add</p>
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
                                <p class="font-basic text-xl">
                                    Confirm
                                </p>
                            </button>
                        {/if}
                    </div>
                </form>
            </div>
        </div>
    </div>
{:else}
    <Loader></Loader>
{/if}

<style>
    input[type=color] {
    border-radius: 40px;
    overflow: hidden;
}

input[type=color]::-webkit-color-swatch {
  border: none;
  border-radius: 40px;
  padding: 0;
}

input[type=color]::-webkit-color-swatch-wrapper {
    border: none;
    border-radius: 40px;
    padding: 0;
}
</style>