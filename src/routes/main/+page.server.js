import { cookies } from '@sveltejs/kit'
import { Client } from 'pg'
import { redirect } from '@sveltejs/kit'

export async function load({ cookies })
{
    const cookie_value = cookies.get('sessionId')
    console.log(cookie_value)

    if (cookie_value != undefined) {
        const client = new Client({
            user: 'postgres',
            host: '127.0.0.1',
            database: 'timemenager',
            password: 'zaq1@WSX',
            port: 5432
        })

        await client.connect();
        const check = await client.query(`SELECT * FROM cookies WHERE cookie_value = '${cookie_value}'`)
        await client.end()

        if (check.rowCount === 0) {
            throw redirect(302, '/')
        }
    }

    else
    {
        throw redirect(302, '/')
    }
}
