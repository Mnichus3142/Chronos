import { cookies } from '@sveltejs/kit'
import { Client } from 'pg'
import { redirect } from '@sveltejs/kit'

export async function load({ cookies })
{
    // Create cookie
    const cookie_value = cookies.get('sessionId')

    // If cookie exist then go to main page
    if (cookie_value != undefined) {
        throw redirect(302, '/main')
    }

    // If not create a cookie
    else if (cookie_value == undefined) {
        cookies.set('sessionId', "undefined", {
            path: '/',
        })
    }
}
