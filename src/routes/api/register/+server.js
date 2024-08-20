import { error, json } from '@sveltejs/kit'
import { Client } from 'pg'

export const POST = async ({ request }) => {
    // Create client
    const client = new Client({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'timemenager',
        password: 'zaq1@WSX',
        port: 5432
    })
    
    try {
        // Get variables from form
        const { user, hashed } = await request.json()

        // Connect to database
        await client.connect()

        // Check if user exist
        const res = await client.query(`SELECT * FROM users WHERE username = '${user}'`)

        // If exist then tell user about it
        if (res.rows.length != 0)
        {
            return json({ message: 'User already exists', status: 202 })
        }

        // Add user to database
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