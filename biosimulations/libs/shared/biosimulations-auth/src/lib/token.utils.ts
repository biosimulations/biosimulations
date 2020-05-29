let jwt = require('jsonwebtoken');


export function decodeToken(token: string) {
    const decoded = jwt.decode(token)
    return decoded
}

export function getUserId(token: string) {
    return decodeToken(token).user_id
}