<script>
    import { goto } from '$app/navigation';
    import '../../app.css'

    const handleLogout = async (event) => 
    {
        event.preventDefault()

        try
        {
            const response = await fetch("/api/logout", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
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
                        goto("/")
                    }
                }
        }

        catch (error)
        {
            console.error('Error:', error)
        }
    }

    // State in which menu is at the moment
    let state = 'none'

    // Actual height of menu
    let height = '0px'

    // Menu elements
    let list = [
        {data0: 'M12.296 9.015a3 3 0 1 0-.59 5.97 3 3 0 0 0 .59-5.97v0ZM19.518 12a7.238 7.238 0 0 1-.072.975l2.12 1.662a.507.507 0 0 1 .114.644l-2.005 3.469a.507.507 0 0 1-.615.215l-2.105-.847a.753.753 0 0 0-.711.082 7.703 7.703 0 0 1-1.01.588.747.747 0 0 0-.413.569l-.316 2.244a.519.519 0 0 1-.5.43h-4.01a.52.52 0 0 1-.501-.415l-.315-2.242a.753.753 0 0 0-.422-.573 7.278 7.278 0 0 1-1.006-.59.75.75 0 0 0-.708-.08l-2.105.848a.507.507 0 0 1-.616-.215L2.32 15.295a.506.506 0 0 1 .114-.644l1.792-1.406a.752.752 0 0 0 .28-.66 6.392 6.392 0 0 1 0-1.165.75.75 0 0 0-.284-.654L2.431 9.36a.507.507 0 0 1-.111-.641L4.325 5.25a.507.507 0 0 1 .616-.215l2.105.847a.755.755 0 0 0 .71-.082 7.71 7.71 0 0 1 1.01-.587.747.747 0 0 0 .414-.57L9.495 2.4a.52.52 0 0 1 .5-.43h4.01a.52.52 0 0 1 .502.416l.315 2.241a.753.753 0 0 0 .421.573c.351.17.687.366 1.006.59a.75.75 0 0 0 .709.08l2.104-.848a.507.507 0 0 1 .616.215l2.005 3.469a.506.506 0 0 1-.115.644l-1.791 1.406a.752.752 0 0 0-.284.66c.016.195.026.39.026.585Z', 
        text: 'Settings', display: 'none', opacity: '0%', id: 0},

        {data0: 'M14.25 15.75v1.875a1.875 1.875 0 0 1-1.875 1.875h-7.5A1.875 1.875 0 0 1 3 17.625V6.375A1.875 1.875 0 0 1 4.875 4.5H12c1.036 0 2.25.84 2.25 1.875V8.25', 
        data1: 'M17.25 15.75 21 12l-3.75-3.75', 
        data2: 'M8.25 12h12', 
        text: 'Logout', display: 'none', opacity: '0%', id: 1, onclick: handleLogout},
    ]

    // Function which is unfolding user menu
    function unfold()
    {
        if (state == 'block') 
        {
            changer(0, 1, 5, false)
        }
        else 
        {
            state = 'block'
            changer(200, 1, 5, true)
        }
    }

    // Funcion which is folding user menu
    function fold()
    {
        changer(0, 1, 5, false)
    }


    // Making menu element visible
    function addElement(id, way)
    {
        if (way == 1)
        {
            list[id]['display'] = 'block' 
            let i = 0
            var intervalStart = setInterval (() => {
                if (list[id]['opacity'] != '100%' && list[id]['display'] == 'block')
                {
                    i = i + 5
                    list[id]['opacity'] = `${i}%`
                }
                else 
                {
                    clearInterval(intervalStart)
                    return 0
                }
            }, 10)
        }
    }

    // Function which is dynamicly changing state of menu
    function changer (expected, interval, howMuchToAdd, whichWay)
    {
        if (whichWay)
        {
            const intervalStart = setInterval(() => {
                if (height.substring(0, height.length - 2) >= expected)
                {
                    clearInterval(intervalStart)
                    return 0
                }
                height = height.substring(0, height.length - 2)
                height = parseInt(height) + howMuchToAdd
                if (parseInt(height) == 125)
                {
                    addElement(0, 1)
                }
                if (parseInt(height) == 150)
                {
                    addElement(1, 1)
                }
                height = String(height) + 'px'
            }, interval)
        }

        else 
        {

            const intervalStart = setInterval(() => {
                if (height.substring(0, height.length - 2) == 0)
                {
                    state = 'none'
                }
                if (height.substring(0, height.length - 2) <= expected)
                {
                    clearInterval(intervalStart)
                }
                for (let i = 0; i < 2; i++)
                {
                    list[i]['display'] = 'none'
                    list[i]['opacity'] = '0%'
                }
                height = height.substring(0, height.length - 2)
                height = parseInt(height) - howMuchToAdd
                height = String(height) + 'px'
            }, interval)
        }
    }

    // Changing colour of the svg element on hover
    function svgChanger(id)
    {
        let svgDoc = id.contentDocument
    }
