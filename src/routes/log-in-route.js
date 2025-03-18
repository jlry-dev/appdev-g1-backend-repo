const { Router } = require('express')

const controller = require('../controllers/log-in-controllers')
const validator = require('../middlewares/validator')
const verifyToken = require('./middlewares/jwt-verifier-middleware')

const logInRouter = Router()

// path prefix "/log-in"

logInRouter.post('/', validator.logIn, controller.postLogIn)
logInRouter.post('/verify', verifyToken, (req, res) => 
    res.status(200).json({
      status: "success",
    })
  }

module.exports = logInRouter
