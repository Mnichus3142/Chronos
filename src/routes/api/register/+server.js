import { error, json } from '@sveltejs/kit'
import pkg from 'pg'
const { Client } = pkg
import fs from 'fs/promises'
import path from 'path'

export const POST = async ({ request }) => {

    // Get connection params
    const filePath = path.resolve('src/connectionParameters.json')
    const fileContent = await fs.readFile(filePath, 'utf8')
    const data = JSON.parse(fileContent)

    // Create client
    const client = new Client({
        user: data.user,
        host: data.host,
        database: data.database,
        password: data.password,
        port: data.port,
        ssl: {
            ca: await fs.readFile(path.resolve('src/certificate.pem'))
        }
    })
    
    try {
        // Get variables from form
        const { user, hashed } = await request.json()

        // Connect to database
        await client.connect()

        // Check if user exist
        let insertQuery = 'SELECT * FROM users WHERE username = $1'
        let insertParams = [user]
        const res = await client.query(insertQuery, insertParams)

        // If exist then tell user about it
        if (res.rows.length != 0)
        {
            return json({ message: 'User already exists', status: 202 })
        }

        // Add user to database
        insertQuery = 'INSERT INTO users (username, password) VALUES ($1, $2)'
        insertParams = [user, hashed]
        await client.query(insertQuery, insertParams)

        return json({ message: 'User added to database, you can now log in', status: 200 })
    } 

    catch (error) {
        return json({ message: 'Error while inserting into database', status: 201 })
    }

    finally {
        await client.end()
    }
}