<script>
    import { table } from "$lib/stores/notificationStore.js";

    let notifications;

    // Subscribe to store
    table.subscribe((value) => {
        notifications = value.notifications;
    });

    // Update store
    const updateNotifications = () => {
        table.subscribe((value) => {
            notifications = value.notifications;
        });
    };

    setInterval(() => {
        updateNotifications();
    }, 10);
</script>

<div class="w-96 fixed z-50 left-[40%] top-12">
    {#each notifications as item}
        <div class="animate-bounce">
            <div
                class="relative top-1 h-1 rounded-t-md"
                class:bg-green-500={item.type == "success"}
                class:bg-red-500={item.type == "error"}
                class:bg-blue-500={item.type == "info"}
                style="width: {item.width}%"
            ></div>
            <p
                class="w-full h-32 mb-8 text-black bg-background rounded-md shadow-md grid justify-center place-items-center"
            >
                {item.prompt}
            </p>
        </div>
    {/each}
</div>
