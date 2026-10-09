export async function comprarItems(username, items) {
    const res = await fetch('/api/compras/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, items })
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    return data.message
}