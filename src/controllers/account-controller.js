const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const emailValidator = require('email-validator')
const asyncHandler = require('express-async-handler')
require('dotenv').config()

const usersModel = require('../models/users-model')
const pendingRegModel = require('../models/pending-regesiter-model')
const {passwordRecoverEmailSender} = require('../lib/email-sender')
const BadRequestError = require('../errors/bad-request-error')
const UnauthorizedError = require('../errors/unauthorized-error')
const NotFoundError = require('../errors/not-found-error')
const ConflictError = require('../errors/conflict-error')

class AccountController {
    getInfo = asyncHandler(async function(req, res) {
        const userID = req["body"]["payload"]["user_id"]

        const user = await usersModel.retrieveUserByID(userID)

        if (typeof user === 'undefined') {
            throw new NotFoundError('User not found.')
        }

        res.status(202)
        res.json({
            username: user.username,
            email: user.email,
            bdate: user.bdate,
        })
    })

    postNewPassword = asyncHandler(async function(req, res) {
        const validationErrs = validationResult(req).errors

        if (validationErrs.length > 0) {
            // return 400 if missing shiz or invalid
            throw new BadRequestError('Data sent is invalid')
        }
        
        const oldPassword = req["body"]["old-password"]
        const userID = req["body"]["payload"]["user_id"]

        const user = await usersModel.retrieveUserByID(userID)

        if (typeof user === 'undefined') {
            throw new NotFoundError('User not found.')
        }

        // check if password is matched
        const isMatched = await bcrypt.compare(oldPassword, user.password)


        if (!isMatched) {
            throw new UnauthorizedError('Password not matched.')
        }

        const newPassword = await bcrypt.hash(
            req["body"]["new-password"], 
            Number(process.env.PASSWORD_SALT)
        )

        await usersModel.updatePassword(newPassword, userID)

        res.status(202)
        res.json({
            message:
                'Password updated successfully',
            status: 'updated',
        })
    })

    postInfoUpdate = asyncHandler(async function(req, res) {
        const validationErrs = validationResult(req).errors

        if (validationErrs.length > 0) {
            // return 400 if missing shiz or invalid
            throw new BadRequestError('Data sent is invalid')
        }

        const userID = req["body"]["payload"]["user_id"]
        const {username, email, bdate} = req["body"]

        // * Check if the email or username is already pending or registered.
        const isPending = await pendingRegModel.checkPending(email, username)
        const isRegistered = await usersModel.checkUser(email, username)
        if (isPending) {
            throw new ConflictError(
                'Username or email is already pending for verification.'
            )
        } else if (isRegistered) {
            throw new ConflictError('Username or email is already used.')
        }

        const user = await usersModel.retrieveUserByID(userID)

        if (typeof user === 'undefined') {
            throw new NotFoundError('User not found.')
        }

        // TO DO: Make the email verifiable

        // * Update the info (also set isVerified to false)
        await usersModel.updateInfo(username, email, bdate, false, userID)

        res.status(202)
        res.json({
            message:
                'Info updated successfully',
            status: 'updated',
        })
    })

    postDeleteAccount = asyncHandler(async function(req, res) {
        const userID = req["body"]["payload"]["user_id"]

        const user = await usersModel.retrieveUserByID(userID)

        if (typeof user === 'undefined') {
            throw new NotFoundError('User not found.')
        }

        await usersModel.deleteAccount(userID)

        res.status(202)
        res.json({
            message:
                'Account deleted successfully',
            status: 'deleted',
        })
    })

    getPasswordRecover = asyncHandler(async function(req, res) {
        const validationErrs = validationResult(req).errors

        if (validationErrs.length > 0) {
            throw new BadRequestError('Data sent is invalid')
        }

        const { email } = req["body"]

        const user = await usersModel.retrieveUserByEmail(email)

        // * If user not found, return 202 with message and silent error.
        if (typeof user === 'undefined') {
            res.status(202)
            res.json({
                message: 'Email not found.',
                status: 'not-found',
            })
            return
        }

        if (user.is_verified === false) {
            res.status(202)
            res.json({
                message: 'Email not verified.',
                status: 'not-verified',
            })
        }

        const token = jwt.sign({ user_id: user["user_id"] }, process.env.JWT_SECRET, { expiresIn: '1h' })

        await passwordRecoverEmailSender(email, user.username, token)

        res.status(202)
        res.json({
            message: 'Password recovery email sent.',
            status: 'sent',
        })
    })
    // getPasswordRecover = asyncHandler(async function(req, res) {}
    // postPasswordRecover = asyncHandler(async function(req, res) {}
}

module.exports = new AccountController()
