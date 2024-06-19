<script>
    import Banner from '$lib/components/banner.svelte'
    import { onMount, onDestroy } from 'svelte'

    let width
    let slide = "0px"
    let element
    let resizeObserver

    onMount(() => {
        resizeObserver = new ResizeObserver(dispatchResize)

        if (element) 
        {
            resizeObserver.observe(element)
        }
    })

    onDestroy(() => {
        if (resizeObserver && element) 
        {
            resizeObserver.unobserve(element)
        }
    })

    function slider()
    {
        if (slide == "0px")
        {
            slide = "-" + width + "px"
        }

        else 
        {
            slide = "0px"
        }
    }

    function dispatchResize (event) 
    {
        if (slide != '0px')
        {
            slide = "-" + width + "px"
        }
    }
</script>

<body>
    <Banner></Banner>
    <div class="content">
        <div class="formBackground">
            <div class="container login">
                <form class="form">
                    <h3>Login</h3>
                </form>
            </div>
            <div class="container register" id="register">
                <form class="form">
                    
                </form>
            </div>
            <div class="curtain" style="--slide: {slide}" bind:clientWidth={width} bind:this={element}>
                <button on:click={slider}>
                    Naduś
                </button>
            </div>
        </div>
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
        overflow-x: clip;
    }

    .form
    {
        font-family: 'Rubik', sans-serif;
        font-size: 30px;

        display: flex;
        justify-content: center;
        place-items: center;

        height: 60vh;
    }

    .content {
        background-color: var(--white);
        width: 100vw;
        height: calc(97.5vh - 60px);
        min-height: 700px;
    
        display: flex;
        justify-content: center;
        place-items: center;

        position: relative;
    }

    .formBackground
    {
        display: grid;
        grid-template-columns: repeat(2, 1fr);

        background: linear-gradient(
            to bottom,
            var(--2),
            var(--1)
        );

        width: fit-content;
        height: fit-content;
        padding: 10px;
        padding-bottom: 10px;

        border-radius: 10px;
    }

    .container 
    {
        background-color: white;
        height: 60vh;
        min-height: 600px;
        width: 30vw;
        min-width: 500px;
        
        border-radius: 10px;
    }

    .login
    {
        grid-column: 1;
        grid-row: 1;
    }

    .register
    {
        grid-column: 2;
        grid-row: 1;
        float: right;
    }

    .curtain
    {
        grid-column: 2;
        grid-row: 1;

        position: relative;
        left: var(--slide);

        height: 60vh;
        min-height: 600px;
        width: 30vw;
        min-width: 500px;

        background: linear-gradient(
            to bottom,
            var(--2),
            var(--1)
        );

        transition: left 0.1s ease;
    }
</style>