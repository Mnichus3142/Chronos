import { error, json } from '@sveltejs/kit'
import pkg from 'pg'
const { Client } = pkg
import fs from 'fs/promises'
import path from 'path'

export const POST = async ({ cookies }) => 
{
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
        ssl: data.ssl,
    })

    try
    {
        const cookie_value = cookies.get('sessionId')

        await client.connect();

        const insertQuery = 'DELETE FROM cookies WHERE cookie_value = $1'
        const insertParams = [cookie_value]
        await client.query(insertQuery, insertParams)

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