<script>
    import Banner from '$lib/components/banner.svelte'
    import LoginPage from '$lib/components/loginPage.svelte'
</script>

<body>
    <Banner></Banner>
    <div class="content">
        <LoginPage>

        </LoginPage>
    </div>
</body>

<style>
    *
    {
        margin: 0;
        padding: 0;
    }

    body
    {
        overflow-x: hidden;
    }

    .content {
        background-color: var(--white);
        width: 100vw;
        height: calc(97.5vh - 60px);
    
        display: flex;
        justify-content: center;
        place-items: center;
    }
</style>