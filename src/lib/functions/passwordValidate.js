export function validate (password)
{
    if (password.length >= 8)
    {
        return true
    }

    else
    {
        return "Password is not strong enough"
    }
}