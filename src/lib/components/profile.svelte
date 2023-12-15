<script>
    // State in which menu is at the moment
    let state = 'none'

    // Actual height of menu
    let height = '0px'

    // Function which is unfolding user menu
    function unfold()
    {
        state = 'block'
        changer(200, 1, 5, true)
    }

    // Funcion which is folding user menu
    function fold()
    {
        changer(0, 1, 5, false)
    }

    // Function which is dynamicly changing state of menu
    function changer (expected, interval, howMuchToAdd, whichWay)
    {
        if (whichWay)
        {
            const intervalStart = setInterval(() => {
                if (height.substring(0, height.length - 2) > expected || height.substring(0, height.length - 2) == expected)
                {
                    clearInterval(intervalStart)
                    return 0
                }
                height = height.substring(0, height.length - 2)
                height = parseInt(height) + howMuchToAdd
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
                height = height.substring(0, height.length - 2)
                height = parseInt(height) - howMuchToAdd
                height = String(height) + 'px'
            }, interval)
        }
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
            <a href="http:\\sejm.gov.pl" class="menu0">SEJM</a>
        </ul>
    </div>
</div>

<style>
    .arrow-up {
        width: 1; 
        height: 1; 
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        
        border-bottom: 15px solid var(--1);

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
            to bottom,
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
        background-color: var(--white);

        border-radius: 9px;

        text-align: center;
    }

    .menu li {
        list-style: none;
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