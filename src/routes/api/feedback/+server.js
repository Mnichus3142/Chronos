import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';
dotenv.config();

export async function POST({ request }) {
    const { user, message } = await request.json();

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        return json({ error: 'Webhook URL is not set' }, { status: 500 });
    }

    const payload = {
        username: "Bug Reporter",
        embeds: [
            {
                title: "🛑 New bug report!",
                description: message,
                color: 16711680,
                fields: [
                    { name: "Reported by: ", value: user, inline: false },
                    { name: "Date: ", value: new Date().toISOString(), inline: false }
                ]
            }
        ]
    };

    try {
        const res = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            throw new Error(`Błąd webhooka: ${res.statusText}`);
        }

        return json({ success: true });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}
