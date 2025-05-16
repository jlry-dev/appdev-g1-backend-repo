const { validationResult } = require('express-validator')
const uuid4 = require('uuid').v4
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
require('dotenv').config()

const pendingRegModel = require('../models/pending-regesiter-model')
const usersModel = require('../models/users-model')

const ConflictError = require('../errors/conflict-error')
const BadRequestError = require('../errors/bad-request-error')
const NotFoundError = require('../errors/not-found-error')

const emailSender = require('../lib/email-sender')

class SignUpController {
    postSignUp = asyncHandler(async (req, res) => {
        const validationErrs = validationResult(req).errors

        if (validationErrs.length > 0) {
            // return 400 if missing shiz or invalid
            throw new BadRequestError('Data sent is invalid')
        }

        // parse data
        const { email, username, bdate, password } = req.body

        const isPending = await pendingRegModel.checkPending(email, username)
        const isRegistered = await usersModel.checkUser(email, username)

        // return 409 conflict already pending or already registered.
        if (isPending) {
            throw new ConflictError(
                'Username or email is already pending for verification.'
            )
        } else if (isRegistered) {
            throw new ConflictError('Username or email is already registered.')
        }

        // create a verification token
        const token = uuid4()
        const hashedPassword = await bcrypt.hash(
            password,
            Number(process.env.PASSWORD_SALT)
        )
        const expiration = new Date()
        expiration.setDate(expiration.getDate() + 1)

        // add to pending registration
        await pendingRegModel.insertUser(
            email,
            username,
            bdate,
            hashedPassword,
            token,
            expiration
        )

        // Send verification email
        await emailSender(email, username, token, expiration)

        // return 202 OK
        res.status(202)
        res.json({
            message:
                'Registration pending. Check your email for the verification link',
            status: 'pending',
            email: email,
        })
    })

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

        await usersModel.insertUser(user.email, user.username, user.bdate, user.password)
        await pendingRegModel.deleteUserByToken(token)

        res.status(200)
        res.json({
            message: 'User email verified, registration completed',
            status: 'verified',
            email: user.email,
        })
    })
}

module.exports = new SignUpController()
