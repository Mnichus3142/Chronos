import { writable } from "svelte/store";
import { NotificationProvider } from "$lib/classes/NotificationProvider.js";

export const table = writable(new NotificationProvider());
