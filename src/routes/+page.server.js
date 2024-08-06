import { cookies } from '@sveltejs/kit'

export function load({ cookies })
{
    cookies.set('sessionId', "", {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
    })
}