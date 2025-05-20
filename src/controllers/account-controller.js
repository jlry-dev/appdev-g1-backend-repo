const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const emailValidator = require('email-validator')
const asyncHandler = require('express-async-handler')
require('dotenv').config()

const usersModel = require('../models/users-model')
const pendingRegModel = require('../models/pending-regesiter-model')
const passwordRecoveryModel = require('../models/password-recovery')

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
        const u1 = await usersModel.retrieveUserByEmail(email)
        const u2 = await usersModel.retrieveUserByUsername(username)
        const p1 = await pendingRegModel.retrieveUserByEmail(email)
        const p2 = await pendingRegModel.retrieveUserByUsername(username)

        
        if (typeof u1 !== 'undefined' || typeof u2 !== 'undefined' || 
            typeof p1 !== 'undefined' || typeof p1 !== 'undefined') {
            throw new ConflictError(
                'Username or email is already taken. Please choose another one.',
            )
        }

        if (u1["user_id"] !== userID || u2["user_id"] !== userID || 
            p1["user_id"] !== userID || p2["user_id"] !== userID) {
            throw new ConflictError(
                'Username or email is already taken. Please choose another one.',
            )
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

    postRequestReset = asyncHandler(async function(req, res) {
        const validationErrs = validationResult(req).errors

        if (validationErrs.length > 0) {
            throw new BadRequestError('Data sent is invalid')
        }

        const { email } = req["body"]

        const user = await usersModel.retrieveUserByEmail(email)

        // * If user not found, return 202 with message and silent error.
        if (typeof user === 'undefined') {
            throw new NotFoundError('User not found.')  
        }

        if (user.is_verified === false) {
            throw new BadRequestError('Email is not verified')
        }
        
        let code
        const info = await passwordRecoveryModel.retrieveCodeInfo(email)
        if (typeof info !== 'undefined') {
            code = info["code"]
        } else {
            let code = Math.floor(100000 + Math.random() * 900000).toString();
            const expiration = new Date(Date.now() + 60 * 60 * 1000);
            await passwordRecoveryModel.insert(code, email, expiration)
        }
        
        await passwordRecoverEmailSender(email, code)

        res.status(202)
        res.json({
            message: 'Password recovery email sent.',
            status: 'sent',
        })
    })

    postConfirmReset = asyncHandler(async (req, res) => {
        const validationErrs = validationResult(req).errors

        if (validationErrs.length > 0) {
            throw new BadRequestError('Data sent is invalid')
        }

        const {email, code} = req["body"]

        const info = await passwordRecoveryModel.retrieveCodeInfo(email)

        if (info["tries"] >= 3) {
            passwordRecoveryModel.delete(email)
            throw new BadRequestError('Too many failed attempts')
        }

        if (typeof info === "undefined") {
            throw new NotFoundError('Request not found.')
        }

        if (info["code"] !== code){
            await passwordRecoveryModel.incrementTries(email)
            throw new BadRequestError('Invalid code')
        }

        res.status(202)
        res.json({
            email,
            message: 'Password reset authorized.',
        })

    })

    postPasswordReset = asyncHandler(async (req, res) => {
        const validationErrs = validationResult(req).errors

        if (validationErrs.length > 0) {
            throw new BadRequestError('Data sent is invalid')
        }

        const email= req["body"]
        const password = req["new-password"]

        const user = await usersModel.retrieveUserByEmail(email)
        await passwordRecoveryModel.delete(email)
        await usersModel.updatePassword(password, user["user_id"])
        
        res.status(202)
        res.json({
            message: 'Password reset succesfully.',
        })
    })
}

module.exports = new AccountController()
