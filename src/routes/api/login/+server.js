import { error, json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
    try {
        const { username, hashed } = await request.json()

        console.log(username)
        console.log(hashed)

        return json({ message: 'All good' }, { status: 200 })
    } 

    catch (error) {
        return json({ message: 'Error processing request' }, { status: 201 })
    }
};