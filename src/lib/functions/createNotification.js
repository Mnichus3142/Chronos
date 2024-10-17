import { table } from '$lib/stores/notificationStore.js'

export function createNotification (prompt, type) 
{
    table.update(items => {
        items.addNotification(prompt, type)
        return items
    })
}