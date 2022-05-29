export const makeUrl = (baseUrl, path) => {
    if (typeof path === 'string') {
        return new URL(path, baseUrl).toString()
    } else if (Array.isArray(path)) {
        return new URL(path.join('/'), baseUrl).toString()
    } else {
        throw new Error('Second argument should be string or array of strings!')
    }
}

export const makeHeaders = () => {
    return {}
}