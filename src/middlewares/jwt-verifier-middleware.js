const jwt = require('jsonwebtoken')
// require("dotenv").config()

const ForbiddenError = require('../errors/forbidden-error')
const UnauthorizedError = require('../errors/unauthorized-error')

function verifyToken(req, res, next) {
    // TO DO: Add sanitizer here.

    const authHeader = req.header('Authorization')

    if (typeof authHeader === 'undefined') {
        throw new UnauthorizedError(
            'Missing authorization header. Provide a valid token.'
        )
    }

    // Parse token
    // Authorization: Bearer <token>
    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            // We might be able to do something with this error
            // e.g If the token expires
            throw new ForbiddenError(err.message, err.name)
        }

        req.body = { ...req.body, payload }
        next()
    })
}

module.exports = verifyToken
