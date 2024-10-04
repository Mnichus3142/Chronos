 <script>
    import Banner from '$lib/components/banner.svelte'
    import { onMount, onDestroy } from 'svelte'
    import { clickOutside } from '$lib/functions/clickOutside.js'
    import { sha256 } from '$lib/functions/sha256.js'
    import { validate } from '$lib/functions/passwordValidate.js'
    import { goto } from '$app/navigation'
    import '../app.css'

    // Tailwind
    const input = "z-10 h-8 w-72 border-b-2 text-lg focus:outline-none transition-all bg-transparent"
    const label = "text-3xl text-accentNotActive m-3 relative transition-all select-none -left-16"
    const formContainer = "bg-background min-h-max min-w-max flex justify-center items-center rounded-xl row-start-1"
    const form = "font-basic text-3xl text-primary flex justify-center items-center flex-col gap-0"
    const svg = "relative h-9 float-left"
    const buttonForForm = "mt-10 p-3 pt-0 pb-1 bg-none border-2 border-solid border-accentNotActive text-accentNotActive text-xl cursor-pointer transition-all rounded-xl before:content-[' '] before:bg-background before:h-2 before:w-4 before:block before:relative before:-top-1 before:transition-all after:content-[' '] after:bg-background after:h-2 after:w-4 after:block after:relative after:top-2 after:left-12 after:transition-all hover:text-accent hover:scale-110 hover:border-accent hover:before:translate-x-12 hover:after:-translate-x-12"
	
    // State of page
    let load = false
	
    // Vars for alerts
    let alerts =
    {
		alertLogin: false,
        alertRegister: false,
        successRegister: false,
        alertMessage: ""
    }
	
    // Vars for slider
    let width
    let slide = ""
    let element
    let resizeObserver

    // Vars for form
    let username = ""
    let password = ""
	let rememberMe = false
    let passwordRegister = ""
    let passwordRegisterConfirm = ""

    // Even more vars for form but now interactive
    let usrLabel = "top-9"
    let passLabel = "top-9"
    let passLabelRegister = "top-9"
    let passLabelRegisterConfirm = "top-9"

    // Just colors
    const underlineColor = "border-accent"
    const underlineColorNotActive = "border-accentNotActive"

    let usrUnderline = "border-accentNotActive"
    let passUnderline = "border-accentNotActive"
    let passRegisterUnderline = "border-accentNotActive"
    let passRegisterConfirmUnderline = "border-accentNotActive"

    // State of page (which form you want to see)
    let state = "login"

    // Vars for forms so there will be no bugs kappa
    let visibilityLogin = "visible"
    let visibilityRegister = "hidden"

    onMount(() => {
        // Init page when it's loaded
        if (document.readyState === 'complete') 
        {
            initPage()
        } 

        else 
        {
            window.addEventListener('load', initPage)
        }
        
        // Add observer for courtain
        resizeObserver = new ResizeObserver(dispatchResize)

        if (element) 
        {
            resizeObserver.observe(element)
        }
    })

    // Destroy observer
    onDestroy(() => {
        if (resizeObserver && element) 
        {
			resizeObserver.unobserve(element)
        }
    })

    // Block of reactive elements
    $: if (username)
    {
        moveLabel("usr")
        username = username.split(' ').join('')
    }

    $: if (password)
    {
        moveLabel("pass")
        password = password.split(' ').join('')
    }

    $: if (passwordRegister)
    {
        moveLabel("passRegister")
        passwordRegister = passwordRegister.split(' ').join('')
    }

    $: if (passwordRegisterConfirm)
    {
        moveLabel("passRegisterConfirm")
        passwordRegisterConfirm = passwordRegisterConfirm.split(' ').join('')
    }

    // As it says
    function initPage() {
      load = true
    }

    // As it says
    function slider()
    {
        if (slide == "")
        {
            slide = "-translate-x-full"
            visibilityLogin = "hidden"
            visibilityRegister = "visible"
            state = "register"
        }

        else 
        {
            slide = ""
            visibilityLogin = "visible"
            visibilityRegister = "hidden"
            state = "login"
        }
    }

    // As it says
    function dispatchResize () 
    {
        if (slide != '')
        {
            slide = "-translate-x-full"
        }
    }

    // As it says
    function moveLabel (field)
    {
        if (field == "usr")
        {
            usrLabel = "top-0"
            usrUnderline = underlineColor
        }

        if (field == "pass")
        {
            passLabel = "top-0"
            passUnderline = underlineColor
        }

        if (field == "passRegister")
        {
            passLabelRegister = "top-0"
            passRegisterUnderline = underlineColor
        }

        if (field == "passRegisterConfirm")
        {
            passLabelRegisterConfirm = "top-0"
            passRegisterConfirmUnderline = underlineColor
        }
    }

    // As it says
    function resetLabels ()
    {
        if (username == "")
        {
            usrLabel = "top-9"
            usrUnderline = underlineColorNotActive
        }
        
        if (password == "")
        {
            passLabel = "top-9"
            passUnderline = underlineColorNotActive
        }

        if (passwordRegister == "")
        {
            passLabelRegister = "top-9"
            passRegisterUnderline = underlineColorNotActive
        }

        if (passwordRegisterConfirm == "")
        {
            passLabelRegisterConfirm = "top-9"
            passRegisterConfirmUnderline = underlineColorNotActive
        }
    }

    // As it says
    function error(message, mode)
    {
        if (mode == 'login')
        {
            alerts.alertLogin = true
        }
        
        else 
        {
            alerts.alertRegister = true
        }

        alerts.alertMessage = message
    }

    // As it says
    function success(message)
    {
        alerts.successRegister = true
        alerts.alertMessage = message
    }

    // As it says
    function resetError()
    {
        alerts.alertLogin = false
        alerts.alertRegister = false
		alerts.successRegister = false
        alerts.alertMessage = ""
    }

    // Handle connection with backend for login
    const handleLogin = async (event) =>
    {
        event.preventDefault()

        if (username != "" && password != "")
        {
            const hashed = await sha256(password)
            const user = username.toLowerCase()

            const formData = {
                user,
                hashed,
				rememberMe
            }

            try {
                const response = await fetch('/api/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })

                if (response.ok)
                {
                    const responseData = await response.json()

                    if (responseData.status != 200)
                    {
                        error(responseData.message, 'login')
                    }

                    else
                    {
                        goto("/main")
                    }
                }
            } 
            
            catch (error) {
                console.error('Error:', error)
            }

            return 0
        }

        error("Username and/or password is empty", 'login')
    }

    // Handle connection with backend for register
    const handleRegister = async (event) =>
    {
        event.preventDefault()

        if (username != "" && passwordRegister != "" && passwordRegisterConfirm != "")
        {
            if (passwordRegister === passwordRegisterConfirm)
            {
                const validator = validate(passwordRegister)

                if (validator == true)
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
                            if (responseData.status != 204)
                            {
                                success(responseData.message)
                            }

                            else
                            {
                                error(responseData.message, 'register')
                            }
                        } 

                        else 
                        {
                            error(response.message, 'register')
                        }
                    } 
                    
                    catch (error) {
                        error(`Error: ${error}`, 'register')
                    }

                    return true
                }

                else
                {
                    error(validator, 'register')

                    return false
                }
            }

            error("Passwords do not match", 'register')

            return false
        }

        error("Username and/or password is empty", 'register')

        return false
    }
