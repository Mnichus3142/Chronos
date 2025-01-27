<script>
    import { onMount } from 'svelte';

    let duration = 3.5;
    let delay = duration / 15;

    onMount(() => {
        const balls = document.querySelectorAll('.ball');
        balls.forEach((ball, index) => {
            ball.style.animationDelay = `${index * delay}s`;
        });
    });
</script>

<div class="absolute left-0 top-0 z-50 w-screen h-screen flex justify-center items-center text-third bg-background">
    <div class="font-basic relative -top-24 text-2xl">
        <p>
            Loading...
        </p>
    </div>
    <div class="-mt-24">    
        <div class="ball" style="--animation-duration: {duration}s"></div>
        <div class="ball" style="--animation-duration: {duration}s"></div>
        <div class="ball" style="--animation-duration: {duration}s"></div>
        <div class="ball" style="--animation-duration: {duration}s"></div>
        <div class="ball" style="--animation-duration: {duration}s"></div>
    </div>
</div>

<style>
.ball {
    @apply h-20 w-20 absolute m-auto left-0 right-0 opacity-0;
    animation: rotation var(--animation-duration) infinite;
}

.ball::after {
    @apply bg-third h-4 w-4 block absolute bottom-0 right-0 rounded-full;
    content: "";
}

@keyframes rotation {

    0% {
        transform: rotate(45deg);
        opacity: 1;
        animation-timing-function: ease-out;
    }

    7%{
        transform: rotate(165deg);
        animation-timing-function: linear;
    }

    30% {
        transform: rotate(275deg);
        animation-timing-function: ease-in-out;
    }

    39% {
        transform: rotate(500deg);
        animation-timing-function: linear;
    }

    70% {
        transform: rotate(635deg);
        opacity: 1;
        animation-timing-function: ease-in;
    }

    75% {
        transform: rotate(765deg);
        animation-timing-function: ease-out;
    }

    76% {
        transform: rotate(765deg);
        opacity: 0;
    }

    100% {
        transform: rotate(765deg);
        opacity: 0;
    }
}
</style>