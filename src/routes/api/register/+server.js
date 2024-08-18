import { error, json } from '@sveltejs/kit'
import { Client } from 'pg'

export const POST = async ({ request }) => {
    const client = new Client({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'timemenager',
        password: 'zaq1@WSX',
        port: 5432
    })
    
    try {
        const { user, hashed } = await request.json()

        await client.connect()

        const res = await client.query(`SELECT * FROM users WHERE username = '${user}'`)

        if (res.rows.length != 0)
        {
            return json({ message: 'User already exists', status: 202 })
        }

        client.query(`INSERT INTO users (username, password) VALUES ('${user}', '${hashed}')`)

        return json({ message: 'User added to database, you can now log in', status: 200 })
    } 

    catch (error) {
        return json({ message: 'Error while inserting into database', status: 201 })
    }

    finally {
        await client.end()
    }
}