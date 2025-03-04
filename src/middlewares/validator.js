const { body } = require('express-validator')
const { sign } = require('jsonwebtoken')

const validator = (() => {
    const signUp = [
        body('username')
            .trim()
            .notEmpty()
            .withMessage('Username must not be empty')
            .isAlphanumeric()
            .withMessage('Username should be alphanumeric only')
            .isLength({ min: 3, max: 30 })
            .withMessage('Length must be between 3 and 30'),
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email must not be empty')
            .isEmail()
            .withMessage('Invalid email'),
        // Passwors should not contain trailing and leading whitespaces
        body('password')
            .trim()
            .notEmpty()
            .withMessage('Password must not be empty'),
        body('confirm-password')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    return false
                }

                return true
            })
            .withMessage('Password does not match'),
    ]

    return { signUp }
})()

module.exports = validator
