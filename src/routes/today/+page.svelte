<script>
    import Banner from "$lib/components/banner.svelte";
    import { onMount } from "svelte";
    import Notification from "$lib/components/notification.svelte";
    import DisplayTasks from "../../lib/components/displayTasks.svelte";    

    onMount(() => {
        const cookie_value = document.cookie
            .split("; ")
            .find((row) => row.startsWith("sessionId="))
            ?.split("=")[1];

        if (!cookie_value) {
            goto("/");
        }
    });

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let day = currentDate.getDate();
</script>

<Notification></Notification>
<body class="h-screen flex flex-col bg-background">
    <div class="row-start-1 z-40">
        <Banner></Banner>
    </div>

    <div class="flex-1 w-screen h-[85vh] p-6">
        <DisplayTasks date={new Date(currentYear, currentMonth, day + 1)}></DisplayTasks>
    </div>
</body>