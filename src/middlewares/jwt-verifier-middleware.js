const jwt = require('jsonwebtoken')
require("dotenv").config()

const usersModel = require('../models/users-model')

const ForbiddenError = require('../errors/forbidden-error')
const UnauthorizedError = require('../errors/unauthorized-error')

function verifyToken(req, res, next) {
    // TO DO: Add sanitizer here.

    const authHeader = req.header('Authorization')

    if (typeof authHeader === 'undefined') {
        next(new UnauthorizedError(
            'Missing authorization header. Provide a valid token.'
        ))
        return
    }

    // Parse token
    // Authorization: Bearer <token>
    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (typeof payload === 'undefined') {
            next(new UnauthorizedError('Invalid token.'))
            return
        }

        // * Token is valid, but user is not found.
        const userID = payload["user_id"]
        const user = await usersModel.retrieveUserByID(userID)
        if (!user) {
            next(new UnauthorizedError('Invalid token.'))
            return
        }

        if (err) {
            // We might be able to do something with this error
            // e.g If the token expires
            next(new ForbiddenError(err.message, err.name))
            return
        }

        req.body = { ...req.body, payload }
        next()
    })
}

module.exports = verifyToken
