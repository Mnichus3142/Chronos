import { encryptMessage, decryptMessage } from "../../../lib/functions/cryptoProviders"
import { error, json } from '@sveltejs/kit'
import path from 'path'
import fs from 'fs/promises'
import pkg from 'pg'
const { Client } = pkg

export const POST = async ({ request }) => 
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
        const { listActual, send } = await request.json()

        console.log(listActual)

        return json({ status: 200 })
    }

    catch (error)
    {
        return json({ error: error, status: 201 })
    }

    finally
    {

    }
}