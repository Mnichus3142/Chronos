import { cookies } from '@sveltejs/kit'
import { Client } from 'pg'
import { redirect } from '@sveltejs/kit'

export async function load({ cookies })
{
    // Get cookie value
    const cookie_value = cookies.get('sessionId')
    console.log(cookie_value)

    // Check if cookie even exist
    if (cookie_value != undefined) {
        // Create client
        const client = new Client({
            user: 'postgres',
            host: '127.0.0.1',
            database: 'timemenager',
            password: 'zaq1@WSX',
            port: 5432
        })

        // Connect to database and get value from it
        await client.connect();
        const check = await client.query(`SELECT * FROM cookies WHERE cookie_value = '${cookie_value}'`)
        await client.end()

        // If cookie do not exist in database go to landing page
        if (check.rowCount === 0) {
            throw redirect(302, '/')
        }
    }

    else
    {
        throw redirect(302, '/')
    }
}
