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

        body('bdate')
            .notEmpty()
            .withMessage('Birthday is required')
            .custom((value) => {
                const parsedDate = new Date(value);
                if (isNaN(parsedDate)) {
                    throw new Error('Invalid date format');
                }

                const today = new Date();
                const minDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());

                if (parsedDate > minDate) {
                    throw new Error('You must be at least 13 years old');
                }

                return true;
            }),
    ]

    const updateInfo = [
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
        body('bdate')
            .notEmpty()
            .withMessage('Birthday is required')
            .custom((value) => {
                const parsedDate = new Date(value);
                if (isNaN(parsedDate)) {
                    throw new Error('Invalid date format');
                }

                const today = new Date();
                const minDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());

                if (parsedDate > minDate) {
                    throw new Error('You must be at least 13 years old');
                }

                return true;
            }),
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

    const updatePassword = [
        // No leading or trailing whitespace for username
        // Passwors should not contain trailing or leading whitespaces
        body('old-password')
            .trim()
            .notEmpty()
            .withMessage('Password must not be empty')
            .isLength({ min: 8, max: 64 }),

        body('new-password')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body["new-password"]) {
                    return false
                }

                return true
            })
            .withMessage('Password does not match'),

        body('confirm-password')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body["new-password"]) {
                    return false
                }

                return true
            })
            .withMessage('Password does not match'),
    ]
    

    return { signUp, logIn, updateInfo, updatePassword }
})()

module.exports = validator
