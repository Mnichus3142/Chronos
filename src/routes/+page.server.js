import { cookies } from '@sveltejs/kit'
import pkg from 'pg';
const { Client } = pkg;
import { redirect } from '@sveltejs/kit'

export async function load({ cookies })
{
    // Create cookie
    const cookie_value = cookies.get('sessionId')

    // Create client
    const client = new Client({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'timemenager',
        password: 'zaq1@WSX',
        port: 5432
    })

    try 
    {
        // If cookie exist then go to main page
        if (cookie_value != undefined) {
            
            await client.connect();
            const check = await client.query(`SELECT * FROM cookies WHERE cookie_value = '${cookie_value}'`)
            
            // If cookie do not exist in database go to landing page
            if (check.rowCount === 1) {
                throw redirect(302, '/main')
            }
        }

        // If not create a cookie
        else if (cookie_value == undefined) {
            cookies.set('sessionId', undefined, {
                path: '/',
            })
        }
    }

    finally {
        await client.end()
    }
}