</script>

<div class="profile">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a on:click={unfold}>
        <svg width="46" height="46" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.25c-5.376 0-9.75 4.374-9.75 9.75s4.374 9.75 9.75 9.75 9.75-4.374 9.75-9.75S17.376 2.25 12 2.25Zm.094 4.5a3.375 3.375 0 1 1 0 6.75 3.375 3.375 0 0 1 0-6.75ZM12 20.25a8.23 8.23 0 0 1-6.055-2.653C6.359 15.45 10.08 15 12 15s5.64.45 6.055 2.596A8.228 8.228 0 0 1 12 20.25Z"></path>
        </svg>
    </a>
</div>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div class="menuBorder" id='menuBorder' style="--state: {state}; --height: {height}">
    <div class="arrow-up"></div>
    <div class="menu" id="menu" style="--state: {state}; --height: {height}" on:mouseleave={fold}>
        <ul>
            {#each list as item}
                <li style="display: {item['display']}; opacity: {item['opacity']}">
                    <button on:mouseover={svgChanger(item['id'])} on:click={item['onclick']}>
                        <!-- <object data={item['data']} title="{item['data']}" width="25" height="25" id='{item['id']}'></object> -->
                        <svg width="46" height="46" fill="none" stroke="#4d4b50" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="{item['data0']}"></path><path d="{item['data1']}"></path><path d="{item['data2']}"></path></svg>
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <a>{item['text']}</a>
                    </button>
                </li>
            {/each}
        </ul>
    </div>
</div>

<style>
    .arrow-up {
        width: 1; 
        height: 1; 
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        
        border-bottom: 15px solid var(--3);

        position: absolute;
        top: -13px;
        right: 9px;
        z-index: 6;
    }

    .menuBorder {
        position: absolute;
        right: 20px;
        top: 85px;

        padding: 5px;
        
        display: var(--state);
        height: var(--height);

        background: linear-gradient(
            to top,
            var(--1),
            var(--3)
        );

        border-radius: 11px;

        display: var(--state);
        place-items: center;
    }

    .menu {
        position: relative;

        display: var(--state);
        height: var(--height);
        width: 150px;
        background-color: white;

        border-radius: 9px;

        text-align: center;
    }

    .menu ul {
        list-style: none;
    }

    .menu ul li {
        text-align: center;
        padding: 10px;
        position: relative;
        bottom: 0;
        left: 15%;
        right: 0;
        top: 0;
        margin-top: auto;
        margin-bottom: auto;
        margin-left: auto;
        margin-right: auto;
        top: 80px
    }

    .menu ul li button {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;

        width: 90px;
        height: 37px;

        background: none;
        border: none;
        position: relative;
        z-index: 10;

        background: white;
        
        transition: background 0.6s ease;

        border: solid 2px var(--2);
        border-radius: 10px;

        font-family: 'Rubik', sans-serif;
        font-weight: bold;
    }

    .menu ul li button:hover {
        background: var(--2);
    }

    .menu ul li button:hover a {
        color: white;
    }

    .menu ul li button:hover svg {
        stroke: white;
    }

    .menu ul li button a {
        margin-left: 10px;
        margin-right: 4px;
        color: var(--2);
    }

    .profile {
        position: absolute;
        top: 17px;
        right: 20px;
        color: white;
        cursor: pointer;
        transition: transform 0.15s ease-in-out;
    }

    .profile:hover {
        transform: scale(120%);
    }
</style>