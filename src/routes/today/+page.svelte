<script>
    import Banner from "$lib/components/banner.svelte";
    import { onMount } from "svelte";
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

<body class="bg-background">
    <div class="w-screen h-[90vh] p-6">
        <DisplayTasks date={new Date(currentYear, currentMonth, day + 1)}></DisplayTasks>
    </div>
</body>