const { Router } = require('express')

const controller = require('../controllers/sign-up-controllers')
const validator = require('../middlewares/validator')

const signUpRouter = Router()

// path prefix "/sign-up"

signUpRouter.post('/', validator.signUp, controller.postSignUp) // Verify the data first
signUpRouter.get('/verify', controller.verifyTokenByQuery)

module.exports = signUpRouter
