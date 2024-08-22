<script>
    import Banner from '$lib/components/banner.svelte'
    import { onMount, onDestroy } from 'svelte'
    import { goto } from '$app/navigation';

    // State of page
    let load = false

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

        // FIXME: Reload page? Do I really want it?
        goto("/main")
    })

    function initPage() {
      load = true
    }
</script>

<Banner></Banner>

<style>

</style>