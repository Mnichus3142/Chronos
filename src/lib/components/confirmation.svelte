<script>
    export let onConfirm;
    export let onCancel;

    function handleConfirm() {
        onConfirm();
    }

    function handleCancel() {
        onCancel();
    }
</script>

<div
    class="z-50 absolute flex justify-center place-items-center w-screen h-screen bg-gray-900 bg-opacity-40 backdrop-blur-sm font-basic"
>
    <div class="bg-background w-fit h-fit p-6 text-3xl rounded-lg shadow-lg">
        <slot class="mb-5"></slot>
        <div class="mt-5 flex justify-end place-items-center gap-7">
            <button
                on:click={handleConfirm}
                class="bg-green-500 pr-3 text-textColor h-12 col-start-3 grid grid-cols-2 grid-rows-1 place-items-center justify-center rounded-xl shadow-xl hover:scale-110 transition"
            >
                <svg
                    width="28"
                    height="28"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="m21.5 5.5-13.063 13L2.5 12.59"></path>
                </svg>
                <p class="font-basic text-2xl">Confirm</p>
            </button>
            <button
                on:click={handleCancel}
                class="bg-red-600 pr-3 text-textColor h-12 row-start-1 col-start-2 grid grid-cols-2 grid-rows-1 place-items-center justify-center rounded-xl shadow-xl hover:scale-110 transition"
            >
                <svg
                    width="28"
                    height="28"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"></path>
                    <path d="m5.7 5.703 12.6 12.6"></path>
                </svg>
                <p class="font-basic text-2xl">Cancel</p>
            </button>
        </div>
    </div>
</div>
