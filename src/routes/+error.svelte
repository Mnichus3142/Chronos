<script>
    import { page } from "$app/stores";
    import logo from "$lib/img/error.png";
</script>

<div
    style="height: 100vh; display: flex; justify-content: center; place-items: center;"
>
    {#if $page.status === 500}
        <h1 style="width: 400px; margin-left: 20px;">
            {$page.status}: There was a problem while connecting to database
        </h1>
    {:else if $page.status === 404}
        <h1 style="width: 400px; margin-left: 20px;">
            {$page.status}: This is not the page you are looking for
        </h1>
    {/if}
</div>
