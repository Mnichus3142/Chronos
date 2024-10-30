<script>
    // Date
    let date = new Date();

    const updateTime = () => {
        date = new Date();
    };

    let interval = setInterval(updateTime, 1000);
</script>

<div>
    <p
        class="font-clock p-3 border-2 text-textColor border-textColor rounded-md w-36 text-center text-lg"
    >
        {date.getHours().toString().length == 1
            ? `0${date.getHours()}`
            : date.getHours()}:{date.getMinutes().toString().length == 1
            ? `0${date.getMinutes()}`
            : date.getMinutes()}:{date.getSeconds().toString().length == 1
            ? `0${date.getSeconds()}`
            : date.getSeconds()}
    </p>
</div>
