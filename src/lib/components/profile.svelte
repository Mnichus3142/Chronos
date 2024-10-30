<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import "../../app.css";

    // Tailwind
    const button = "grid grid-cols-2 grid-rows-1 text-background";
    const svg = "col-start-1";
    const paragraph = "col-start-2 font-basic text-xl relative top-2";

    // Variables
    let isActive = false;
    let login = "";

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

    getRandomString();
    getLogin();
</script>

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
    <div
        class="fixed inset-0 w-screen h-screen bg-gray-900 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-10"
    >
        <div class="absolute right-0 w-80 h-screen bg-primary">
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
                        <button class={button}>
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
                            <p class="{paragraph} -left-[44px]">Dashboard</p>
                        </button>
                    </li>
                    <li class="mb-4">
                        <button class={button}>
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
                            <p class="{paragraph} -left-[50px]">Today tasks</p>
                        </button>
                    </li>
                    <li class="mb-4">
                        <button class={button}>
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
                        <button class={button}>
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
                class="grid grid-cols-2 grid-rows-1 absolute bottom-6 left-1/3 text-red-600 border-2 border-solid border-red-600 rounded-xl p-3 hover:scale-110 hover:bg-red-600 hover:text-background transition-all"
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
                    class="col-start-2 row-start-1 relative top-2 font-basic text-xl"
                >
                    Logout
                </p>
            </button>
        </div>
    </div>
{/if}
