<script>
    import Banner from "$lib/components/banner.svelte";
    import Notification from "$lib/components/notification.svelte";
    import DisplayTasks from "$lib/components/displayTasks.svelte";
    import { onMount } from "svelte";
    import { scale, crossfade } from 'svelte/transition';

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = null;
    let isModalOpen = false;
    let calendarDays;
    
    const months = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    function getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    function getFirstDayOfMonth(month, year) {
        let day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    }

    function generateCalendarDays() {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        for (let i = 0; i < 7 - (new Date(currentYear, currentMonth + 1, days[days.length - 1]).getDay()); i++) {
            days.push(null);
        }

        return days;
    }

    $: {
        currentMonth;
        currentYear;
        calendarDays = generateCalendarDays();
    }

    function handleDayClick(day) {
        if (day !== null) {
            selectedDate = new Date(currentYear, currentMonth, day + 1);
            isModalOpen = true;
        }
    }

    function closeModal() {
        isModalOpen = false;
        selectedDate = null;
    }

    function previousMonth() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
    }

    function nextMonth() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
    }

    onMount(() => {
        const cookie_value = document.cookie
            .split("; ")
            .find((row) => row.startsWith("sessionId="))
            ?.split("=")[1];

        if (!cookie_value) {
            goto("/");
        }
    }); 
    
    const animationDuration = 200;

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
</script>

<style>
    .calendar-tasks-backdrop {
        backdrop-filter: blur(5px);
        background-color: rgba(17, 24, 39, 0.4);
    }
</style>

<Notification />

{#if selectedDate && isModalOpen}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div 
        class="absolute z-50 flex justify-center place-items-center w-screen h-screen calendar-tasks-backdrop" 
        on:click|self={closeModal}
        in:receive={{key: 'calendar-tasks'}}
        out:send={{key: 'calendar-tasks'}}
    >
        <div 
            transition:scale={{
                duration: animationDuration,
                start: 0,
                opacity: 1
            }}
            class="scale-90 w-full h-full flex justify-center place-items-center"
            on:click|self={closeModal}
        >
            <DisplayTasks date={selectedDate}/>
        </div>
    </div>
{/if}

<body class="h-screen flex flex-col absolute z-20">
    <div class="row-start-1 z-40">
        <Banner />
    </div>

    <div class="w-screen h-[calc(100vh-4rem)] max-h-full p-6 flex justify-center">
        <div class="w-full shadow-xl p-6 flex flex-col h-full border-gray-500 border-2 rounded-lg">
            <div class="text-center mb-4 flex justify-center items-center gap-4">
                <button 
                    class="p-2 rounded-lg hover:bg-secondary hover:text-white transition-all"
                    on:click={previousMonth}
                >
                    <svg width="46" height="46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="h-9">
                        <path d="M12 15v3.586a1 1 0 0 1-1.707.707l-6.586-6.586a1 1 0 0 1 0-1.414l6.586-6.586A1 1 0 0 1 12 5.414V9h6v6h-6v0Z"></path>
                        <path d="M21 15V9"></path>
                  </svg>
                </button>
                <h2 class="text-2xl font-bold">
                    {months[currentMonth]} {currentYear}
                </h2>
                <button 
                    class="p-2 rounded-lg hover:bg-secondary hover:text-white transition-all"
                    on:click={nextMonth}
                >
                    <svg width="46" height="46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="h-9">
                        <path d="M12 9V5.414a1 1 0 0 1 1.707-.707l6.586 6.586a1 1 0 0 1 0 1.414l-6.586 6.586A.999.999 0 0 1 12 18.586V15H6V9h6v0Z"></path>
                        <path d="M3 9v6"></path>
                  </svg>
                </button>
            </div>
            
            <div class="grid grid-cols-7 gap-2 grow h-full">
                {#each weekDays as day}
                    <div class="flex items-center justify-center text-base text-center font-semibold p-2 border-gray-200 border-2 rounded-lg">
                        {day}
                    </div>
                {/each}
                
                {#each calendarDays as day}
                    <button 
                        class="h-full grow text-center p-4 border-gray-200 border-2 flex items-center justify-center rounded-lg transition-all
                        {day === currentDate.getDate() && currentMonth === currentDate.getMonth() ? 'bg-accent ' : ''}
                        {day !== null ? 'hover:bg-secondary hover:text-white cursor-pointer' : 'cursor-default'}"
                        on:click={() => handleDayClick(day)}
                    >
                        {day !== null ? day : ''}
                    </button>
                {/each}
            </div>
        </div>
    </div>
</body>
