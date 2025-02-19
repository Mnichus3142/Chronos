import { cookies } from "@sveltejs/kit";
import pkg from "pg";
const { Client } = pkg;
import { redirect } from "@sveltejs/kit";
import dotenv from 'dotenv';
dotenv.config();

export async function load({ cookies, url }) {
    // Get cookie value and current path
    const cookie_value = cookies.get("sessionId");
    const currentPath = url.pathname;

    // Create client
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        ssl: process.env.SSL_ENABLED ? {
            ca: process.env.SSL_CA,
        } : false,
    });

    try {
        // Logika dla strony głównej (landing page)
        if (currentPath === '/') {
            if (cookie_value != undefined) {
                await client.connect();
                const check = await client.query(
                    "SELECT cookie_value FROM cookies WHERE cookie_value = $1",
                    [cookie_value]
                );

                if (check.rowCount === 1) {
                    throw redirect(302, "/main");
                }
            } else {
                cookies.set("sessionId", undefined, {
                    path: "/",
                });
            }
            return {};
        }

        // Logika dla pozostałych stron (main, calendar, today)
        else {
            if (cookie_value === undefined) {
                throw redirect(302, "/");
            }

            await client.connect();
            const result = await client.query(
                "SELECT * FROM cookies WHERE cookie_value = $1",
                [cookie_value]
            );

            if (result.rowCount === 0) {
                throw redirect(302, "/");
            }

            return {
                user: {
                    cookie: cookie_value
                }
            };
        }

    } catch (error) {
        console.error('Error in layout.server.js:', error);
        if (error instanceof redirect) {
            throw error;
        }
        return {
            error: 'Wystąpił błąd podczas połączenia z bazą danych'
        };
    } finally {
        await client.end();
    }
}