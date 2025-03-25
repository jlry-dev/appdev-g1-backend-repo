const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
require('dotenv').config()

const usersModel = require('../models/users-model')
const BadRequestError = require('../errors/bad-request-error')
const UnauthorizedError = require('../errors/unauthorized-error')

class LogInController {
    postLogIn = asyncHandler(async (req, res) => {
        const validationErrs = validationResult(req).errors

        if (validationErrs.length > 0) {
            throw new BadRequestError('Data sent is invalid.')
        }

        const { username, password } = req.body

        const user = await usersModel.retrieveUserByUsername(username)

        if (typeof user === 'undefined') {
            throw new UnauthorizedError('Invalid username or password.')
        }

        // check if password is matched
        const isMatched = await bcrypt.compare(password, user.password)

        if (!isMatched) {
            throw new UnauthorizedError('Invalid username or password')
        }

        // Generate JWT
        const token = jwt.sign(
            {
                user_id: user['user_id'],
                username: user.username,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d',
            }
        )

        res.status(200).json({
            token,
            status: 'success',
        })
    })

    verifyLogInToken(req, res) {
        res.status(200).json({
            status: 'success',
        })
    }
}

module.exports = new LogInController()
