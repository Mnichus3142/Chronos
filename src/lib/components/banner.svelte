<script>
    import Profile from '$lib/components/profile.svelte'
</script>

<div class='block'>
    <p>Time menager</p>
</div>

<Profile></Profile>

<style>
    .block {
        height: 60px;
        min-height: 60px;
        width: 100%;
        margin: 0;
        display: grid;

        background: linear-gradient(
            to right,
            var(--1),
            var(--3)
        );
        color: white;

        padding: 10px;

        overflow-y: hidden;
        overflow-x: hidden;
    }

    p {
        font-family: 'Rubik', sans-serif;
        

        font-size: 130%;
        position: relative;
        top: 27%;
        left: 20px;
    }
</style>