const emailValidator = require('email-validator')
const { body } = require('express-validator')

const validator = (() => {
    const signUp = [
        // No leading or trailing whitespace for username
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
        // Passwors should not contain trailing or leading whitespaces
        body('password')
            .trim()
            .notEmpty()
            .withMessage('Password must not be empty')
            .isLength({ min: 8, max: 64 }),
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

    const logIn = (req, res, next) => {
        const { userIdentifier } = req.body

        if (emailValidator.validate(userIdentifier)) {
            // REF: redundant? Need refactor.
            body('userIdentifier')
                .trim()
                .notEmpty()
                .withMessage('Email must not be empty')
                .isEmail()
                .withMessage('Invalid email')

            return next()
        }

        body('userIdentifier')
            .trim()
            .notEmpty()
            .withMessage('Username must not be empty')
            .isAlphanumeric()
            .withMessage('Username should be alphanumeric only')
            .isLength({ min: 3, max: 30 })
            .withMessage('Length must be between 3 and 30')

        body('password')
            .trim()
            .notEmpty()
            .withMessage('Password must not be empty')
            .isLength({ min: 8, max: 64 })

        return next()
    }

    return { signUp, logIn }
})()

module.exports = validator
