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
</script>

<Notification></Notification>
<body class="h-screen flex flex-col">
    <div class="row-start-1 z-40">
        <Banner></Banner>
    </div>

    <div class="flex-1 w-screen max-h-full p-6">
        <DisplayTasks date={new Date()}></DisplayTasks>
    </div>
</body>