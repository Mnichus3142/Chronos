<script>
    import Notification from "$lib/components/notification.svelte";
    import { createNotification } from "$lib/functions/createNotification.js";

    let login;
    let bugMessage = '';

    const getLogin = async () => {
        const response = await fetch("/api/getLogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const json = await response.json();
        login = json.message;
    }

    getLogin();

    const submitBug = async () => {
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: login, message: bugMessage })
            });

            const result = await response.json();
            if (result.success) {
                bugMessage = '';
                createNotification("Feedback sent successfully", "info");
            } else {
                createNotification(result.error, "error");
            }
        } catch (error) {
            createNotification(error, "error");
        }
    }
</script>

<div class="flex flex-col justify-center place-items-center text-2xl font-basic">
    <p class="text-3xl mb-4">Feedback report</p>
    
    <textarea class="w-full h-96 border-2 border-gray-500 p-2 resize-none rounded-lg bg-background" placeholder="Describe your problem here..." bind:value={bugMessage}></textarea>

    <button on:click={submitBug} class="mt-4 border-2 border-gray-500 p-2 rounded-lg hover:bg-accent hover:text-white hover:border-accent transition-all flex">
        <svg width="34" height="34" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="mr-2">
            <path d="M10 14 21 3"></path>
            <path d="m21 3-6.5 18a.55.55 0 0 1-1 0L10 14l-7-3.5a.55.55 0 0 1 0-1L21 3Z"></path>
        </svg>
        Send report
    </button>
</div>