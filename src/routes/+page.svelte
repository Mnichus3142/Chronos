<script>
    import Banner from '$lib/components/banner.svelte'
    import { onMount, onDestroy } from 'svelte'
    import { clickOutside } from '$lib/functions/clickOutside.js'

    /** @type {import('./$types').ActionData} */
	export let form;

    let load = false

    let alert = false
    let alertMessage = ""

    let width
    let slide = "0px"
    let element
    let resizeObserver

    let username = ""
    let password = ""
    let passwordRegister = ""
    let passwordRegisterConfirm = ""

    let usrLabel = "40px"
    let passLabel = "40px"
    let passLabelRegister = "40px"
    let passLabelRegisterConfirm = "40px"

    const underlineColor = "#14A684"

    let usrUnderline = "grey"
    let passUnderline = "grey"
    let passRegisterUnderline = "grey"
    let passRegisterConfirmUnderline = "grey"

    let state = "login"

    let visibilityLogin = "visible"
    let visibilityRegister = "hidden"

    onMount(() => {
        if (document.readyState === 'complete') 
        {
            initPage()
        } 

        else 
        {
            window.addEventListener('load', initPage)
        }
        
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

    $: if (username)
    {
        moveLabel("usr")
    }

    $: if (password)
    {
        moveLabel("pass")
    }

    $: if (passwordRegister)
    {
        moveLabel("passRegister")
    }

    $: if (passwordRegisterConfirm)
    {
        moveLabel("passRegisterConfirm")
    }

    function initPage() {
      load = true
    }

    function slider()
    {
        if (slide == "0px")
        {
            slide = "-" + width + "px"
            visibilityLogin = "hidden"
            visibilityRegister = "visible"
            state = "register"
        }

        else 
        {
            slide = "0px"
            visibilityLogin = "visible"
            visibilityRegister = "hidden"
            state = "login"
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

        if (field == "passRegister")
        {
            passLabelRegister = "0px"
            passRegisterUnderline = underlineColor
        }

        if (field == "passRegisterConfirm")
        {
            passLabelRegisterConfirm = "0px"
            passRegisterConfirmUnderline = underlineColor
        }
    }

    function resetLabels ()
    {
        if (username == "")
        {
            usrLabel = "40px"
            usrUnderline = "grey"
        }
        
        if (password == "")
        {
            passLabel = "40px"
            passUnderline = "grey"
        }

        if (passwordRegister == "")
        {
            passLabelRegister = "40px"
            passRegisterUnderline = "grey"
        }

        if (passwordRegisterConfirm == "")
        {
            passLabelRegisterConfirm = "40px"
            passRegisterConfirmUnderline = "grey"
        }
    }

    function error(message)
    {
        alert = true
        alertMessage = message
    }

    function resetError ()
    {
        alert = false
        alertMessage = ""
    }

    async function sha256(message) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    const handleLogin = async (event) =>
    {
        event.preventDefault()

        if (username != "" && password != "")
        {
            const hashed = await sha256(password)
            const user = username.toLowerCase()

            const formData = {
                user,
                hashed
            }

            try {
                const response = await fetch('/api/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
            } 
            
            catch (error) {
                console.error('Error:', error)
            }

            return 0
        }

        error("Username and/or password is empty")
    }

    const handleRegister = async (event) =>
    {
        if (username != "" && passwordRegister != "" && passwordRegisterConfirm != "")
        {
            if (passwordRegister === passwordRegisterConfirm)
            {
                const hashed = await sha256(passwordRegister)
                const user = username.toLowerCase()

                const formData = {
                    user,
                    hashed
                }

                try {
                    const response = await fetch('/api/register/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    })

                    if (response.ok) 
                    {
                        const responseData = await response.json()
                        error(responseData.message)
                    } 
                    else 
                    {
                        error(`Error: ${response.status} - ${response.message}`)
                    }
                } 
                
                catch (error) {
                    console.error('Error:', error)
                }

                return 0
            }

            error("Passwords do not match")

            return 0
        }

        error("Username and/or password is empty")
    }
</script>

<body>
    {#if load}
        <Banner></Banner>
        {#if alert}
            <div class="alert"  use:clickOutside on:click_outside={resetError}>
                {alertMessage}
                <br>
                <p style="font-size: 20px; color: #FFEDCB; margin-top: 10px;">
                    Click outside to close
                </p>
            </div>
        {/if}
        <div class="content">
            <div class="formBackground">
                <div class="container login">
                    <form class="form" style="--visibilityLogin: {visibilityLogin}">
                        <p>User Login</p>

                        <label for="username" style="--labelPosition: {usrLabel}">
                            <svg width="46" height="46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
                                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                            </svg>
                            Username
                        </label>
                        <input type="text" style="--underlineColor: {usrUnderline}" bind:value={username} id="username" on:click={() => moveLabel("usr")} use:clickOutside on:click_outside={resetLabels} name="username">

                        <label for="password" style="--labelPosition: {passLabel}">
                            <svg width="46" height="46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="left: -3px;">
                                <path d="M17 11H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2Z"></path>
                                <path d="M12 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
                                <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
                            </svg>
                            Password
                        </label>
                        <input type="password" style="--underlineColor: {passUnderline}" bind:value={password} id="password" on:click={() => moveLabel("pass")} use:clickOutside on:click_outside={resetLabels} name="password">

                        <button style="--underlineColor: {underlineColor}" on:click={handleLogin}>
                            <div>Submit</div>
                        </button>

                        {#if form?.alert}
                            <div class="alert">
                                {form?.message}
                            </div>
                        {/if}
                    </form>
                </div>

                <div class="container register">
                    <form class="form" style="--visibilityRegister: {visibilityRegister}">
                        <p>Register</p>

                        <label for="username" style="--labelPosition: {usrLabel}">
                            <svg width="46" height="46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
                                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                            </svg>
                            Username
                        </label>
                        <input type="text" style="--underlineColor: {usrUnderline}" bind:value={username} id="username" on:click={() => moveLabel("usr")} use:clickOutside on:click_outside={resetLabels} name="username">

                        <label for="passwordRegister" style="--labelPosition: {passLabelRegister}">
                            <svg width="46" height="46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="left: -3px;">
                                <path d="M17 11H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2Z"></path>
                                <path d="M12 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
                                <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
                            </svg>
                            Password
                        </label>
                        <input type="password" style="--underlineColor: {passRegisterUnderline}" bind:value={passwordRegister} id="passwordRegister" on:click={() => moveLabel("passRegister")} use:clickOutside on:click_outside={resetLabels} name="password">

                        <label for="passwordRegisterConfirm" style="--labelPosition: {passLabelRegisterConfirm}; left: -32px;">
                            <svg width="46" height="46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="left: -3px;">
                                <path d="M17 11H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2Z"></path>
                                <path d="M12 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
                                <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
                            </svg>
                            Confirm password
                        </label>
                        <input type="password" style="--underlineColor: {passRegisterConfirmUnderline}" bind:value={passwordRegisterConfirm} id="passwordRegisterConfirm" on:click={() => moveLabel("passRegisterConfirm")} use:clickOutside on:click_outside={resetLabels} name="passwordConfirmation">

                        <button style="--underlineColor: {underlineColor}" on:click={handleRegister}>
                            <div>Submit</div>
                        </button>
                    </form>
                </div>

                <div class="curtain" style="--slide: {slide}" bind:clientWidth={width} bind:this={element}>
                    {#if state == "login"}
                        <p>Do you want to register?</p>
                        <p class="paragraph">You will get access to many interesting features, and the registration process will only take a moment. Click the button below</p>
                        <button on:click={slider} style="--underlineColor: {underlineColor}">
                            I want to register!
                        </button>
                    {:else}
                        <p>Or maybe you already have an account?</p>
                        <p class="paragraph">Click the button below to go to login page, and get access to your acconunt in just a while</p>
                        <button on:click={slider} style="--underlineColor: {underlineColor}" class="loginEncourager">
                            I want to log in!
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
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

    .login form
    {
        visibility: var(--visibilityLogin);
    }

    .alert
    {
        font-family: 'Rubik', sans-serif;
        font-size: 30px;

        text-align: center;

        border-radius: 10px;
        background: linear-gradient(
            to bottom,
            var(--3),
            var(--2)
        );

        color: white;

        width: 300px;
        height: 200px;
        padding: 10px;

        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        z-index: 5;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        animation: alert 1s;
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

        color: var(--underlineColor);

        position: relative;
        top: var(--labelPosition);
        left: -80px;

        transition: all 0.1s;
    }

    .form label svg
    {
        color: var(--underlineColor);
        position: relative;
        top: 5px;
        height: 30px;
    }

    .form input
    {
        z-index: 2;

        border: none;
        height: 35px;
        width: 300px;

        border-bottom: 2px solid var(--underlineColor);

        font-family: 'Rubik', sans-serif;
        font-size: 20px;

        cursor: text;

        background: none;
    }

    .form input:focus
    {
        outline: none;
    }

    .form button
    {
        margin-top: 40px;
        padding: 10px;
        padding-top: 0px;
        padding-bottom: 3px;

        background: none;
        border: 2px solid grey;
        border-radius: 10px;

        cursor: pointer;

        color: grey;

        transition: all 0.1s ease;
    }

    .form button::before
    {
        content: '';
        background-color: white;
        height: 5px;
        width: 15px;

        display: block;

        position: relative;
        top: -3px;

        transition: all 0.2s ease;
    }

    .form button::after
    {
        content: '';
        background-color: white;
        height: 5px;
        width: 15px;

        display: block;

        position: relative;
        top: 44px;
        left: 67px;

        transition: all 0.2s ease;
    }

    .form button:hover
    {
        color: var(--underlineColor);
        transform: scale(110%);
        border-color: var(--underlineColor);
    }

    .form button:hover::before
    {
        transform: translateX(67px);
    }

    .form button:hover::after
    {
        transform: translateX(-67px);
    }

    .form button div
    {
        float: right;

        font-size: 20px;
        margin: 10px;

        position: relative;
        top: var(--labelPosition);

        transition: all 0.1s;
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
        z-index: 3;

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

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .curtain p
    {
        color: white;
        font-family: 'Rubik', sans-serif;
        font-size: 45px;

        text-align: center;
    }

    .curtain .paragraph
    {
        font-size: 20px;
        color: var(--4);
        text-align: center;

        width: 500px;

        margin-top: 20px;
    }

    .curtain button
    {
        background: none;
        border: 2px solid var(--4);
        border-radius: 10px;

        color: var(--4);
        padding: 10px;

        cursor: pointer;

        position: relative;
        top: 85px;

        transform: scale(140%);
        transition: all 0.1s ease;
    }

    .curtain button:hover
    {
        background-color: var(--underlineColor);
        border-color: var(--underlineColor);
        color: white;
    }

    .loginEncourager
    {
        margin-top: -20px;
    }

    .register form
    {
        visibility: var(--visibilityRegister);
    }

    @keyframes alert 
    {
        0%
        {
            transform: scale(100%);
        }

        20%
        {
            transform: scale(120%);
        }

        40% 
        {
            transform: scale(100%);
        }
        
        60%
        {
            transform: scale(120%);
        }

        80%
        {
            transform: scale(100%);
        }
    }
</style>