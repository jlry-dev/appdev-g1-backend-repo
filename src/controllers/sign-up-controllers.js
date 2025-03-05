const { validationResult } = require('express-validator')
const uuid4 = require('uuid').v4
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
require('dotenv').config()

const pendingRegModel = require('../models/pending-regesiter-model')
const ConflictError = require('../errors/conflict-error')
const BadRequestError = require('../errors/bad-request-error')
const emailSender = require('../lib/email-sender')

class SignUpController {
    postSignUp = asyncHandler(async (req, res) => {
        const validationErrs = validationResult(req).errors

        if (validationErrs.length > 0) {
            console.log(validationErrs)
            // return 400 if missing shiz or invalid
            throw new BadRequestError('Data sent is invalid')
        }

        // parse data
        const { email, username, password } = req.body

        const isPending = await pendingRegModel.checkPending(email, username)

        if (isPending) {
            // return 409 conflict already pending
            throw new ConflictError('User is already pending for verification.')
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
}

module.exports = new SignUpController()
