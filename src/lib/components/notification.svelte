<script>
    import { table } from '$lib/stores/notificationStore.js'

    let count_value

    table.subscribe((value) => {
		count_value = value
        console.log(count_value)
	})

    function increment() {
		table.update(items => {
            items.push("Kutas")
            return items
        })
	}
</script>

<div class="h-96 w-96 bg-red-500">
    <button on:click={increment}>
        KUTAS
    </button>
    {#each count_value as item}
        <p>{item}</p>
    {/each}
</div>