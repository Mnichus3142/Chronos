import { cookies } from '@sveltejs/kit'
import { Client } from 'pg'
import { redirect } from '@sveltejs/kit'

export async function load({ cookies })
{
    const cookie_value = cookies.get('sessionId')

    if (cookie_value != undefined) {
        throw redirect(302, '/main')
    }

    else if (cookie_value == undefined) {
        cookies.set('sessionId', "undefined", {
            path: '/',
        })
    }
}
