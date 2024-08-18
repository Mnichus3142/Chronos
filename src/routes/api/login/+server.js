import { error, json } from '@sveltejs/kit'
import { Client } from 'pg'
import { sha256 } from '$lib/functions/sha256.js'
import { generateUniqueData } from '../../../lib/functions/generateUniqueData.js'

export const POST = async ({ request, cookies }) => {
    const client = new Client({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'timemenager',
        password: 'zaq1@WSX',
        port: 5432
    })
    
    try {
        const { user, hashed, rememberMe } = await request.json()

        await client.connect()

        const res = await client.query(`SELECT * FROM users WHERE username = '${user}'`)

            if (res.rows[0]["password"] === hashed)
            {
                await client.query(`DELETE FROM cookies WHERE username = '${user}'`)

                const uniqueData = await generateUniqueData(user)
                const cookieValue = await sha256(uniqueData)

                if (rememberMe)
                {
                    cookies.set('sessionId', cookieValue, {
                        path: '/',
                        httpOnly: true,
                        secure: true,
                        sameSite: "lax",
                        maxAge: 60 * 60 * 24 * 365 * 100
                    })
                }

                else 
                {
                    cookies.set('sessionId', cookieValue, {
                        path: '/',
                        httpOnly: true,
                        secure: true,
                        sameSite: "lax"
                    })

                }

                await client.query(`INSERT INTO cookies (cookie_value, username, remember_me) VALUES ('${cookieValue}', '${user}', '${rememberMe}')`)

                return json({ message: 'All good', status: 200 })
            }

            else 
            {
                return json({ message: 'Wrong password', status: 204 })
            }
    }

    catch (error) {
        return json({ message: 'Error processing request / User not exist', status: 203 })
    }

    finally {
        await client.end()
    }
}
