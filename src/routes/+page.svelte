<script>
    import Banner from '$lib/components/banner.svelte'
    import { onMount, onDestroy } from 'svelte'
    import {clickOutside} from '$lib/functions/clickOutside.js';

    let width
    let slide = "0px"
    let element
    let resizeObserver

    let username = ""
    let password = ""

    let usrLabel = "40px"
    let passLabel = "40px"

    let underlineColor = "#14A684"

    let usrUnderline = "grey"
    let passUnderline = "grey"

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

    function dispatchResize () 
    {
        if (slide != '0px')
        {
            slide = "-" + width + "px"
        }
    }

    function moveLabel (field)
    {
        if (field == "usr")
        {
            usrLabel = "0px"
            usrUnderline = underlineColor
        }

        if (field == "pass")
        {
            passLabel = "0px"
            passUnderline = underlineColor
        }
    }

    function resetLabels ()
    {
        usrLabel = "40px"
        usrUnderline = "grey"
        
        passLabel = "40px"
        passUnderline = "grey"
    }
</script>

<body>
    <Banner></Banner>
    <div class="content">
        <div class="formBackground">
            <div class="container login">
                <form class="form">
                    <p>Log in</p>

                    <label for="username" style="--labelPosition: {usrLabel}">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <object data="/svg/user.svg"></object>
                        Username
                    </label>
                    <input type="text" style="--underlineColor: {usrUnderline}" bind:value={username} id="username" on:click={() => moveLabel("usr")} use:clickOutside on:click_outside={resetLabels}>

                    <label for="password" style="--labelPosition: {passLabel}">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <object data="/svg/lock.svg"></object>
                        Password
                    </label>
                    <input type="password" style="--underlineColor: {passUnderline}" bind:value={password} id="password"on:click={() => moveLabel("pass")} use:clickOutside on:click_outside={resetLabels}>
                </form>
            </div>

            <div class="container register">
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
        font-size: 40px;

        color: #0D1B2A;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 0px;

        height: 60vh;
        min-height: 600px;
    }

    .form p
    {
        font-weight: bolder;
        margin-bottom: 40px;
    }

    .form label
    {
        font-size: 25px;
        margin: 10px;

        position: relative;
        top: var(--labelPosition);
        left: -80px;

        transition: all 0.1s;
    }

    .form label object
    {
        fill: #0D1B2A;
        position: relative;
        top: 5px;
        height: 30px;
    }

    .form input
    {
        border: none;
        height: 35px;
        width: 300px;

        border-bottom: 2px solid var(--underlineColor);

        font-family: 'Rubik', sans-serif;
        font-size: 20px;
    }

    .form input:focus
    {
        outline: none;
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