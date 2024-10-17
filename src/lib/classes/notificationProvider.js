export class NotificationProvider
{
    constructor ()
    {
        this.notifications = []
    }

    addNotification (prompt, type)
    {
        this.notifications.push({ prompt, type })
        return 0
    }

    getNotifications ()
    {
        return this.notifications
    }
}