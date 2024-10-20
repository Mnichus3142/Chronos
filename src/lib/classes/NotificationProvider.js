export class NotificationProvider
{
    constructor ()
    {
        this.notifications = []
    }

    startClock()
    {
        this.interval = setInterval(() => {
            this.worker()
        }, 10)
    }

    stopClock()
    {
        clearInterval(this.interval)
    }

    worker ()
    {
        this.notifications.forEach((item) => {
            if (item.duration === 0)
            {
                this.removeNotification(item.id)
            }
            item.duration = item.duration - 10
            item.width = item.duration / 20
        })
    }

    addNotification (prompt, type)
    {
        const id = Date.now()

        if (this.notifications.length === 4)
        {
            this.removeNotification(this.notifications[0].id)
        }

        this.notifications.push({ id, prompt, type, duration: 2000, width: 100 })

        if (this.notifications.length === 1)
        {
            this.startClock()
        }

        return 0
    }

    removeNotification(id) {
        this.notifications = this.notifications.filter(notif => notif.id !== id)

        if (this.notifications.length === 0)
        {
            this.stopClock()
        }
    }

    getNotifications ()
    {
        return this.notifications
    }
}