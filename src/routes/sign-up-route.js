const { Router } = require('express')

const controller = require('../controllers/sign-up-controllers')
const validator = require('../middlewares/validator')

const signUpRouter = Router()

// path prefix "/sign-up"

signUpRouter.post('/', validator.signUp, controller.postSignUp) // Verify the data first

module.exports = signUpRouter
