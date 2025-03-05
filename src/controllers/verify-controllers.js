const asyncHandler = require('express-async-handler')

const pendingRegModel = require('../models/pending-regesiter-model')
const usersModel = require('../models/users-model')

const NotFoundError = require('../errors/not-found-error')
const BadRequestError = require('../errors/bad-request-error')

class VerifyController {
    verifyTokenByQuery = asyncHandler(async (req, res) => {
        const token = req.query.token

        const isPending = await pendingRegModel.checkPendingByToken(token)

        // Token is invalid or not found in pending.
        if (!isPending) {
            throw new BadRequestError('Token is invalid or expired.')
        }

        // Move user

        const user = await pendingRegModel.retrieveUserByToken(token)

        // These cases where the token was verified, then another process removed the user from the database.
        if (typeof user === 'undefined') {
            throw new NotFoundError('Token was valid, user not found.')
        }

        await usersModel.insertUser(user.email, user.username, user.password)
        await pendingRegModel.deleteUserByToken(token)

        res.status(200)
        res.json({
            message: 'User email verified, registration completed',
            status: 'verified',
            email: user.email,
        })
    })
}

module.exports = new VerifyController()
