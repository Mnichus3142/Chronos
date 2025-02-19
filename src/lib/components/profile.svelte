<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import "../../app.css";
    import { createNotification } from "$lib/functions/createNotification.js";
    import Settings from "./settings.svelte";
    import { scale, slide, crossfade } from 'svelte/transition';

    const [send, receive] = crossfade({
        duration: 400,
        fallback(node, params) {
            return {
                duration: 400,
                css: t => `
                    backdrop-filter: blur(${t * 5}px);
                    background-opacity: ${t * 0.4};
                `
            };
        }
    });

    // Tailwind
    const button = "flex justify-center items-center gap-2";
    const svg = "col-start-1";
    const paragraph = "font-basic text-xl";

    // Variables
    let isActive = false;
    let login = "";

    // Settings
    let settingsEnabled = false;

    // Menu strings
    const strings = [
        "Where are we going",
        "What are we going to do now",
        "Where should we go",
        "What can we do for you",
        "What comes next",
        "What's your plan",
        "Ready for the next step",
        "What’s your next move",
        "What would you like to do",
    ];
    let actual;

    let canGoDashboard = true;
    let canGoTodayTasks = true;
    let canGoCalendar = true;

    onMount(() => {
        // Reset flags
        canGoDashboard = true;
        canGoTodayTasks = true;
        canGoCalendar = true;

        // Set appropriate flag based on current path
        if ($page.url.pathname === "/main") {
            canGoDashboard = false;
        } else if ($page.url.pathname === "/today") {
            canGoTodayTasks = false;
        } else if ($page.url.pathname === "/calendar") {
            canGoCalendar = false;
        }
    });

    $: {
        canGoDashboard = $page.url.pathname !== "/main";
        canGoTodayTasks = $page.url.pathname !== "/today";
        canGoCalendar = $page.url.pathname !== "/calendar";
    }

    const handleLogout = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const responseData = await response.json();

                if (responseData.status != 200) {
                    error(responseData.message, "login");
                } else {
                    goto("/");
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    async function getLogin() {
        const response = await fetch("/api/getLogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const json = await response.json();
        login = json.message;
    }

    function getRandomString() {
        const randomIndex = Math.floor(Math.random() * strings.length);
        actual = strings[randomIndex];
    }

    function handleButton() {
        isActive = !isActive;
        getRandomString();
    }

    function handleGoTo(where) {
        if (where == "dashboard" && canGoDashboard) {
            handleButton();
            goto("/main");
        } else if (where == "today" && canGoTodayTasks) {
            handleButton();
            goto("/today");
        } else if (where == "calendar" && canGoCalendar) {
            handleButton();
            goto("/calendar");
        } else {
            createNotification("You are already here", "info");
        }
    }

    function displaySettings () {
        settingsEnabled = true;
    }

    function hideSettings () {
        settingsEnabled = false;
    }

    let animationDuration = 200;

    getRandomString();
    getLogin();
</script>

<style>
    .menu-backdrop {
        backdrop-filter: blur(5px);
        background-color: rgba(17, 24, 39, 0.4);
    }

    .settings-backdrop {
        backdrop-filter: blur(5px);
        background-color: rgba(17, 24, 39, 0.4);
    }
</style>

{#if settingsEnabled}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div 
        class="fixed top-0 left-0 w-screen h-screen z-[70] settings-backdrop flex justify-center place-items-center"
        on:click|self={hideSettings}
        in:receive={{key: 'settings'}}
        out:send={{key: 'settings'}}
    >
        <div 
            transition:scale={{
                duration: animationDuration,
                start: 0,
                opacity: 1
            }}
            class="scale-90 flex justify-center place-items-center w-3/4 h-5/6"
            on:click|self={hideSettings}
        >
            <Settings />
        </div>
    </div>
{/if}

<div class="cursor-pointer">
    <button on:click={() => handleButton()}>
        <svg
            class="w-12 h-12 cursor-pointer transition-transform duration-100 ease-in-out z-50 relative"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 6h16"
                class="transition-transform duration-100 ease-in-out"
                class:-translate-y-0={isActive}
                class:translate-x-2={isActive}
                class:rotate-45={isActive}
            />
            <path
                d="M4 12h16"
                class="transition-opacity duration-100 ease-in-out"
                class:opacity-0={isActive}
            />
            <path
                d="M4 18h16"
                class="transition-transform duration-100 ease-in-out"
                class:translate-y-[8.5px]={isActive}
                class:-translate-x-[9px]={isActive}
                class:-rotate-45={isActive}
            />
        </svg>
    </button>
</div>

{#if isActive}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="fixed inset-0 w-screen h-screen flex justify-center items-center z-10 menu-backdrop" 
        on:click|self={handleButton}
        in:receive={{key: 'menu'}}
        out:send={{key: 'menu'}}
    >
        <div 
            class="absolute right-0 w-full md:w-80 h-screen bg-primary"
            transition:slide={{duration: 400, axis: 'x'}}
        >
            <div class="relative top-20 pl-6 w-80">
                <p class="font-basic text-6xl text-background">{actual}</p>
                <p
                    class="font-motto text-4xl text-mottoColor mt-2 break-words mb-28"
                >
                    {login}?
                </p>
            </div>
            <div class="relative pl-6">
                <ul>
                    <li class="mb-4">
                        <button
                            class={button}
                            on:click={() => handleGoTo("dashboard")}
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
                                class={svg}
                            >
                                <path d="M5 12H3l9-9 9 9h-2"></path>
                                <path
                                    d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"
                                ></path>
                                <path
                                    d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"
                                ></path>
                            </svg>
                            <p class="{paragraph}">Dashboard</p>
                        </button>
                    </li>
                    <li class="mb-4">
                        <button
                            class={button}
                            on:click={() => handleGoTo("today")}
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
                                class={svg}
                            >
                                <path
                                    d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
                                ></path>
                                <path
                                    d="M13 3h-2a2 2 0 1 0 0 4h2a2 2 0 1 0 0-4Z"
                                ></path>
                                <path d="M9 14h.01"></path>
                                <path d="M9 17h.01"></path>
                                <path d="m12 16 1 1 3-3"></path>
                            </svg>
                            <p class="{paragraph} -left-[50px]">Today&nbsp;tasks</p>
                        </button>
                    </li>
                    <li class="mb-4">
                        <button
                            class={button}
                            on:click={() => handleGoTo("calendar")}
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
                                class={svg}
                            >
                                <path
                                    d="M18 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"
                                ></path>
                                <path d="M16 3v4"></path>
                                <path d="M8 3v4"></path>
                                <path d="M4 11h16"></path>
                                <path d="M10 15H8v2h2v-2Z"></path>
                            </svg>
                            <p class="{paragraph} -left-6">Calendar</p>
                        </button>
                    </li>
                    <li class="mb-4">
                        <button class={button} on:click={displaySettings}>
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
                                class={svg}
                            >
                                <path
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.723 1.723 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 2.296.07 2.572-1.065Z"
                                ></path>
                                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                                ></path>
                            </svg>
                            <p class="{paragraph} -left-[18px]">Settings</p>
                        </button>
                    </li>
                </ul>
            </div>
            <button
                on:click={handleLogout}
                class="flex justify-center place-items-center gap-2 w-40 absolute bottom-6 left-1/3 text-red-600 border-2 border-solid border-red-600 rounded-xl p-3 hover:scale-110 hover:bg-red-600 hover:text-background transition-all"
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
                    class="col-start-1 row-start-1"
                >
                    <path
                        d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2"
                    ></path>
                    <path d="M21 12H7"></path>
                    <path d="m18 15 3-3-3-3"></path>
                </svg>
                <p
                    class="font-basic text-xl"
                >
                    Logout
                </p>
            </button>
        </div>
    </div>
{/if}
