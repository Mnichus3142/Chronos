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
        ssl: data.ssl && data.ssl.ca ? {
            ca: data.ssl.ca
        } :  false
    })

    try
    {
        const cookie_value = cookies.get('sessionId')

        await client.connect()

        const insertQuery = 'SELECT username FROM cookies WHERE cookie_value = $1'
        const insertParams = [cookie_value]
        const res = await client.query(insertQuery, insertParams)
        const data = res.rows[0].username

        return json({ message: `${data}`, status: 200 })
    }

    catch (error)
    {
        return json({ message: 'Error connecting to database', status: 203 })
    }

    finally {
        await client.end()
    }
}