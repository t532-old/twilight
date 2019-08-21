const alphanumeric = 'abcdefghijklmnopqrstuvwxyz1234567890'
export function validateID(id) {
    if (
        typeof id === 'string' &&
        id.length === 24 &&
        [...id].every(i => alphanumeric.indexOf(i) >= 0)
    ) return id
    else return null
}
