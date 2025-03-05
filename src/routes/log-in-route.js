const { Router } = require('express')

const controller = require('../controllers/log-in-controllers')
const validator = require('../middlewares/validator')

const logInRouter = Router()

// path prefix "/log-in"

logInRouter.post('/', validator.logIn, controller.postLogIn)

module.exports = logInRouter
