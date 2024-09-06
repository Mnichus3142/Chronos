import { error, json } from '@sveltejs/kit'
import pkg from 'pg';
const { Client } = pkg;

export const POST = async ({ cookies }) => 
{
    const client = new Client({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'timemenager',
        password: 'zaq1@WSX',
        port: 5432
    })

    try
    {
        const cookie_value = cookies.get('sessionId')

        await client.connect();
        await client.query(`DELETE FROM cookies WHERE cookie_value = '${cookie_value}'`)

        cookies.set('sessionId', undefined, {
            path: '/',
        })

        return json({ message: 'All good', status: 200 })
    }

    catch (error)
    {
        return json({ message: 'Error connecting to database', status: 203 })
    }

    finally {
        await client.end()
    }
}