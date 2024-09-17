import { cookies } from '@sveltejs/kit'
import pkg from 'pg';
const { Client } = pkg;
import { redirect } from '@sveltejs/kit'

export async function load({ cookies })
{
    // Get cookie value
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
        // Check if cookie even exist
        if (cookie_value != undefined) {
            // Connect to database and get value from it
            await client.connect();
            const insertQuery = 'SELECT * FROM cookies WHERE cookie_value = $1'
            const insertParams = [cookie_value]
            const check = await client.query(insertQuery, insertParams)

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

    finally
    {
        await client.end()
    }
}
