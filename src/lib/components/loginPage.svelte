<script>

</script>

<div>
    <div class="formBorder">

    </div>
    <form class="form">
        
    </form>
</div>

<style>
    .formBorder {
        width: calc(60vw + 20px);
        height: calc(60vh + 20px);
        position: absolute;
        margin-left: -10px;
        margin-top: -10px;
        background-color: blue;
        z-index: 0;

        background: linear-gradient(
            to bottom,
            var(--1),
            var(--3)
        );

        border-radius: 20px;
    }

    .form {
        position: relative;
        width: 60vw;
        height: 60vh;
        background-color: var(--white);
        z-index: 4;

        border-radius: 10px;
    }
</style>