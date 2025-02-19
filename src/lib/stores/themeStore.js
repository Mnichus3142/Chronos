import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const storedTheme = browser ? localStorage.getItem('theme') || 'shadow' : 'shadow';

export const theme = writable(storedTheme);

theme.subscribe((value) => {
    if (browser) {
        localStorage.setItem('theme', value);
    }
});