/** @type {import('./$types').Actions} */
export const actions = 
{
    login: async ({request}) => 
    {
        const data = await request.formData()
        const username = data.get('username')
        const password = data.get('password')

        console.log(username + "\n" + password)

        return { alert: true, message: "Username and/or password empty"}
    }
}