</script>

<body class="flex flex-col min-h-screen">
    {#if load}
        <Banner></Banner>
        <div class="bg-background w-full flex-1 flex justify-center place-items-center relative">
            <div class="grid grid-cols-2 bg-gradient-to-b from-secondary to-primary rounded-xl p-2 h-[800px] w-[80%]">
                <div class="{formContainer} col-start-1">
                    <form class="{form} {visibilityLogin}">
                        <p>User Login</p>
                        <label for="username" class="{label} {usrLabel}">
                            <svg 
                            class="{svg}"
                            width="46" 
                            height="46" 
                            fill="none" 
                            stroke="currentColor" 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            stroke-width="1" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
                                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                            </svg>

                            <p class="float-right">Username</p>
                        </label>

                        <input 
                        class="{input} {usrUnderline}"
                        type="text" 
                        name="username"
                        bind:value={username} 
                        use:clickOutside 
                        on:click_outside={resetLabels} 
                        on:click={() => moveLabel("usr")} 
                        on:click={resetError}>

                        <label for="password" class="{label} {passLabel}">
                            <svg 
                            class="{svg}"
                            width="46" 
                            height="46" 
                            fill="none" 
                            stroke="currentColor" 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            stroke-width="1" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg" 
                            style="left: -3px;">
                                <path d="M17 11H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2Z"></path>
                                <path d="M12 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
                                <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
                            </svg>

                            <p class="float-right">Password</p>
                        </label>

                        <input 
                        class="{input} {passUnderline}"
                        type="password" 
                        id="password" 
                        name="password" 
                        bind:value={password} 
                        use:clickOutside 
                        on:click_outside={resetLabels} 
                        on:click={() => moveLabel("pass")} 
                        on:click={resetError}>

						<p class="inline-flex items-center p-0 mt-5 -mb-7 text-primary scale-125">
                            <input type="checkbox" bind:checked={rememberMe} id="rememberMeLabel" class="appearance-none bg-background border-2 border-solid border-accentNotActive rounded w-8 h-8 cursor-pointer relative scale-50 checked:bg-accent checked:border-accent checked:after:content-['✓'] checked:after:text-background checked:after:absolute checked:after:-top-1 checked:after:left-1 transition-all">
						    <label for="rememberMeLabel" class="text-accentNotActive text-lg relative left-0 top-0">Remember me</label>
                        </p>

                        {#if state == 'login' && alerts.alertLogin == true}
                            <p class="font-basic text-lg mt-10 -mb-5 text-red-600 animate-pulse">
                                {alerts.alertMessage}
                            </p>
                        {/if}

                        <button class="{buttonForForm}" on:click={handleLogin}>
                            <div>Submit</div>
                        </button>
                    </form>
                </div>

                <div class="{formContainer} col-start-2">
                    <form class="{form} {visibilityRegister}">
                        <p>Register</p>

                        <label for="username" class="{label} {usrLabel}">
                            <svg 
                            class="{svg}"
                            width="46" 
                            height="46" 
                            fill="none" 
                            stroke="currentColor" 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            stroke-width="1" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
                                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                            </svg>

                            <p class="float-right">Username</p>
                        </label>
                        <input 
                        class="{input} {usrUnderline}"
                        type="text" 
                        name="username" 
                        bind:value={username} 
                        use:clickOutside 
                        on:click_outside={resetLabels} 
                        on:click={() => moveLabel("usr")} 
                        on:click={resetError}>

                        <label for="passwordRegister" class="{label} {passLabelRegister}">
                            <svg 
                            class="{svg}"
                            width="46" 
                            height="46" 
                            fill="none" 
                            stroke="currentColor" 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            stroke-width="1" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg" 
                            style="left: -3px;">
                                <path d="M17 11H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2Z"></path>
                                <path d="M12 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
                                <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
                            </svg>

                            <p class="float-right">Password</p>
                        </label>

                        <input 
                        class="{input} {passRegisterUnderline}"
                        type="password" 
                        id="passwordRegister" 
                        name="password" 
                        bind:value={passwordRegister} 
                        use:clickOutside 
                        on:click_outside={resetLabels} 
                        on:click={() => moveLabel("passRegister")} 
                        on:click={resetError}>

                        <label for="passwordRegisterConfirm" class="{label} {passLabelRegisterConfirm} -left-2">
                            <svg 
                            class="{svg}"
                            width="46" 
                            height="46" 
                            fill="none" 
                            stroke="currentColor" 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            stroke-width="1" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg" 
                            style="left: -3px;">
                                <path d="M17 11H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2Z"></path>
                                <path d="M12 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
                                <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
                            </svg>

                            <p class="float-right">Confirm password</p>
                        </label>

                        <input 
                        class="{input} {passRegisterConfirmUnderline}"
                        type="password" 
                        id="passwordRegisterConfirm" 
                        name="passwordConfirmation" 
                        bind:value={passwordRegisterConfirm} 
                        use:clickOutside 
                        on:click_outside={resetLabels} 
                        on:click={() => moveLabel("passRegisterConfirm")} 
                        on:click={resetError}>

                        {#if state == 'register' && alerts.alertRegister == true}
                            <p class="font-basic text-lg mt-6 -mb-5 text-red-600 animate-pulse">
                                {alerts.alertMessage}
                            </p>
                        {:else if state == 'register' && alerts.successRegister == true}
                            <p class="font-basic text-lg mt-6 -mb-5 text-accent animate-pulse">
                                {alerts.alertMessage}
                            </p>
                        {:else}
                            <p class="font-basic text-lg mt-6 -mb-5 text-accent animate-pulse select-none">
                                &nbsp;
                            </p>
                        {/if}

                        <button class="{buttonForForm} mt-6" on:click={handleRegister}>
                            <div>Submit</div>
                        </button>
                    </form>
                </div>

                <div class="z-30 row-start-1 col-start-2 relative bg-gradient-to-t from-primary to-third transition-all flex justify-center items-center flex-col {slide} duration-200" bind:clientWidth={width} bind:this={element}>
                    {#if state == "login"}
                        <p class="text-background font-basic text-5xl text-center">Do you want to register?</p>
                        <p class="text-third font-basic text-xl text-center w-[80%] mt-8">You will get access to many interesting features, and the registration process will only take a moment. Click the button below</p>
                        <button 
                        class="bg-none border-2 border-solid border-third rounded-xl text-third p-2 pb-3 cursor-pointer relative top-10 scale-125 transition-all hover:bg-accent hover:border-accent hover:text-background"
                        on:click={slider} 
                        on:click={resetError}>
                            I want to register!
                        </button>
                    {:else}
                        <p class="text-background font-basic text-5xl text-center">Or maybe you already have an account?</p>
                        <p class="text-third font-basic text-xl text-center w-[80%] mt-8">Click the button below to go to login page, and get access to your acconunt in just a while</p>
                        <button
                        class="bg-none border-2 border-solid border-third rounded-xl text-third p-2 pb-3 cursor-pointer relative top-10 scale-125 transition-all hover:bg-accent hover:border-accent hover:text-background"
                        on:click={slider} 
                        on:click={resetError}>
                            I want to log in!
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</body>