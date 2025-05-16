const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const emailValidator = require('email-validator')
const asyncHandler = require('express-async-handler')
require('dotenv').config()

const usersModel = require('../models/users-model')
const BadRequestError = require('../errors/bad-request-error')
const UnauthorizedError = require('../errors/unauthorized-error')

class AccountController {
    getInfo = asyncHandler(async function(req, res) {
        const userID = req["payload"]["user_id"]

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
        const userID = req["payload"]["user_id"]

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

        const userID = req["payload"]["user_id"]
        const {username, email, bdate} = req["body"]

        const user = await usersModel.retrieveUserByID(userID)

        if (typeof user === 'undefined') {
            throw new NotFoundError('User not found.')
        }

        // TO DO: Make the email verifiable

        await updateInfo(username, email, bdate, userID)

        res.status(202)
        res.json({
            message:
                'Info updated successfully',
            status: 'updated',
        })
    })

    postAccountDelete = asyncHandler(async function(req, res) {
        const userID = req["payload"]["user_id"]

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
}

module.exports = new AccountController()
